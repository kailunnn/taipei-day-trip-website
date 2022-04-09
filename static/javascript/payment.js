const sureBtn = document.querySelector(".sureBtn");

// step 2：利用 TPDirect.setupSDK 設定參數
TPDirect.setupSDK(124008, 'app_Y7dsgZfXc68mWcGhLsYg9C4Hx7hLORipH8AlbPzHKekkUReRDOrDUg76zeqA', 'sandbox')

// step 3：使用 TPDirect.card.setup 設定外觀
let fields = {
    number: {
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: '#card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CVV'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        }
    }
})

// 當點下按鈕時，向 tappay 取得 prime
sureBtn.onclick = function(){
    // step 4：利用 TPDirect.card.getTappayFieldsStatus() 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime');
        return
    }

    // step 5：Get prime，利用 TPDirect.card.getPrime 來取得 prime 字串
    let prime;
    TPDirect.card.getPrime((result) => {
        // console.log(result)
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg);
            return
        }
        prime =  result.card.prime;
        sendPrimeToOrderAPI(prime);
    })
}

// step 6：將 prime 送到後端訂單 API
function sendPrimeToOrderAPI(prime){
    let userName = document.querySelector(".contact-name").value;
    let userEmail = document.querySelector(".contact-email").value;
    let userPhone = document.querySelector(".contact-phone").value;
    if(userName === "" || userEmail === "" || userPhone === ""){
        console.log("請填寫完整資料")
        return
    }
    // 處理時間
    const timePeriod = document.querySelector(".itinerary-time");
    let time = (timePeriod.textContent === "早上 9 點到下午 4 點") ? "morning" : "afternoon";
   
    let data = {
        "prime": prime,
        "order": {
          "price": document.querySelector(".itinerary-price").textContent,
          "trip": {
            "attraction": {
              "id": attractionId,
              "name": document.querySelector(".itinerary-name span").textContent,
              "address": document.querySelector(".itinerary-location").textContent,
              "image": document.querySelector(".site-pic img").src
            },
            "date": document.querySelector(".itinerary-date").textContent,
            "time": time
          },
          "contact": {
            "name": userName,
            "email": userEmail,
            "phone": userPhone
          }
        }
    }
    // console.log(data)

    const url = "/api/orders"
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then( response => response.json())
    .then( data => getOrderNumber(data))
    .catch( error => console.error(error))
}

let trackigMessage;
let trackigStatus;
// 取得訂單編號後，導向感謝頁面
function getOrderNumber(data){
    let trackingNumber = data.data.number;
    // let trackigMessage = data.data.payment.message;
    // let trackigStatus = data.data.payment.status;
    trackigMessage = data.data.payment.message;
    trackigStatus = data.data.payment.status;
    
    // 導向到 thankyou 頁面
    window.location = `/thankyou?number=${trackingNumber}`;
}



