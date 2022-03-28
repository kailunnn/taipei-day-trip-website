let html_nav = document.querySelector(".sticky");
let fragment = document.createDocumentFragment();

// nav 裡面的 navbar
let html_navbar = html_nav.appendChild(document.createElement("div"));
html_navbar.setAttribute("class", "navbar");

// navbar 裡的 h1 與 navbar-right div
let html_title = html_navbar.appendChild(document.createElement("h1"));
html_title.append(document.createTextNode("台北一日遊"));
let html_navbarRight = html_navbar.appendChild(document.createElement("div"));
html_navbarRight.setAttribute("class", "navbar-right");

// navbar-right 裡面
let html_schedule = html_navbarRight.appendChild(document.createElement("a"));
html_schedule.setAttribute("class", "schedule");
html_schedule.setAttribute("href", "javascript:void(0);");
html_schedule.append(document.createTextNode("預定行程"));

let html_signInUp = html_navbarRight.appendChild(document.createElement("a"));
html_signInUp.setAttribute("class", "signInUp");
html_signInUp.setAttribute("href", "javascript:void(0);");
html_signInUp.append(document.createTextNode("登入/註冊"));

let html_signOut = html_navbarRight.appendChild(document.createElement("a"));
html_signOut.setAttribute("class", "signOut");
html_signOut.setAttribute("href", "javascript:void(0);");
html_signOut.append(document.createTextNode("登出系統"));

// navbar-right 裡的 modalBox
let html_modalBox = html_navbarRight.appendChild(document.createElement("div"));
html_modalBox.setAttribute("class", "modalBox");

// modalBox 裡的 modalContent
let html_signInSection = html_modalBox.appendChild(document.createElement("div"));
html_signInSection.setAttribute("class", "modalContent signInSection");
let html_signUpSection = html_modalBox.appendChild(document.createElement("div"));
html_signUpSection.setAttribute("class", "modalContent signUpSection");

// signInSection 裡的資訊
let html_line = html_signInSection.appendChild(document.createElement("div"));
html_line.setAttribute("class", "line");

let html_closed = html_signInSection.appendChild(document.createElement("span"));
html_closed.setAttribute("class", "close");
html_closed.innerHTML = "&times;";

let html_inTxt = html_signInSection.appendChild(document.createElement("h2"));
html_inTxt.append(document.createTextNode("登入會員帳號"));

let html_inEmail = html_signInSection.appendChild(document.createElement("input"));
html_inEmail.setAttribute("type", "text");
html_inEmail.setAttribute("class", "email");
html_inEmail.setAttribute("placeholder", "輸入電子信箱");

let html_inPassword = html_signInSection.appendChild(document.createElement("input"));
html_inPassword.setAttribute("type", "password");
html_inPassword.setAttribute("class", "password");
html_inPassword.setAttribute("placeholder", "輸入密碼");

let html_inBtn = html_signInSection.appendChild(document.createElement("button"));
html_inBtn.setAttribute("class", "signBtn signinBtn");
html_inBtn.append(document.createTextNode("登入帳戶"));

let html_inMsg = html_signInSection.appendChild(document.createElement("span"));
html_inMsg.setAttribute("class", "errorMsg");

let html_createAccount = html_signInSection.appendChild(document.createElement("span"));
html_createAccount.setAttribute("class", "link createAccount");
html_createAccount.append(document.createTextNode("還沒有帳戶？點此註冊"));

// signUpSection 裡的資訊
let html_upline = html_signUpSection.appendChild(document.createElement("div"));
html_upline.setAttribute("class", "line");

let html_upclosed = html_signUpSection.appendChild(document.createElement("span"));
html_upclosed.setAttribute("class", "close");
html_upclosed.innerHTML = "&times;";

let html_upTxt = html_signUpSection.appendChild(document.createElement("h2"));
html_upTxt.append(document.createTextNode("註冊會員帳號"));

let html_upName = html_signUpSection.appendChild(document.createElement("input"));
html_upName.setAttribute("type", "text");
html_upName.setAttribute("class", "name");
html_upName.setAttribute("placeholder", "輸入姓名");

let html_upEmail = html_signUpSection.appendChild(document.createElement("input"));
html_upEmail.setAttribute("type", "text");
html_upEmail.setAttribute("class", "email");
html_upEmail.setAttribute("placeholder", "輸入電子郵件");

let html_upPassword = html_signUpSection.appendChild(document.createElement("input"));
html_upPassword.setAttribute("type", "password");
html_upPassword.setAttribute("class", "password");
html_upPassword.setAttribute("placeholder", "輸入密碼");

let html_upBtn = html_signUpSection.appendChild(document.createElement("button"));
html_upBtn.setAttribute("class", "signBtn signupBtn");
html_upBtn.append(document.createTextNode("註冊新帳戶"));

let html_upMsg = html_signUpSection.appendChild(document.createElement("span"));
html_upMsg.setAttribute("class", "errorMsg msg");

let html_loginAccount = html_signUpSection.appendChild(document.createElement("span"));
html_loginAccount.setAttribute("class", "link loginAccount");
html_loginAccount.append(document.createTextNode("已經有帳戶了？點此登入"));

fragment.appendChild(html_navbar);
html_nav.appendChild(fragment);


