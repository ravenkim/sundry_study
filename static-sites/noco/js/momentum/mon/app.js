const NumForm =  document.getElementById("NumGameForm");
const GenNum = document.querySelector("#generateNum_A");
const GesNum = document.querySelector("#guessNum_A");
const Palybtn = document.querySelector("#guessNum_btn");
const result = document.querySelector("#result");
const WinMesg = document.querySelector("#WinMesg");
const LoseMesg = document.querySelector("#LoseMesg");

const HIDDEN_CLASSNAME = "hidden";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

  function GamePlay(event) {
    event.preventDefault();
    console.log(GesNum.value);
    const ComNum = getRandomIntInclusive(0,GenNum.value)
    result.innerText = `You chose: ${GesNum.value}, the machine chose: ${ComNum}`;
    result.classList.remove(HIDDEN_CLASSNAME);
   

    if (parseInt(ComNum) === parseInt(GesNum.value)) { 
        WinMesg.classList.remove(HIDDEN_CLASSNAME);
        LoseMesg.classList.add(HIDDEN_CLASSNAME);
    } else {
        LoseMesg.classList.remove(HIDDEN_CLASSNAME);
        WinMesg.classList.add(HIDDEN_CLASSNAME);
    }

}


NumForm.addEventListener("submit", GamePlay);