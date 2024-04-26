// event listener for the form submission
document.getElementById('weatherForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the form from submitting via the browser

  const cityName = document.getElementById('cityName').value;
  const url = `https://weather-api138.p.rapidapi.com/weather?city_name=${encodeURIComponent(cityName)}`;
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '75fcbb9103msh3fe2f5f09145694p1ff8ddjsn3b42f8bcdc53',
          'X-RapidAPI-Host': 'weather-api138.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the response as JSON
      displayWeather(data); // Call displayWeather with the API response
  } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // If you have an element for errors, you can update its content here
      document.getElementById('weatherResult').innerText = 'Failed to fetch weather data';
  }
});

// This is your displayWeather function
function displayWeather(data) {
  const weatherContainer = document.getElementById('weatherContainer');
  const cityName = document.getElementById('cityName');
  const weatherDescription = document.getElementById('weatherDescription');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');

  cityName.textContent = `Weather for ${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = `${data.weather[0].description}`;
  temperature.textContent = `Temperature: ${((data.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F`; // Convert from Kelvin to Fahrenheit
  humidity.textContent = `Humidity: ${data.main.humidity}%`;

  weatherContainer.style.display = 'block'; // Display the container with the weather data
}
