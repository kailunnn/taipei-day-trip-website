// 取得路徑
let passPath = (window.location.pathname);
let id = passPath.substring(12);
let data;
let slideIndex = 1;


getData(id);

// 監聽 radioBtn 改變顯示價格
const radioBtn = document.querySelectorAll('input[name=peroid]');
radioBtn.forEach(radioInput => radioInput.addEventListener("change", onChange))
function onChange(){
    let checked = document.querySelector('input[name="peroid"]:checked').value;
    let price = document.querySelector(".price");
    if(checked == "上半天"){
        price.textContent = "新台幣 2000 元";
    }else if(checked=="下半天"){
        price.textContent = "新台幣 2500 元";
    }
    // console.log(checked)
}

// 取得景點資料
function getData(id){
    let url = `/api/attraction/${id}`;
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        data = result.data;
        renderData(data);
    })
}

// 渲染景點資料
function renderData(data){
    // 將圖片從陣列取出，逐一放進 img 標籤
    let pics = data.images;
    const slides = document.querySelector(".slides");
    pics.forEach((pic)=>{
        console.log(pic)
        let image = document.createElement("img");
        image.setAttribute("class", "pic fade");
        image.setAttribute("src", pic);
        slides.appendChild(image);
    })

    // 幾張圖片幾個 dot
    const dots = document.querySelector(".dots");
    for(let i=1; i<=pics.length; i++){
        let dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.setAttribute("onclick", `currentSlide(${i})`);
        // dot.onclick = function(){currentSlide(i);};
        dots.appendChild(dot);
    }

    const title = document.querySelector(".title");
    title.append(document.createTextNode(data.name));

    const category = document.querySelector(".category");
    category.append(document.createTextNode(`${data.category} at ${data.mrt}`));

    const description = document.querySelector(".description");
    description.append(document.createTextNode(data.description));

    const address = document.querySelector(".address");
    address.append(document.createTextNode(data.address));

    const transport = document.querySelector(".transport");
    transport.append(document.createTextNode(data.transport));

    console.log(data)
    showSlides(slideIndex);
}

// 上一張、下一張按鈕
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// 直接點擊 dot
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(index){
    let picsALL = document.getElementsByClassName("pic");
    let dotsALL = document.getElementsByClassName("dot");
    // 第五張右滑，回到第一張
    if (index > picsALL.length) {slideIndex = 1}
    // 第一張左滑，回到最後一張
    if (index < 1) {slideIndex = picsALL.length}

    for (let i = 0; i < picsALL.length; i++) {
        picsALL[i].style.display = "none";
    }
    for (let i = 0; i < dotsALL.length; i++) {
        dotsALL[i].className = dotsALL[i].className.replace(" active", "");
    }

    picsALL[slideIndex-1].style.display = "block";
    dotsALL[slideIndex-1].className += " active";
}

