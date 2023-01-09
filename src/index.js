import './style.css';

const variables = createVariables();
fetchData(variables);

function createVariables() {
    let startDate = new Date();
    let endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    startDate = startDate.toISOString().split("T")[0];
    endDate = endDate.toISOString().split("T")[0];
    return {
        startDate, 
        endDate
    }
}

async function fetchData(variables) {
    const fetchString = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&current_weather=true&timezone=auto&start_date=${variables.startDate}&end_date=${variables.endDate}`;

    const response = fetch(fetchString)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
        displayData(response);
    })
    .catch(function(error) { 
        console.log(error);
    });
}

function displayData(data) {
    const dayContainers = Array.from(document.querySelectorAll(".dayContainer"));

    dayContainers.forEach(item => { 
        displayDataInDayContainer(item, data, dayContainers.indexOf(item))
    });
}

function displayDataInDayContainer(item, data, index) {
    const weekDay = item.querySelector(".weekDay");
    let weekDayString = data.daily.time[index];
    weekDayString = new Date(weekDayString);
    weekDayString = weekDayString.getDay();
    weekDayString = convertWeekDay(weekDayString);
    if (index == 0) {
        weekDay.innerText = "Today";
    } else if (index == 1) {
        weekDay.innerText = "Tomorrow";
    } else {
        weekDay.innerText = weekDayString;
    }

    const date = item.querySelector(".date");
    date.innerText = data.daily.time[index];

    const weatherCode = item.querySelector(".weatherCode");
    const weatherCodeConverted = convertWeatherCode(data.daily.weathercode[index]);
    weatherCode.innerText = weatherCodeConverted;

    const temperatureMax = item.querySelector(".temperatureMax");
    temperatureMax.innerText = `Max: ${data.daily.temperature_2m_max[index]}°C`;

    const temperatureMin = item.querySelector(".temperatureMin");
    temperatureMin.innerText = `Min: ${data.daily.temperature_2m_min[index]}°C`;
}

function convertWeekDay(day) {
    let weekDay;
    switch (day) {
        case 0: 
            weekDay = "Sunday";
            break;
        case 1:
            weekDay = "Monday";
            break;
        case 2: 
            weekDay = "Tuesday";
            break;
        case 3: 
            weekDay = "Wednesday";
            break;
        case 4: 
            weekDay = "Thursday";
            break;
        case 5: 
            weekDay = "Friday";
            break;
        case 6: 
            weekDay = "Saturday";
            break;
    }
    return weekDay;
}

function convertWeatherCode(code) {
    let weatherCodeConverted;
    switch (code) {
        case 0:
            weatherCodeConverted = "Clear sky";
            break;
        case 1:
            weatherCodeConverted = "Mainly clear";
            break;
        case 2:
            weatherCodeConverted = "Partly Cloudy";
            break;
        case 3:
            weatherCodeConverted = "Overcast";
            break;
        case 45:
            weatherCodeConverted = "Fog";
            break;
        case 48:
            weatherCodeConverted = "Depositing rime fog";
            break;
        case 51:
            weatherCodeConverted = "Light drizzle";
            break;
        case 53:
            weatherCodeConverted = "Moderate drizzle";
            break;
        case 55:
            weatherCodeConverted = "Dense drizzle";
            break;
        case 56:
            weatherCodeConverted = "Light freezing drizzle";
            break;
        case 57:
            weatherCodeConverted = "Dense freezing drizzle";
            break;
        case 61:
            weatherCodeConverted = "Slight rain";
            break;
        case 63:
            weatherCodeConverted = "Moderate rain";
            break;
        case 65:
            weatherCodeConverted = "Heavy rain";
            break;
        case 66:
            weatherCodeConverted = "Light freezing rain";
            break;
        case 67:
            weatherCodeConverted = "Heavy freezing rain";
            break;
        case 71:
            weatherCodeConverted = "Slight snow";
            break;
        case 73:
            weatherCodeConverted = "Moderate snow";
            break;
        case 75:
            weatherCodeConverted = "Heavy snow";
            break;
        case 77:
            weatherCodeConverted = "Snow grains";
            break;
        case 80:
            weatherCodeConverted = "Slight rain shower";
            break;
        case 81:
            weatherCodeConverted = "Moderate rain shower";
            break;
        case 82:
            weatherCodeConverted = "Violent rain shower";
            break;
        case 85:
            weatherCodeConverted = "Slight snow shower";
            break;
        case 86:
            weatherCodeConverted = "Heavy snow shower";
            break;
        case 95:
            weatherCodeConverted = "Thunderstorm";
            break;
        case 96:
            weatherCodeConverted = "Thunderstorm with slight hail";
            break;
        case 99:
            weatherCodeConverted = "Thunderstorm with heavy hail";
            break;
    }
    return weatherCodeConverted;
}

