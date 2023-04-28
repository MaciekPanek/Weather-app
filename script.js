import "core-js/actual";
import "regenerator-runtime";

("use strict");

// Selecting all the required elements from the DOM
const currTemp = document.querySelector(".weather-temp");
const location = document.querySelector(".location");
const date = document.querySelector(".date-day");
const dateDay = document.querySelector(".date-dayname");
const weatherDescription = document.querySelector(".weather-desc");
const weatherIcon = document.querySelector(".weather__icon");
const precipValue = document.querySelector(".precip-value");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");
const locationInput = document.querySelector(".input__box");
const inputSubmit = document.querySelector(".input__submit");
const changeLocation = document.querySelector(".location-button");
const weekList = document.querySelector(".week-list");

// Selecting individual elements from the week list
const listItems = weekList.querySelectorAll("li");
const dayElements = document.querySelectorAll(".day-name");
const iconElements = document.querySelectorAll(".icon");
const tempElements = document.querySelectorAll(".day-temp");

// Getting today's date and formatting it
const today = new Date();
const options = { year: "numeric", month: "short", day: "numeric" };
const formattedDate = today.toLocaleDateString("en-GB", options);

// Creating an array of days of the week
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Getting the current day of the week
const dayOfWeek = daysOfWeek[today.getDay()];

// Setting the default city and number of days to show in the forecast
let city = "warsaw";
const days = [1, 2, 3, 4];

// Function to fetch the weather data
const forecast = async function (location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=9f9371cb1ccc43e19d2135502232504&q=${location}&days=4&aqi=no&alerts=no`
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the weather data.");
  }
};

// Function to get the icon and temperature for each day of the forecast
const getDayIconTemp = async function (dayIndexes) {
  const jsonData = await forecast(city);

  dayIndexes.forEach((dayIndex, index) => {
    const dateStr = jsonData.forecast.forecastday[index].date;
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleString("en-us", { weekday: "short" });
    dayElements[index].textContent = dayName;
    iconElements[index].src = jsonData.forecast.forecastday[index].day.condition.icon;
    tempElements[index].textContent = `${jsonData.forecast.forecastday[index].day.avgtemp_c}°C`;
  });
};

// Function to display the current day's weather and forecast
const displayForecast = async function () {
  const jsonData = await forecast(city);

  dateDay.textContent = dayOfWeek;
  date.textContent = formattedDate;
  location.textContent = `${jsonData.location.name}, ${jsonData.location.country}`;
  weatherIcon.src = jsonData.current.condition.icon;
  currTemp.textContent = `${jsonData.current.temp_c}°C`;
  weatherDescription.textContent = jsonData.current.condition.text;
  precipValue.textContent = `${jsonData.current.precip_mm} mm`;
  humidityValue.textContent = `${jsonData.current.humidity}%`;
  windValue.textContent = `${jsonData.current.wind_kph} km/h`;

  // Calling the getDayIconTemp() function to display the forecast for the next four days
  getDayIconTemp(days);
};

// Function to change the displayed forecast when a different day is clicked
const changeData = async function () {
  const jsonData = await forecast(city);

  listItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      // Remove active class from all li elements
      listItems.forEach(function (item) {
        item.classList.remove("active");
      });
      // Add active class to the clicked li element
      this.classList.add("active");

      // Get the index of the clicked day and display its weather data
      const index = e.target.closest("li").dataset.weather;
      const dateStr = jsonData.forecast.forecastday[index].date;
      const dateObj = new Date(dateStr);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = dateObj.toLocaleString("en-GB", options);
      const dayOfWeek = dateObj.toLocaleString("en-GB", { weekday: "long" });

      dateDay.textContent = dayOfWeek;
      date.textContent = formattedDate;
      weatherIcon.src = jsonData.forecast.forecastday[index].day.condition.icon;
      currTemp.textContent = `${jsonData.forecast.forecastday[index].day.avgtemp_c}°C`;
      weatherDescription.textContent = jsonData.forecast.forecastday[index].day.condition.text;
      precipValue.textContent = `${jsonData.forecast.forecastday[index].day.totalprecip_mm} mm`;
      humidityValue.textContent = `${jsonData.forecast.forecastday[index].day.avghumidity}%`;
      windValue.textContent = `${jsonData.forecast.forecastday[index].day.maxwind_kph} km/h`;
    });
  });
};

// Function to submit the location input and display the weather data
async function submit() {
  // Get the value of the input element
  if (locationInput.value === "") return;

  city = locationInput.value;

  // Call the displayForecast() function with the new location value
  try {
    displayForecast();
    locationInput.value = "";
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the weather data.");
  }
}

// Function to focus on the location input when the change location button is clicked
function focus() {
  locationInput.focus();
}

// Initial function calls
displayForecast();
changeData();
changeLocation.addEventListener("click", focus);
inputSubmit.addEventListener("click", submit);
