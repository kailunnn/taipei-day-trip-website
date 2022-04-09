let passPath = window.location.search;
let trackingNumber = passPath.split("number=")[1]

getOrder(trackingNumber)

// 取得訂單資訊
function getOrder(trackingNumber){
    const url = `/api/order/${trackingNumber}`;
    fetch(url)
    .then(response => response.json())
    .then(data => renderThankyou(data))
    .catch(error => console.error(error)) 
}

function renderThankyou(data){
    console.log(data)
    if(!('error' in data)){
        let status = data.data.status;

        const correctOrder = document.querySelector(".correct-order");
        const wrongOrder = document.querySelector(".wrong-order");
        const trackingSection = document.querySelector(".tracking-number");
        status === 0 ? correctOrder.style.display = "block" : wrongOrder.style.display = "block";
        trackingSection.textContent = trackingNumber;
    }else{
        window.location = "/";
    }

}

