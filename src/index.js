import './style.css';

const apiController = {
    fetchData(variables) {
        const fetchString = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&current_weather=true&timezone=auto&start_date=${variables.startDate}&end_date=${variables.endDate}`;
    
        const response = fetch(fetchString)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            coordinator.processFetchedData(response);
        })
        .catch(function(error) { 
            console.log(error);
        });
    }
}

const coordinator = {
    response: "",

    createVariables() {
        let startDate = new Date();
        let endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        startDate = startDate.toISOString().split("T")[0];
        endDate = endDate.toISOString().split("T")[0];
        return {
            startDate, 
            endDate
        }
    },

    processFetchedData(fetchedData) {
        this.response = fetchedData;
        displayController.displayData(this.response);
        coordinator.selectDay(0);
    },

    convertWeekDay(day) {
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
    },

    convertWeatherCode(code) {
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
    },

    selectDay(dayIndex) {

        // Create and populate the time array
        let timeArray = [];
        let hours = 6;
        const hourContainers = document.querySelectorAll(".hourContainer");
        const amountOfHourContainers = hourContainers.length;

        for (let i = 0; i < amountOfHourContainers; i++) {
            if (hours < 10) {
                hours = `0${hours}`;
            }
            timeArray[i] = `${this.response.daily.time[dayIndex]}T${hours}:00`;
            hours = Number(hours);
            hours += 2;
        }

        // Determine index values for hourly from the response
        const indexArray = [];
        timeArray.forEach(item => indexArray.push(this.response.hourly.time.indexOf(item)))

        // Populate arrays with data from the response
        const temperatureArray = [];
        const weatherCodeArray = [];
        const precipitationArray = [];
        const windArray = [];

        indexArray.forEach(index => {
            temperatureArray.push(`${this.response.hourly.temperature_2m[index]}°C`);
            weatherCodeArray.push(this.response.hourly.weathercode[index]);
            precipitationArray.push(`${this.response.hourly.precipitation[index]} mm`);
            windArray.push(this.response.hourly.windspeed_10m[index]);
        });

        // Remove date values to leave only time values
        timeArray.forEach(item => {
            const index = timeArray.indexOf(item);
            timeArray[index] = timeArray[index].split("T")[1];
        });
        
        // Convert weather codes into text explanations
        weatherCodeArray.forEach(item => {
            const index = weatherCodeArray.indexOf(item);
            weatherCodeArray[index] = coordinator.convertWeatherCode(weatherCodeArray[index]);
        });

        // Send data to the displayController method
        displayController.selectDay(dayIndex, timeArray, temperatureArray, weatherCodeArray, precipitationArray, windArray);
    },

    processDayContainerClick(index) {
        const selectedDay = this.response.daily.time[index];
        coordinator.selectDay(index);
    }
}

const displayController = {
    displayData(data) {
        const dayContainers = Array.from(document.querySelectorAll(".dayContainer"));
    
        dayContainers.forEach(item => { 
            displayController.displayDataInDayRow(item, data, dayContainers.indexOf(item));
        });
    },

    displayDataInDayRow(item, data, index) {
        const weekDay = item.querySelector(".weekDay");
        let weekDayString = data.daily.time[index];
        weekDayString = new Date(weekDayString);
        weekDayString = weekDayString.getDay();
        weekDayString = coordinator.convertWeekDay(weekDayString);
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
        const weatherCodeConverted = coordinator.convertWeatherCode(data.daily.weathercode[index]);
        weatherCode.innerText = weatherCodeConverted;
    
        const temperatureMax = item.querySelector(".temperatureMax");
        temperatureMax.innerText = `Max: ${data.daily.temperature_2m_max[index]}°C`;
    
        const temperatureMin = item.querySelector(".temperatureMin");
        temperatureMin.innerText = `Min: ${data.daily.temperature_2m_min[index]}°C`;
    },

    selectDay(dayIndex, timeArray, temperatureArray, weatherCodeArray, precipitationArray, windArray) {

        displayController.displaySelectedDay(timeArray, temperatureArray, weatherCodeArray, precipitationArray, windArray);

        displayController.highlightSelectedDayInRow(dayIndex);
    },

    displaySelectedDay(timeArray, temperatureArray, weatherCodeArray, precipitationArray, windArray) {
        const hourContainers = document.querySelectorAll(".hourContainer");
        let i = 0;
        hourContainers.forEach(hourContainer => {
            const time = hourContainer.querySelector(".time");
            time.innerText = timeArray[i];

            const temperature = hourContainer.querySelector(".temperature");
            temperature.innerText = temperatureArray[i];

            const weatherCode = hourContainer.querySelector(".weatherCode");
            weatherCode.innerText = weatherCodeArray[i];

            const precipitation = hourContainer.querySelector(".precipitation");
            precipitation.innerText = precipitationArray[i];

            const wind = hourContainer.querySelector(".wind");
            wind.innerText = windArray[i];

            i++;
        });
    },

    highlightSelectedDayInRow(dayIndex) {
        const dayContainers = document.querySelectorAll(".dayContainer");
        dayContainers.forEach(item => item.classList.remove("selectedDayContainer"));
        dayContainers[dayIndex].classList.add("selectedDayContainer");
    },

    addEventListeners() {
        const dayContainers = document.querySelectorAll(".dayContainer");
        dayContainers.forEach(container => container.addEventListener("click", displayController.processDayContainerClick));
    },

    processDayContainerClick(event) {

        // Determine the index of the item that was clicked
        const dayContainers = Array.from(document.querySelectorAll(".dayContainer"));
        let index;

        if (dayContainers.indexOf(event.path[0]) == (-1)) {
            index = dayContainers.indexOf(event.path[1]);
        } else {
            index = dayContainers.indexOf(event.path[0]);
        } 

        coordinator.processDayContainerClick(index);
    }
}

const variables = coordinator.createVariables();
apiController.fetchData(variables);
displayController.addEventListeners();




