getState()

function getState(){
    const url = "/api/user";
    fetch(url)
    .then( response => response.json())
    .then( data => takeState(data))
    .catch( error => console.error(error))
}

function takeState(data){
    // 如果沒有登入，直接導回首頁
    if(data.data === null){
        window.location = "/";
    }else{
        getBookingData()
        // {data: {email: 'red@gmail.com', id: 1, name: '小紅'}
        const name = document.querySelector(".itinerary-username span");
        name.append(document.createTextNode(data.data.name));
    }
}

function getBookingData(){
    const url = "/api/booking";
    fetch(url)
    .then( response => response.json())
    .then( data => renderBooking(data))
    .catch( error => console.error(error))
}

// 渲染預定行程
function renderBooking(data){
    let itineraryData = data.data
    console.log(itineraryData)

    // 沒有有預定行程
    if(itineraryData === null){
        const content = document.querySelector(".content");
        const itinerary = document.querySelector(".itinerary");
        const bookingInfo = document.querySelectorAll(".info-layout");

        itinerary.style.display = "none";
        bookingInfo.forEach((item)=>{
            item.style.display = "none";
        })

        let noBooking = document.createElement("span");
        noBooking.setAttribute("class", "noBooking")
        noBooking.append(document.createTextNode("目前沒有任何待預訂的行程"));
        content.appendChild(noBooking);

        const footer = document.querySelector(".footer");
        footer.style.position = "fixed";
        footer.style.left = 0;
        footer.style.bottom = 0;
        footer.style.width = '100%';

    // 有預定行程
    }else{
    
        // 判斷時間
        let timePeriod;
        if(itineraryData.time === "morning"){
            timePeriod = "早上 9 點到下午 4 點"
        }else{
            timePeriod = "下午 2 點到晚上 9 點"
        }
        const itineraryImg = document.querySelector(".site-pic img");
        itineraryImg.setAttribute("src", itineraryData.attraction.image)

        const itineraryName = document.querySelector(".itinerary-name span");
        itineraryName.append(document.createTextNode(itineraryData.attraction.name));

        const itineraryDate =  document.querySelector(".itinerary-date");
        itineraryDate.append(document.createTextNode(itineraryData.date));

        const itineraryTime = document.querySelector(".itinerary-time");
        itineraryTime.append(document.createTextNode(timePeriod));

        const itineraryPrice = document.querySelector(".itinerary-price");
        itineraryPrice.append(document.createTextNode(`新台幣 ${itineraryData.price} 元`));

        const itineraryLocation = document.querySelector(".itinerary-location");
        itineraryLocation.append(document.createTextNode(itineraryData.attraction.address));
    }
}

// 點選垃圾桶按鈕 - 刪除行程
function deleteSchedule(){
    const url = "/api/booking";
    fetch(url,{
        method: 'DELETE',
    })
    .then( response => response.json())
    .then( data => {
        if("ok" in data){
            // 頁面重整
            window.location.reload();
        }
    })
    .catch( error => console.error(error))
}
