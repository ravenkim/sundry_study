const clock = document.querySelector("#clock");

function getDday() {
    const now = new Date();
    if (now.getMonth()===12 && now.getDate>=24) {
        var dday = new Date(now.getFullYear()+1, 11, 24);
    } else {
        var dday = new Date(now.getFullYear(), 11, 24);
    }
    const lefttime = dday.getTime() - now.getTime();
    const day=String(Math.floor(lefttime/(1000*60*60*24)));
    const hours=String(Math.floor((lefttime/(1000*60*60)))%24).padStart(2, "0");
    const minutes=String(Math.floor((lefttime/(1000*60)))%60).padStart(2, "0");
    const seconds=String(Math.floor((lefttime/1000))%60).padStart(2, "0");
    clock.innerText = `${day}d ${hours}h ${minutes}m ${seconds}s`;
    console.log("123123")
}


getDday();
setInterval(getDday, 1000);