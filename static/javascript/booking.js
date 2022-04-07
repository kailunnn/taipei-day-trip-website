getState()
let attractionId;

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

        const contactName = document.querySelector(".contact-name");
        contactName.setAttribute("value", data.data.name);
        const contactEmail = document.querySelector(".contact-email");
        contactEmail.setAttribute("value", data.data.email);
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
    let itineraryData = data.data;

    // 沒有預定行程
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
        attractionId = itineraryData.attraction.id;
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

        const itineraryPrice = document.querySelectorAll(".itinerary-price");
        itineraryPrice.forEach((element)=>{
            element.append(document.createTextNode(itineraryData.price));
        })

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
