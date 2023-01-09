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
    const fetchString = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max&current_weather=true&timezone=auto&start_date=${variables.startDate}&end_date=${variables.endDate}`;

    const response = fetch(fetchString)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        displayData(response);
    });
}


