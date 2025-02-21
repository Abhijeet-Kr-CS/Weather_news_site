const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

let weather = {
    apiKey: "64daa8fa4b604a3ca2d124014251201",
    fetchWeather: function (city) {
      fetch(
        "https://api.weatherapi.com/v1/current.json?key=" +
        this.apiKey +
        "&q=" +
        city +
        "&units=metric"
      )
      .then(response => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then(data => this.displayWeather(data))
      .catch(error => console.error("Error fetching weather data:", error));
    },
    displayWeather: function (data) {
      const { name } = data.location;
      const { icon, text: description } = data.current.condition;
      const { temp_c: temp, humidity } = data.current;
      const { wind_kph: speed } = data.current;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src = "https:" + icon;
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    }
  };
  
  let geocode = {
    reverseGeocode: function (latitude, longitude) {
      let apikey = "90a096f90b3e4715b6f2e536d934c5af";
      let api_url = "https://api.opencagedata.com/geocode/v1/json";
      let request_url = `${api_url}?key=${apikey}&q=${encodeURIComponent(latitude + "," + longitude)}&pretty=1&no_annotations=1`;
  
      fetch(request_url)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city);
        } else {
          console.error("No geocode data found.");
        }
      })
      .catch(error => console.error("Error fetching geocode data:", error));
    },
    getLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => this.reverseGeocode(position.coords.latitude, position.coords.longitude),
          error => console.error("Geolocation error:", error)
        );
      } else {
        weather.fetchWeather("Manipal");
      }
    }
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
  
  weather.fetchWeather("Manipal");
  geocode.getLocation();