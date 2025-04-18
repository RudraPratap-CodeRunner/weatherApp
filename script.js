// functionality to display top three searches using localStorage

// Manage Recent Searches
function updateRecentSearches(city) {
  let recent = JSON.parse(localStorage.getItem("recentCities")) || [];

  // Remove if already exists, then add to front
  recent = recent.filter((item) => item.toLowerCase() !== city.toLowerCase());
  recent.unshift(city);

  // Keep only the latest 3
  recent = recent.slice(0, 3);

  localStorage.setItem("recentCities", JSON.stringify(recent));
  populateDatalist();
}

function populateDatalist() {
  const dataList = document.getElementById("recentSearches");
  dataList.innerHTML = "";

  const recent = JSON.parse(localStorage.getItem("recentCities")) || [];

  recent.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    dataList.appendChild(option);
  });
}

apiKey = "a692e3a8f846f51cc3ea078b252d8caa";

// function to get weather data by city name
function weatherDetailsByCityName() {
  document.querySelector("#error").innerHTML = "";
  const city = document.querySelector("#cityName").value.trim();
  //   handling empty searches
  if (!city) {
    displayError("Plaese enter a city name");
    return;
  }
  updateRecentSearches(city);
  getWeatherData(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
}

// function to get weather data uisng current location
function weatherDetailByLocation() {
  document.querySelector("#error").innerHTML = "";
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherData(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
    },
    () => displayError("Problem in fetching your location.")
  );
}

// asynchrously fetching weather data
function getWeatherData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Weather data not found.");
      return response.json();
    })
    .then((data) => {
      showWeather(data);
      console.log(data);
      // console.log(data.list[0].weather[0].main);
    })
    .catch((error) => {
      displayError(error.message);
    });
}

const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");

// click event using eventListner on serach button
searchBtn.addEventListener("click", () => {
  weatherDetailsByCityName();
});

// click event on serch by location button
locationBtn.addEventListener("click", () => {
  weatherDetailByLocation();
});

// function to change weather image on main dashboard based on weather condition
function changeImage(data) {
  if (data.list[0].weather[0].main == "Clear") {
    document.querySelector("#mainImg").src = "images/clear.png";
  } else if (data.list[0].weather[0].main == "Clouds") {
    document.querySelector("#mainImg").src = "images/clouds.png";
  } else if (data.list[0].weather[0].main == "Rain") {
    document.querySelector("#mainImg").src = "images/rain.png";
  } else if (data.list[0].weather[0].main == "drizzle") {
    document.querySelector("#mainImg").src = "images/drizzle.png";
  } else if (data.list[0].weather[0].main == "Mist") {
    document.querySelector("#mainImg").src = "images/mist.png";
  }
}

// function to chnage image on 5 day forecast cards
function changeImagePath(item) {
  if (item.weather[0].main == "Clear") {
    return "images/clear.png";
  } else if (item.weather[0].main == "Clouds") {
    return "images/clouds.png";
  } else if (item.weather[0].main == "Rain") {
    return "images/rain.png";
  } else if (item.weather[0].main == "drizzle") {
    return "images/drizzle.png";
  } else if (item.weather[0].main == "Mist") {
    return "images/mist.png";
  }
}

// function to display weather data
function showWeather(data) {
  document.querySelector("#error").innerHTML = "";
  document.querySelector("#main-information").classList.remove("hidden");
  document.querySelector(
    "#main-information h1"
  ).textContent = `${data.city.name}, ${data.city.country}`;
  document.querySelector("#date").textContent = `${new Date(
    data.list[0].dt_txt
  ).toDateString()}`;
  changeImage(data);

  document.querySelector(
    "#weatherStatus"
  ).textContent = `${data.list[0].weather[0].main}`;
  document.querySelector("#mainTemp").textContent = `${Math.round(
    data.list[0].main.temp
  )}°C`;
  document.querySelector(
    "#humidity"
  ).textContent = `Humidity : ${data.list[0].main.humidity}%`;
  document.querySelector(
    "#windSpeed"
  ).textContent = `Wind : ${data.list[0].wind.speed} km/hr`;

  // 5 days forecast
  const forecast5 = document.querySelector("#forecast5");
  forecast5.innerHTML = "";

  const forecastList = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );
  console.log(forecastList);
  forecastList.slice(0, 5).forEach((item) => {
    const element = document.createElement("div");
    let imgpath = changeImagePath(item);
    element.className =
      "text-center border border-gray-300 px-4 py-6 min-w-[250px] rounded-md bg-red-50 shadow-md";
    element.innerHTML = `
                            <p class="text-[#6c6a6a] font-bold">${new Date(
                              item.dt_txt
                            ).toDateString()}</p>
                            <img id="forecastImg" src=${imgpath} alt="" class="w-20 mx-auto mt-2 -mb-1">
                            <p class="text-[#6c6a6a] font-semibold text-lg mb-3">${
                              item.weather[0].main
                            } , ${item.main.temp}°C</p>
                            <p class="text-[#6d6c6c] font-semibold text-sm mb-1"><i class="fa-solid fa-droplet text-[#807979]"></i> Humidity : ${
                              item.main.humidity
                            }%</p>
                            <p class="text-[#6d6c6c] font-semibold text-sm"> <i class="fa-solid fa-wind mr-3 text-[#575555] w-1 "></i>Wind : ${
                              item.wind.speed
                            } km/hr</p>
                          `;

    forecast5.appendChild(element);
  });
}

// function to handle error message
function displayError(message) {
  document.querySelector("#error").innerHTML = message;
  document.querySelector("#main-information").classList.add("hidden");
}

// functon called to add recent searched cities to local storage
populateDatalist();
