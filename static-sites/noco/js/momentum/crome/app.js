const loginForm = document.getElementById("login-form")
const loginInput = loginForm.querySelector("input")
const loginButton = loginForm.querySelector("button")

function onsub () {
    const username = loginInput.value;
     /* html 에 작성 가능 
    if(username === "") {
        alert("plz write ur name")
    } else if(username.length > 10){
        alert("ur name is 2 long")
    }
    */

}

//loginButton.addEventListener("click",onLoginBtnClick);

loginForm.addEventListener("submit", onsub)