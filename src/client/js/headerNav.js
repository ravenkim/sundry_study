const headergnb = document.querySelector("#headergnb");
const headergnb_btn = document.querySelector(".headergnb_btn");
const headergnb_btn1 = document.querySelector(".headergnb_btn1");
const headergnb_btn2 = document.querySelector(".headergnb_btn2");
const mainNav = document.querySelector(".mainNav");
mainNav.style.opacity = 0
mainNav.style.display = "none"
headergnb_btn2.classList.add("hidden")



headergnb_btn.addEventListener("click", ()=> {
    if (headergnb.classList.contains("hederBtnActive")) {
        headergnb.classList.remove("hederBtnActive")
        mainNav.style.opacity = 0
        mainNav.style.display = "none"
        headergnb_btn2.classList.add("hidden")
        headergnb_btn1.classList.remove("hidden")
    } else {
        headergnb.classList.add("hederBtnActive");
        mainNav.style.opacity = 1
        mainNav.style.display = "flex"
        headergnb_btn1.classList.add("hidden")
        headergnb_btn2.classList.remove("hidden")

        
    }
});