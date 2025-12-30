const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testRealData() {
    console.log('🧪 Iniciando Teste de Dados Reais...\n');

    // 1. Teste Maré Oficial (Simulando getTidesForDate)
    try {
        const tideJsonPath = path.join(__dirname, 'lib', 'data', 'tide-data.json');
        const tideData = JSON.parse(fs.readFileSync(tideJsonPath, 'utf8'));
        const todayKey = '2025-12';
        const day = 30;
        const dayTides = tideData[todayKey].days.find(d => d.day === day);
        console.log('✅ Maré Oficial (30/12/2025):', JSON.stringify(dayTides.tides, null, 2));
    } catch (e) {
        console.error('❌ Erro no teste de Maré:', e.message);
    }

    // 2. Teste Clima e Astronomia
    try {
        const lat = -5.7945;
        const lon = -35.2110;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=America/Fortaleza`;
        const res = await axios.get(url);
        console.log('\n✅ Astronomia Real (API):', {
            sunrise: res.data.daily.sunrise[0],
            sunset: res.data.daily.sunset[0]
        });
    } catch (e) {
        console.error('❌ Erro no teste de Clima/Astro:', e.message);
    }

    // 3. Teste Ondas Real-Time
    try {
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=-5.7945&longitude=-35.2110&current=wave_height,wave_period,wave_direction&timezone=America/Fortaleza`;
        const res = await axios.get(url);
        console.log('\n✅ Ondas Real-Time (API):', res.data.current);
    } catch (e) {
        console.error('❌ Erro no teste de Ondas:', e.message);
    }
}

testRealData();
