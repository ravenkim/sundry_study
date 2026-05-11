const weather = document.querySelector("#weather span:last-child");
const city = document.querySelector("#weather span:first-child");
// OpenWeather API 키는 레포에 커밋하지 마세요. 로컬에서만 설정합니다.
const API_KEY = "";

function onGeoOk(position) {
    if (!API_KEY) {
      console.warn("OpenWeather API 키가 없습니다.");
      return;
    }
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