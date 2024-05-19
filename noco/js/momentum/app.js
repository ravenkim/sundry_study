








//const a=5; //고정
//let b=3; //바뀜
//console.log(a + 2)

/*
const player = {
    name: "raven",
    point: 2,
}

function say(name) {
    console.log(name);

}
say("rave")
*/

/*
const age = prompt("question");


age = parseInt(age) // leter>num

console.log(age);
*/

//isNan(age) > 숫자인지 아닌지 여부 확인 


// and &&    or ||      같다 ===
/*
const age = parseInt(prompt("asdads"));
if (isNaN(age)) {
    console.log("문자입니다");
} else{

}
*/

// console.dir(document) 디큐먼트 요소 보여줌


//document.querySelector(".heoo h1")  //요소 가져옴
/*
const title = document.querySelector("h1")

function aaa() {
    title.style.color="blue";
}

function handleWindowResize() {
document.body.style.backgroundColor = "tomato";
}


title.addEventListener("click", aaa);
title.onclick = aaa; //위에랑 같다


window.addEventListener("resize", handleWindowResize)

*/

/*
const title = document.querySelector("h1")

function mouseenterHandler() {
title.style.color = "blue";
title.innerText = "your mouse is here!"
}
function mouseoutHandler() {
    title.style.color = "orange";
    title.innerText = "your mouse is gone!"
}
function rightclickHandler() {
    title.style.color = "aqua";
    title.innerText = "do not use it!"
}
function handleWindowResize() {
    title.style.color = "tomato";
    title.innerText = "do you have problem with size?!"
}
    



title.addEventListener("mouseenter", mouseenterHandler)
title.addEventListener("mouseleave", mouseoutHandler)
window.addEventListener("contextmenu", rightclickHandler)
window.addEventListener("resize", handleWindowResize)
*/


/*
const title = document.querySelector("h1")


const superEventHandler = {
    mouseenterHandler: function() {
        title.style.color = "blue";
        title.innerText = "your mouse is here!"
    },
    mouseoutHandler: function() {
        title.style.color = "orange";
        title.innerText = "your mouse is gone!"
    },
    rightclickHandler: function() {
        title.style.color = "aqua";
        title.innerText = "do not use it!"
    },
    handleWindowResize: function() {
        title.style.color = "tomato";
           title.innerText = "do you have problem with size?!"
    },

}

title.addEventListener("mouseenter", superEventHandler.mouseenterHandler)
title.addEventListener("mouseleave", superEventHandler.mouseoutHandler)
window.addEventListener("contextmenu", superEventHandler.rightclickHandler)
window.addEventListener("resize", superEventHandler.handleWindowResize)

*/

/*
function handleWindowResize() {
    title.style.color = "tomato";
    title.innerText = "do you have problem with size?!"
}
    

title.addEventListener("mouseenter", mouseenterHandler)

*/