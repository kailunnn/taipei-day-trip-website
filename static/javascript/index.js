const pictureSection = document.querySelector(".pictureSection");
const footer = document.querySelector(".footer");
const inputText = document.querySelector(".siteKeyword");
const searchBtn = document.querySelector(".search");

let ticking = false;
let nextPage = 0;
let keyword = "";

getInfiniteData();
window.addEventListener("scroll", infiniteLoad);
searchBtn.addEventListener("click", searchAttraction);

// 自動載入下一頁
function infiniteLoad(){
    const {top} = footer.getBoundingClientRect();
    // footer 頂端已進入畫面
    if(top <= window.innerHeight){
        if(!ticking){
            window.requestAnimationFrame(getInfiniteData);
            ticking = true;
        }
    }
}

// 關鍵字搜尋景點
function searchAttraction(){
    nextPage = 0;
    keyword = inputText.value;
    pictureSection.innerHTML = "";
    getInfiniteData();
}

// 取得資料
function getInfiniteData(){
    if(nextPage != null){
        // 沒有關鍵字
        if(keyword == ""){
            url = `/api/attractions?page=${nextPage}`;
        // 有關鍵字，且 page 等於 0
        }else if(keyword && nextPage == 0){
            url = `/api/attractions?keyword=${keyword}`;
        // 有關鍵字，且 page 不等於 0
        }else{
            url = `/api/attractions?keyword=${keyword}&page=${nextPage}`;
        }
        
        fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(result){
            renderPicture(result);
            nextPage = result.nextPage;
        })

    }
}

// 渲染景點畫面
function renderPicture(result){
    let datas = result.data;
    if(datas.length == 0){
        let noData = document.createElement("p");
        noData.append(document.createTextNode("查無資料"));
        pictureSection.appendChild(noData);
    };

    let fragment = document.createDocumentFragment();
    for(i=0; i<datas.length; i++){
        image = datas[i].images[0];
        
        let li = document.createElement("li");

        let detail = li.appendChild(document.createElement("a"));
        detail.setAttribute("data-id", datas[i].id);
        detail.setAttribute("class", "showDetail");
        detail.setAttribute("href", `/attraction/${datas[i].id}`);

        let pic = detail.appendChild(document.createElement("img"));
        pic.setAttribute("src", image);

        let title = detail.appendChild(document.createElement("p"));
        title.setAttribute("class", "attractionName");
        title.append(document.createTextNode(datas[i].name));

        let category = detail.appendChild(document.createElement("div"));
        category.setAttribute("class","category");
        mrt = category.appendChild(document.createElement("p"));
        mrt.append(document.createTextNode(datas[i].mrt));
        kind = category.appendChild(document.createElement("p"));
        kind.append(document.createTextNode(datas[i].category));

        fragment.appendChild(li);
    }
    pictureSection.appendChild(fragment);
    ticking = false;
}


