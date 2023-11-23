import 'core-js/actual';
import 'regenerator-runtime';

('use strict');

// Selecting all the required elements from the DOM

const changeLocation = document.querySelector('.location-button');
const weekList = document.querySelector('.week-list');
const search = document.querySelector('.input__submit');
const weatherIcon = document.querySelector('.weather__icon');
const currTemp = document.querySelector('.weather-temp');
const weatherDescription = document.querySelector('.weather-desc');
const location = document.querySelector('.location');
const date = document.querySelector('.date-day');
const todaysDay = document.querySelector('.date-dayname');
const pressureValue = document.querySelector('.precip-value');
const humidityValue = document.querySelector('.humidity-value');
const windValue = document.querySelector('.wind-value');
const locationInput = document.querySelector('.input__box');
//
const listItems = weekList.querySelectorAll('li');
const dayElements = document.querySelectorAll('.day-name');
const iconElements = document.querySelectorAll('.icon');
const tempElements = document.querySelectorAll('.day-temp');

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const weatherForToday = async function (city) {
  try {
    const APIKEY = 'd5b27fe35e2de258d0a190b48aa44043';
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`);
    const weatherForToday = await weather.json();
    return weatherForToday;
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching the weather data.');
  }
};
const forecast = async function (city) {
  try {
    const APIKEY = 'd5b27fe35e2de258d0a190b48aa44043';
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`);
    const weatherForecast = await forecast.json();
    return weatherForecast;
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching the forecast data.');
  }
};

const getDayIconTemp = async function (forecast) {
  console.log(forecast);
  forecast.forEach((dayForecast, index) => {
    const dateStr = new Date(dayForecast.dt_txt);
    const dayName = dateStr.toLocaleString('en-us', { weekday: 'short' });
    const iconCode = forecast[index].weather[0].icon;
    const updatedIconCode = iconCode.includes('n') ? iconCode.replace('n', 'd') : iconCode;
    const iconUrl = `https://openweathermap.org/img/wn/${updatedIconCode}@2x.png`;
    dayElements[index].textContent = dayName;
    iconElements[index].src = iconUrl;
    tempElements[index].textContent = `${Math.ceil(dayForecast.main.temp - 273)}°C`;
  });
};

const changeData = async function (forecast) {
  listItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Remove active class from all li elements
      listItems.forEach(function (item) {
        item.classList.remove('active');
      });
      // Add active class to the clicked li element
      this.classList.add('active');

      // Get the index of the clicked day and display its weather data
      const index = e.target.closest('li').dataset.weather;
      const dateStr = forecast[index].dt_txt;
      const dateObj = new Date(dateStr);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = dateObj.toLocaleString('en-GB', options);
      const dayOfWeek = dateObj.toLocaleString('en-GB', { weekday: 'long' });
      const iconCode = forecast[index].weather[0].icon;
      const updatedIconCode = iconCode.includes('n') ? iconCode.replace('n', 'd') : iconCode;
      const iconUrl = `https://openweathermap.org/img/wn/${updatedIconCode}@2x.png`;

      todaysDay.textContent = dayOfWeek;
      date.textContent = formattedDate;
      weatherIcon.src = iconUrl;
      currTemp.textContent = `${Math.ceil(forecast[index].main.temp - 273)}°C`;
      weatherDescription.textContent = forecast[index].weather[0].description;
      pressureValue.textContent = `${forecast[index].main.pressure} hPa`;
      humidityValue.textContent = `${forecast[index].main.humidity} %`;
      windValue.textContent = `${forecast[index].wind.speed} km/h`;
    });
  });
};

search.addEventListener('click', async () => {
  const city = document.querySelector('.input__box').value;

  // const city = 'warsaw';
  const today = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-GB', options);

  if (city === '') return;

  document.querySelector('.container').style.display = 'flex';

  const weatherForTodayData = await weatherForToday(city);

  const {
    main: { temp, humidity, pressure },
    name,
    weather: [{ description, icon, main }],
    wind: { speed },
  } = weatherForTodayData;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  weatherIcon.src = iconUrl;
  currTemp.textContent = `${Math.ceil(temp - 273)}°C`;
  weatherDescription.textContent = description;
  location.textContent = capitalizeFirstLetter(city);
  date.textContent = formattedDate;
  todaysDay.textContent = today.toLocaleDateString('en-US', { weekday: 'long' });
  pressureValue.textContent = `${pressure} hPa`;
  humidityValue.textContent = `${humidity} % `;
  windValue.textContent = `${speed} km/h`;

  const weatherForecastData = await forecast(city);
  console.log(weatherForecastData);

  const filteredForecast = weatherForecastData.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt);
    return (
      forecastDate.getHours() === 12 &&
      forecastDate > today &&
      forecastDate <= new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
    );
  });

  getDayIconTemp(filteredForecast);
  changeData(filteredForecast);
});

function focus() {
  locationInput.focus();
}

changeLocation.addEventListener('click', focus);
