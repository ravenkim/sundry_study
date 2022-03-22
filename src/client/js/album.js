const nextBtn = document.querySelector("#home-btn-next");
const prevBtn = document.querySelector("#home-btn-prev");
const slides = document.querySelectorAll(".album-inner")
const slideIcons = document.querySelectorAll(".dots")
const numberOfSlides = slides.length;
let slideNumber = 0;

nextBtn.addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })

    slideNumber++;

    if(slideNumber > (numberOfSlides - 1)){
        slideNumber = 0;
    }

    slideIcons[slideNumber].classList.add("active");

    showDivs(slideNumber+1);
   
});

prevBtn.addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })

    slideNumber--;

    if(slideNumber < 0){
        slideNumber = (numberOfSlides - 1)
    }

    slideIcons[slideNumber].classList.add("active");

    showDivs(slideNumber+1);
    
});


document.querySelector("#home-btn1").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 0;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#home-btn2").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 1;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#home-btn3").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 2;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#home-btn4").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 3;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});


function albumBackgroundColor(){
    switch (slideNumber) {
        case 0:
            document.querySelector(".wrapper-top").style.backgroundColor = '#232321';
            break;
        case 1:
            document.querySelector(".wrapper-top").style.backgroundColor = '#346ABC';
            break;
        case 2:
            document.querySelector(".wrapper-top").style.backgroundColor = '#DED2BB';
            break;
        case 3:
            document.querySelector(".wrapper-top").style.backgroundColor = '#FDE20D';
            break;
        default:
            break;
    }
}


function showDivs(n) {
    let resultPage = -(n-1)*550
    document.querySelector(".album-container").style.transform = 'translate('+resultPage+'px)'
    albumBackgroundColor();
}

