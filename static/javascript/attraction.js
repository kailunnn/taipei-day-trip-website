// 取得路徑
let passPath = (window.location.pathname);
let id = passPath.substring(12);
let data;
let slideIndex = 1;


getData(id);
getStatus();

// 監聽 radioBtn 改變顯示價格
const radioBtn = document.querySelectorAll('input[name=peroid]');
radioBtn.forEach(radioInput => radioInput.addEventListener("change", onChange));
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






const modalBox = document.querySelector(".modalBox");
const signInUp = document.querySelector(".signInUp");
const signOut = document.querySelector(".signOut");
const closeBtn = document.querySelectorAll(".close");
// 登入區塊
const signInSection = document.querySelector(".signInSection");
const createAccount = document.querySelector(".createAccount");
const signinBtn = document.querySelector(".signinBtn");
const signinInput = document.querySelectorAll(".signInSection input");
const errorMsg = document.querySelector(".signInSection .errorMsg");
// 註冊區塊
const signUpSection = document.querySelector(".signUpSection");
const loginAccount = document.querySelector(".loginAccount");
const signupBtn = document.querySelector(".signupBtn");
const signupInput = document.querySelectorAll(".signUpSection input");
const msg = document.querySelector(".signUpSection .msg");

// 查看使用者狀態
function getStatus(){
    const url = "/api/user";
    fetch(url)
    .then( response => response.json())
    .then( data => showInOrOut(data))
    .catch( error => console.error(error))
}

// 判斷該顯示 登入/註冊 或者 登出系統
function showInOrOut(status){
    // console.log(status)
    if(status.data !== null){
        signInUp.style.display = "none";
        signOut.style.display = "block";
    }else{
        signInUp.style.display = "block";
        signOut.style.display = "none";
    }
}

// 點選登出按鈕
signOut.onclick = function(){
    const url = "/api/user";
    fetch(url,{
        method: 'DELETE',
    })
    .then( response => response.json())
    .then( data => {
        if(Object.keys(data)[0] == "ok"){
            // 頁面重整
            window.location.reload();
        }
    })
    .catch( error => console.error(error))
}

// 使用者登入按鈕
signinBtn.onclick = function(){
    const email = signinInput[0].value;
    const password = signinInput[1].value;
    const data = {
        "email": email,
        "password": password
    }
    signMember(data, "PATCH");
};

// 使用者註冊按鈕
signupBtn.onclick = function(){
    const username = signupInput[0].value;
    const email = signupInput[1].value;
    const password = signupInput[2].value;
    if(username == "" || email == "" || password == ""){
        msg.textContent = "請輸入完整資訊"
    }else{
        const data = {
            "name": username,
            "email": email,
            "password": password
        }
        signMember(data, "POST");
    }
};

// 登入或註冊的 fetch api
function signMember(data, httpMethod){
    console.log(data, httpMethod)
    url = "/api/user";
    fetch(url,{
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then( response => response.json())
    .then( data => {
        if(httpMethod == 'PATCH'){
            renderSignin(data)
        }else if(httpMethod == 'POST'){
            renderSignup(data)
        }
    })
    .catch( error => console.error(error))
}

// 渲染登入成功 or 失敗
function renderSignin(data){
    let status = Object.keys(data)[0];
    if(status == 'ok'){
        // 處理登入成功
        errorMsg.textContent = "";
        // 頁面重整
        window.location.reload();
    }else{
        errorMsg.textContent = "帳號或密碼輸入錯誤";
    }
}

// 渲染註冊成功 or 失敗
function renderSignup(data){
    let status = Object.keys(data)[0];
    let message = data.message
    
    if(status == 'ok'){
        // 處理註冊成功，會直接紀載已登入狀態
        msg.textContent = "註冊成功";
    }else{
        msg.textContent = message;
    }

    signupInput.forEach ( (input) => input.value = "")
}


// navbar 上登入 & 註冊按鈕
signInUp.onclick = function(){
    modalBox.style.display = "block";
    // signUpSection.style.display = "none"
};

// 使用者點擊視窗範圍外，關閉視窗
window.onclick = function(event) {
    if (event.target == modalBox) {
      modalBox.style.display = "none";
      clearInputMsg()
    }
};

// 視窗關閉
closeBtn.forEach( btn => btn.onclick = function(){
    modalBox.style.display = "none";
    clearInputMsg()
});

// 前往註冊新帳號
createAccount.onclick = function(){
    clearInputMsg()
    signInSection.style.display = "none";
    signUpSection.style.display = "block";
};

// 前往登入帳號
loginAccount.onclick = function(){
    clearInputMsg()
    signInSection.style.display = "block";
    signUpSection.style.display = "none";
};

// 清空 input 與訊息
function clearInputMsg(){
    // 清空輸入框與訊息內容
    signupInput.forEach ( (input) => input.value = "");
    signinInput.forEach ( (input) => input.value = "");
    errorMsg.textContent = "";
    msg.textContent = "";
}

