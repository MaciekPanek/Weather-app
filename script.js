import 'core-js/actual';
import 'regenerator-runtime';

('use strict');

// Selecting all the required elements from the DOM
const location = document.querySelector('.location');
const date = document.querySelector('.date-day');
const dateDay = document.querySelector('.date-dayname');

const precipValue = document.querySelector('.precip-value');
const humidityValue = document.querySelector('.humidity-value');
const windValue = document.querySelector('.wind-value');

const changeLocation = document.querySelector('.location-button');
const weekList = document.querySelector('.week-list');

const listItems = weekList.querySelectorAll('li');
const dayElements = document.querySelectorAll('.day-name');
const iconElements = document.querySelectorAll('.icon');
const tempElements = document.querySelectorAll('.day-temp');
// //
//
//
//
//
//
//
//
//
//
//

// const today = new Date();
// const options = { year: 'numeric', month: 'short', day: 'numeric' };
// const formattedDate = today.toLocaleDateString('en-GB', options);

// const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// const dayOfWeek = daysOfWeek[today.getDay()];

// const days = [2, 3, 4, 5];
//
//
//
//
//
//
//
//
//
//
//
const search = document.querySelector('.input__submit');
const weatherIcon = document.querySelector('.weather__icon');
const currTemp = document.querySelector('.weather-temp');
const weatherDescription = document.querySelector('.weather-desc');

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

search.addEventListener('click', async () => {
  // const city = document.querySelector('.input__box').value;

  const city = 'warsaw';

  if (city === '') return;

  const weatherForTodayData = await weatherForToday(city);
  const weatherForecastData = await forecast(city);

  const {
    main: { temp },
    name,
    weather: {
      0: { description, icon, main },
    },
    wind: { speed },
  } = weatherForTodayData;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  console.log(weatherForTodayData);
  console.log(weatherForecastData.list);
  weatherIcon.src = iconUrl;
  currTemp.textContent = Math.ceil(temp - 273);
  weatherDescription.textContent = description;
});
