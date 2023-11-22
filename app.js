document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const userLocation = document.getElementById('userLocation').value;

    try {
        const coordinates = await getCoordinates(userLocation);
        const weatherData = await getWeather(coordinates.latitude, coordinates.longitude);

        // Display weather information

        document.getElementById('weatherData').textContent = `Weather: ${JSON.stringify(weatherData)}`;

        // Fetch and display country information
        const countryInfo = await getCountryInfo(coordinates.latitude, coordinates.longitude);
        document.getElementById('countryData').textContent = `Country Info: ${JSON.stringify(countryInfo)}`;
    } catch (error) {
        console.error('Error:', error.message);
    }
});

async function getCoordinates(location) {
    const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    
    try {
        const response = await fetch(nominatimURL);
        if (!response.ok) {
            throw new Error('Unable to fetch coordinates');
        }
        
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Location not found');
        }
        
        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getWeather(latitude, longitude) {
    const weatherAPIURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}\n&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;

    try {
        const response = await fetch(weatherAPIURL);
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getCountryInfo(latitude, longitude) {
    const reverseGeocodeURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

    try {
        const response = await fetch(reverseGeocodeURL);
        if (!response.ok) {
            throw new Error('Country data not available');
        }
        
        const data = await response.json();
        return data.address;
    } catch (error) {
        throw new Error(error.message);
    }
}
