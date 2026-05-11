const weather = document.querySelector("#weather span:last-child");
const city = document.querySelector("#weather span:first-child");
const API_KEY = "2847118a6f73195b52d5eab21f473913";

function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        city.innerText = `${data.name}의 날씨`
        weather.innerText = `${data.weather[0].main} / ${data.main.temp}°C`;
      });
}
function onGeoError() {
  alert("위치를 찾을수 없습니다. 위치 접근을 허용해 주세요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);