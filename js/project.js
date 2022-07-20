const nextBtn = document.querySelector("#project_btn_next");
const prevBtn = document.querySelector("#project_btn_prev");
const slides = document.querySelectorAll(".project_inner")
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


document.querySelector("#project_btn1").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 0;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#project_btn2").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 1;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#project_btn3").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 2;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});
document.querySelector("#project_btn4").addEventListener("click", ()=> {
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    })
    slideNumber = 3;
    slideIcons[slideNumber].classList.add("active");
    showDivs(slideNumber+1)
});


function showDivs(n) {
    let resultPage = -((n-1)*(100/numberOfSlides))
    document.querySelector(".project_container").style.transform = 'translate('+resultPage+'%)'
}

