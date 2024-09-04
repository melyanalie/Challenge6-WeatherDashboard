// Initialize variables
const apiKey = 'your_api_key_here'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        addToSearchHistory(city);
        cityInput.value = '';
    }
});

// Function to get weather data
function getWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));

    // Fetch forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

// Function to display current weather
function displayCurrentWeather(data) {
    currentWeatherSection.innerHTML = `
        <div class="weather-card">
            <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" class="weather-icon">
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// Function to display 5-day forecast
function displayForecast(data) {
    forecastSection.innerHTML = '<h3>5-Day Forecast:</h3>';
    const forecastDays = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    forecastDays.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        forecastSection.innerHTML += `
            <div class="weather-card">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" class="weather-icon">
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
    });
}

// Function to add city to search history
function addToSearchHistory(city) {
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
        getWeatherData(city);
    });
    searchHistory.appendChild(historyItem);
}
