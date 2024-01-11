const imagesWrapper = document.querySelector(".images");
const loadmorebtn= document.querySelector(".load-more");
const searchInput= document.querySelector(".search-box");
const lightBox= document.querySelector(".lightbox");
const closebtn= lightBox.querySelector(".uil-times");
const downloadimgBTN= lightBox.querySelector(".uil-import");

const apikey ="YIJsSSQo4cvuCAce2pM26VZMRxVcNZniPFJH3EVAA3PYFkTIqaqR4KB8";
const perPage=15;
let currentPage=1;
let searchTerm = null;
const downloadImage = (imgURL) =>{
    fetch(imgURL).then(res => res.blob()).then(file=>{
        // console.log(file);
        const a=document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download=new Date().getTime();
        a.click();  
    }).catch(()=>alert("Failed to download image"));
}

const showLightbox = (name , img) =>{
    lightBox.querySelector("img").src=img;
    lightBox.querySelector("span").innerText=name;
    lightBox.classList.add("show");
    downloadimgBTN.setAttribute("data-img",img);
    document.body.style.overflow = "hidden";
}

const closeLightbox = () =>{
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) =>{
    //making li of fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML+=images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}' , '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImage('${img.src.large2x}');event.stopPropagation();">
                <i class="uil uil-import"></i>
            </button>
        </div>
      </li>`    
    ).join("");
}
const getImages = (apiURL) =>{
    //Fetchig images by api call with authorization header
    loadmorebtn.innerHTML = "Loading...";
    loadmorebtn.classList.add("disabled");
    fetch(apiURL,{
        headers: {Authorization:apikey}
    }).then(res=> res.json()).then(data=>{
        // console.log(data);  
        generateHTML(data.photos);
        loadmorebtn.innerHTML = "Load more";
        loadmorebtn.classList.remove("disabled");
    }).catch(()=> alert("Failed to load images !"));
}
const loadMoreImages = () =>{
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}` ;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}$page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL)
}
const loadSearchImages = (e) =>{
    if(e.target.value === " ") return searchTerm=null;
    if(e.key === "Enter"){
        // console.log("Enter key passed");
        currentPage=1;
        searchTerm=e.target.value;
        imagesWrapper.innerHTML="";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}$page=${currentPage}&per_page=${perPage}`)
    }
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadmorebtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closebtn.addEventListener("click",closeLightbox);
downloadimgBTN.addEventListener("click", (e) => downloadImage(e.target.dataset.img   ));