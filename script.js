
const apiKey = "a56adb6f4bca3cfbff7c359b8c4e5b65"; // Replace with your OpenWeatherMap API key
const weatherResult = document.getElementById("weatherResult");
const forecastContainer = document.getElementById("forecastContainer");
const hourlyChartCanvas = document.getElementById("hourlyChart");
let hourlyChartInstance = null;

// 🔍 Fetch Weather by City Name
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherData(city);
}

// 📍 Auto Detect Weather via Geolocation
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(null, latitude, longitude);
    }, () => {
      alert("Unable to get your location.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// 🌦️ Fetch and Display Weather & Forecast
function fetchWeatherData(city = null, lat = null, lon = null) {
  let weatherURL = "";
  let forecastURL = "";

  if (city) {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  } else {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }

  // 🌤 Current Weather
  fetch(weatherURL)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const { name, weather, main, wind } = data;
      const weatherHTML = `
        <div class="weather-info">
          <h2>${name}</h2>
          <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" />
          <p>${weather[0].description}</p>
          <p>🌡️ Temperature: ${main.temp}°C</p>
          <p>💧 Humidity: ${main.humidity}%</p>
          <p>🌬️ Wind: ${wind.speed} m/s</p>
        </div>
      `;
      weatherResult.innerHTML = weatherHTML;
      setWeatherBackground(weather[0].main);
    })
    .catch(error => {
      weatherResult.innerHTML = `<p style="color:red">${error.message}</p>`;
      forecastContainer.innerHTML = "";
    });

  // 📅 5-Day Forecast & Hourly Chart
  fetch(forecastURL)
    .then(res => {
      if (!res.ok) throw new Error("Forecast not available.");
      return res.json();
    })
    .then(data => {
      // 🎯 5-Day Forecast
      const forecastList = data.list.filter(reading =>
        reading.dt_txt.includes("12:00:00")
      );
      forecastContainer.innerHTML = "<h2 class='weather-info'>5-Day Forecast</h2><div class='forecast'>";
      forecastList.forEach(forecast => {
        const date = new Date(forecast.dt_txt);
        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        });

        forecastContainer.innerHTML += `
          <div class="forecast-day">
            <h3>${day}</h3>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
            <p>${forecast.weather[0].description}</p>
            <p>🌡️ ${forecast.main.temp}°C</p>
            <p>💧 ${forecast.main.humidity}%</p>
          </div>
        `;
      });
      forecastContainer.innerHTML += "</div>";

      // ⏰ Hourly Forecast Chart
      const hourly = data.list.slice(0, 8);
      const hours = hourly.map(f => new Date(f.dt_txt).getHours() + ":00");
      const temps = hourly.map(f => f.main.temp);

      const ctx = hourlyChartCanvas.getContext("2d");

      if (hourlyChartInstance) hourlyChartInstance.destroy();

      hourlyChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: hours,
          datasets: [{
            label: "Hourly Temp (°C)",
            data: temps,
            borderColor: "#00bcd4",
            backgroundColor: "#b2ebf2",
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: getComputedStyle(document.body).color }
            }
          },
          scales: {
            x: { ticks: { color: getComputedStyle(document.body).color } },
            y: { ticks: { color: getComputedStyle(document.body).color } }
          }
        }
      });
    })
    .catch(error => {
      forecastContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
    });
}

// 🌅 Animated Background Based on Weather
function setWeatherBackground(condition) {
  const bg = document.body;
  switch (condition.toLowerCase()) {
    case "clear":
      bg.style.background = "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)";
      break;
    case "clouds":
      bg.style.background = "linear-gradient(to top, #d7d2cc 0%, #304352 100%)";
      break;
    case "rain":
      bg.style.background = "linear-gradient(to top, #667db6 0%, #0082c8 100%)";
      break;
    case "snow":
      bg.style.background = "linear-gradient(to top, #e6dada 0%, #274046 100%)";
      break;
    case "thunderstorm":
      bg.style.background = "linear-gradient(to top, #616161 0%, #9bc5c3 100%)";
      break;
    default:
      bg.style.background = "linear-gradient(to top, #bdc3c7 0%, #2c3e50 100%)";
  }
}
