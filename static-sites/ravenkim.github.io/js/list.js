const sidebar_list1 = document.getElementById("sidebar_list1")
const sidebar_list2 = document.getElementById("sidebar_list2")
const sidebar_container1 = document.getElementById("sidebar_container1")
const sidebar_container2 = document.getElementById("sidebar_container2")



sidebar_list1.addEventListener("click", ()=>{
    sidebar_container1.style.display = "none"
    sidebar_container2.style.display = "flex"
});

sidebar_list2.addEventListener("click", ()=>{
    sidebar_container2.style.display = "none"
    sidebar_container1.style.display = "flex"
});