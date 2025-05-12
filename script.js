async function fetchWeather() {
  const searchInput = document.getElementById("search").value;
  const countryCode = document.getElementById("country").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "UR API KEY ";

  if (searchInput.trim() === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`;
    return;
  }

  async function getLonAndLat() {
    const query = countryCode
      ? `${encodeURIComponent(searchInput)},${countryCode}`
      : encodeURIComponent(searchInput);
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response!", response.status);
      return;
    }
    const data = await response.json();
    if (data.length === 0) {
      console.log("City not found.");
      weatherDataSection.innerHTML = `
        <div>
          <h2>No Results for "${searchInput}"</h2>
          <p>Try entering a full city name and/or selecting a country.</p>
        </div>`;
      return;
    } else {
      return data[0]; // Contains name, lat, lon
    }
  }

  async function getWeatherData(lon, lat, cityName) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    const tempCelsius = Math.round(data.main.temp - 273.15);

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/4834/4834559.png" width="100" />
      <div>
        <h2>${cityName}</h2>
        <p><strong>Temperature:</strong> ${tempCelsius}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      </div>`;
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    getWeatherData(geocodeData.lon, geocodeData.lat, geocodeData.name);
  }
}
