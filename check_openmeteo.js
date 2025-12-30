const axios = require('axios');

async function checkOpenMeteo() {
    const lat = -5.7945;
    const lon = -35.2110;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=America/Fortaleza`;

    try {
        const response = await axios.get(url);
        console.log('Open-Meteo Data:', JSON.stringify(response.data.daily, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

checkOpenMeteo();
