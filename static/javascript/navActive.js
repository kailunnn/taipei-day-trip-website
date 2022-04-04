// 記錄使用者登入的帳號
// let inOrOutStatus 
// console.log(inOrOutStatus)
// 登入/註冊 共同區塊
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
// 預定行程
// const schedule = document.querySelector(".schedule")

getStatus();

// 點選 navbar 上的預定行程按鈕 fetch get api
function getScheduleApi(){
    const url = "/api/booking";
    fetch(url)
    .then( response => response.json())
    .then( data => islogin(data))
    .catch( error => console.error(error))
}

// 點選預定行程
function islogin(data){
    // console.log(data)
    // 若是未登入
    if( 'error' in data){
        if(data.message === "未登入系統，拒絕存取"){
            modalBox.style.display = "block";
        }
    // 若是已經登入，則跳轉到 booking 頁面
    }else{
        window.location = "/booking";
    }
    
}

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
    // inOrOutStatus = status.data
    // console.log(inOrOutStatus)
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
