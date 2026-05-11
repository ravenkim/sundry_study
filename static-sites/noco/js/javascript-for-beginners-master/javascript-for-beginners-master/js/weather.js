const weather = document.querySelector("#weather span:first-child");
const city = document.querySelector("#weather span:last-child");
// Do not commit real API keys — set locally only: https://openweathermap.org/api
const API_KEY = "";

function onGeoOk(position) {
  if (!API_KEY) {
    console.warn("OpenWeather API key is not set.");
    return;
  }
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      city.innerText = data.name;
      weather.innerText = `${data.weather[0].main} / ${data.main.temp}`;
    });
}
function onGeoError() {
  alert("Can't find you. No weather for you.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
