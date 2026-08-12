// selection
const themeButton = document.querySelector(".themeButton");
const root = document.documentElement;
const imageInput = document.querySelector(".imageInput");
const searchButton = document.querySelector(".searchButton")
const photoSection = document.querySelector(".photoSection");
const outerDiv = document.querySelector(".outerDiv");
const saveButton = document.querySelector(".saveButton");
const saveImageDiv= document.querySelector(".saveImageDiv");
const backButton = document.querySelector(".backButton");
const previewsButton = document.querySelector("#previewsButton");
const currentButton=document.querySelector("#currentButton");
const nextButton = document.querySelector("#nextButton");
let pageNo =1;

// Theme related code
let theme = localStorage.getItem("theme") || "dark";
function themeFun(themeVal) {
  if (themeVal === "dark") {
    root.style.setProperty("--background", "rgba(49, 48, 48, 0.797)");
    root.style.setProperty("--color", "white");
    root.style.setProperty("--bodyColor", "black");
    root.style.setProperty("--shadowColor", "rgb(122, 121, 121)");
    themeButton.innerHTML = "Dark";
  } else {
    root.style.setProperty("--background", "rgba(239, 237, 237, 0.797)");
    root.style.setProperty("--color", "black");
    root.style.setProperty("--bodyColor", "white");
    root.style.setProperty("--shadowColor", "rgb(122, 121, 121)");
    themeButton.innerHTML = "Light";
  }
}
themeFun(theme);


//  change theme
function themeChangeFun(){
themeButton.addEventListener("click", () => {
  let currentTheme = localStorage.getItem("theme");
  theme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme);
  themeFun(theme);
});
}
themeChangeFun()



let value = "";
function takeInputValue(){
searchButton.addEventListener("click", () => {
  if (imageInput.value.trim() === "") {
    return;
  }
  value = imageInput.value.trim();
  getImages(value);
imageLargeAndSmallFun()
  imageInput.value = "";
});

}
takeInputValue()


// this function used to scale size of image and when you double tab it resize your image
function imageLargeAndSmallFun(){
const photoSectionImage = document.querySelectorAll(".photoSection div");

  photoSectionImage.forEach((elem) => {
  elem.addEventListener("click", () => {
    outerDiv.style.display = "block";
    if(window.innerWidth < 768){

   elem.style.transform = "scale(1.2)";

}else{

   elem.style.transform = "scale(2)";

}
    elem.style.zIndex = 2;
  });
  elem.addEventListener("dblclick", () => {
    outerDiv.style.display = "none";
    elem.style.transform = "scale(1)";
    elem.style.zIndex = 1;
  });
});
}
imageLargeAndSmallFun();


// fetch image  function
async function getImages(query ,pageNo = 1) {
  try{
  let sum = "";
  const response = await fetch(
`https://api.pexels.com/v1/search?query=${query}&page=${pageNo}&per_page=10`,{
      headers: {
        Authorization:"9bDAvADanzsyd5UulcLHvjwxgkIbmdrq0JjFTrzGQySMWWj4OCgGyVsg",
      },
    }
  );

  const data = await response.json();
  data.photos.forEach((val, id) => {
    sum += `
      <div class="imageCard">
        <img
          src="${val.src.medium}"
          alt="${val.alt || "image"}"
          loading ="lazy"
        />
        <i class="fa-solid fa-heart heartIcon" data-id="${id}"></i>
      </div>
    `;
  });
  photoSection.innerHTML = sum;
  imageLargeAndSmallFun()
  likeFun()
}
catch(err){
  console.log(err)
}
}


// close save image box
function backButtonFun(){
  backButton.addEventListener("click",()=>{
    saveImageDiv.style.display = "none"
  })
}
backButtonFun()

const saveImageInnerDiv = document.querySelector(".saveImageInnerDiv");
let saveImageArr= JSON.parse(localStorage.getItem("images"))||[];
// open save  image box function
function saveImageFun(){
saveButton.addEventListener("click",()=>{
  let sum=""
saveImageDiv.style.display = "block"
saveImageArr.forEach((elem)=>{
sum+= `<div>
          <img
            src="${elem}"
            alt=""
          />
        </div>
`
})

saveImageInnerDiv.innerHTML = sum;
backButtonFun()
})
}
saveImageFun()


// like function logic
function likeFun(){

  const heartButton = document.querySelectorAll(".heartIcon")
  heartButton.forEach((elem ,id)=>{
    elem.addEventListener("click" ,(e)=>{
     e.stopPropagation()
      elem.style.color ="red";
      elem.style.pointerEvents = "none";
      elem.style.opacity = "0.5";
     let img =  elem.parentElement.querySelector("img");

if(!saveImageArr.includes(img.src)){
  saveImageArr.push(img.src);
}
localStorage.setItem("images" , JSON.stringify(saveImageArr))
    })
  })
}



nextButton.addEventListener("click",()=>{
  pageNo++;
  getImages(value , pageNo);
  currentButton.innerHTML = pageNo;
})

previewsButton.addEventListener("click",()=>{
  pageNo--;

if(pageNo == 1 || pageNo == 0){
 previewsButton.style.pointerEvents ="none";
 previewsButton.style.opacity =0.5 
 }
else{
previewsButton.style.pointerEvents ="all";
 previewsButton.style.opacity =1 
  currentButton.innerHTML = pageNo;

} 

 getImages(value , pageNo)
})