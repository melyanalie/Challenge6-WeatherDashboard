const apiKey = '18dc9a2b0aae2b8b411921e378b652f8';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');

searchBtn.addEventListener('click', function () {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        addCityToSearchHistory(city);
        cityInput.value = '';
    }
});

function getWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecastData(city);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('City not found. Please try again.');
        });
}

function getForecastData(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayCurrentWeather(data) {
    const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const currentWeatherHtml = `
        <h3>${data.name} (${new Date().toLocaleDateString()}) <img src="${weatherIcon}" alt="${data.weather[0].description}" class="weather-icon"></h3>
        <p>Temp: ${data.main.temp} °F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;

    currentWeatherSection.innerHTML = currentWeatherHtml;
}

function displayForecast(data) {
    forecastSection.innerHTML = '';
    const forecastDays = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    forecastDays.forEach(day => {
        const weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const forecastHtml = `
            <div class="forecast-card">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <img src="${weatherIcon}" alt="${day.weather[0].description}">
                <p>Temp: ${day.main.temp} °F</p>
                <p>Wind: ${day.wind.speed} MPH</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
        forecastSection.innerHTML += forecastHtml;
    });
}

function addCityToSearchHistory(city) {
    const historyItem = document.createElement('button');
    historyItem.textContent = city;
    historyItem.classList.add('btn', 'btn-secondary', 'mt-2');
    historyItem.addEventListener('click', () => {
        getWeatherData(city);
    });
    searchHistory.appendChild(historyItem);
}

function addCityToSearchHistory(city) {
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.classList.add('list-group-item', 'list-group-item-action');

    historyItem.addEventListener('click', function () {
        getWeatherData(city);
    });

    searchHistory.appendChild(historyItem);

    saveCityToLocalStorage(city);
}

function saveCityToLocalStorage(city) {
    let history = JSON.parse(localStorage.getItem('cityHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('cityHistory', JSON.stringify(history));
    }
}

function loadSearchHistory() {
    let history = JSON.parse(localStorage.getItem('cityHistory')) || [];

    history.forEach(city => {
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyItem.classList.add('list-group-item', 'list-group-item-action');

        historyItem.addEventListener('click', function () {
            getWeatherData(city);
        });

        searchHistory.appendChild(historyItem);
    });
}

window.addEventListener('load', loadSearchHistory);
