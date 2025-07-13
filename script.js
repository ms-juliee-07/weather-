document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", weather);
    } else {
        console.error("Search button not found!");
    }
});

function weather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();
    const searchButton = document.getElementById("searchButton");
    const resultDiv = document.getElementById("weatherResult");

    // Validate input
    if (!city) {
        resultDiv.innerHTML = "<p>❌ Please enter a city name.</p>";
        return;
    }
    if (!/^[a-zA-Z\s,.-]+$/.test(city)) {
        resultDiv.innerHTML = "<p>❌ Please enter a valid city name (letters, spaces, commas, periods, or hyphens only).</p>";
        return;
    }

    // Disable button and show loading state
    searchButton.disabled = true;
    resultDiv.innerHTML = "<p>⏳ Loading...</p>";

    console.log("Fetching weather for:", city);

    const apiKey = "38d6c24d6bb4ddaa1cd72282ea7e1ce7"; // Move to environment variable in production
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found or API error");
            }
            return response.json();
        })
        .then(data => {
            console.log("API response:", data);
            const weather = data.weather[0].main;
            const weatherDescription = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const temp = data.main.temp;
            const cityName = data.name;
            const country = data.sys.country;
            const humidity = data.main.humidity;
            const wind = data.wind.speed;

            // Weather icon from OpenWeather
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // Set background based on condition
            let bgImage;
            switch (weather.toLowerCase()) {
                case "clear":
                    bgImage = "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg";
                    break;
                case "clouds":
                    bgImage = "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg";
                    break;
                case "rain":
                case "drizzle":
                    bgImage = "https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg";
                    break;
                case "snow":
                    bgImage = "https://images.pexels.com/photos/773953/pexels-photo-773953.jpeg";
                    break;
                case "thunderstorm":
                    bgImage = "https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg";
                    break;
                default:
                    bgImage = "https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg";
            }

            // Apply background image with error handling
            const bgContainer = document.getElementById("bgContainer");
            bgContainer.style.backgroundImage = `url(${bgImage})`;

            // Verify background image load
            const img = new Image();
            img.src = bgImage;
            img.onload = () => console.log("Background image loaded successfully:", bgImage);
            img.onerror = () => {
                console.error("Failed to load background image:", bgImage);
                bgContainer.style.backgroundImage = `url(https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg)`;
            };

            // Clear previous content
            resultDiv.innerHTML = "";

            // Use DOM manipulation to prevent XSS
            const heading = document.createElement("h2");
            heading.textContent = `📍 ${cityName}, ${country}`;
            heading.setAttribute("aria-label", `Weather for ${cityName}, ${country}`);

            const icon = document.createElement("img");
            icon.src = iconUrl;
            icon.alt = `Weather icon: ${weather}`;
            icon.setAttribute("aria-hidden", "true");

            const tempPara = document.createElement("p");
            tempPara.textContent = `🌡 ${temp}°C`;

            const weatherPara = document.createElement("p");
            weatherPara.textContent = `🌤 ${weather} (${weatherDescription})`;

            const humidityPara = document.createElement("p");
            humidityPara.textContent = `💧 Humidity: ${humidity}%`;

            const windPara = document.createElement("p");
            windPara.textContent = `🌬 Wind Speed: ${wind} m/s`;

            // Append all elements
            resultDiv.append(heading, icon, tempPara, weatherPara, humidityPara, windPara);
        })
        .catch(error => {
            console.error("Error:", error.message);
            let errorMessage = "❌ City not found or API error. Try again.";
            if (!navigator.onLine) {
                errorMessage = "❌ No internet connection. Please check your network and try again.";
            }
            resultDiv.innerHTML = `<p>${errorMessage}</p>`;
        })
        .finally(() => {
            searchButton.disabled = false;
        });
}