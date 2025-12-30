// Weather API Integration using Open-Meteo (free, no API key required)

import axios from 'axios';
import type { OpenMeteoResponse, WeatherCurrent, WeatherHour, WeatherDay, WeatherCondition, WaveConditions } from '@/types/tides';

const NATAL_LAT = -5.7945;
const NATAL_LON = -35.2110;
const TIMEZONE = 'America/Fortaleza';

// Wind direction helper
function getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Weather condition mapper
function mapWeatherCondition(code: number): { condition: WeatherCondition; text: string; icon: string } {
    // WMO Weather interpretation codes
    const weatherMap: Record<number, { condition: WeatherCondition; text: string; icon: string }> = {
        0: { condition: 'clear', text: 'Céu limpo', icon: '01d' },
        1: { condition: 'clear', text: 'Predominantemente limpo', icon: '01d' },
        2: { condition: 'partly-cloudy', text: 'Parcialmente nublado', icon: '02d' },
        3: { condition: 'overcast', text: 'Nublado', icon: '03d' },
        45: { condition: 'fog', text: 'Nevoeiro', icon: '50d' },
        48: { condition: 'fog', text: 'Nevoeiro com geada', icon: '50d' },
        51: { condition: 'drizzle', text: 'Garoa leve', icon: '09d' },
        53: { condition: 'drizzle', text: 'Garoa moderada', icon: '09d' },
        55: { condition: 'drizzle', text: 'Garoa forte', icon: '09d' },
        61: { condition: 'rain', text: 'Chuva leve', icon: '10d' },
        63: { condition: 'rain', text: 'Chuva moderada', icon: '10d' },
        65: { condition: 'rain', text: 'Chuva forte', icon: '10d' },
        80: { condition: 'rain', text: 'Pancadas de chuva leves', icon: '09d' },
        81: { condition: 'rain', text: 'Pancadas de chuva moderadas', icon: '09d' },
        82: { condition: 'rain', text: 'Pancadas de chuva fortes', icon: '09d' },
        95: { condition: 'thunderstorm', text: 'Tempestade', icon: '11d' },
        96: { condition: 'thunderstorm', text: 'Tempestade com granizo leve', icon: '11d' },
        99: { condition: 'thunderstorm', text: 'Tempestade com granizo forte', icon: '11d' },
    };

    return weatherMap[code] || { condition: 'clear' as WeatherCondition, text: 'Céu limpo', icon: '01d' };
}

export async function fetchWeatherData(): Promise<OpenMeteoResponse> {
    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: NATAL_LAT,
                longitude: NATAL_LON,
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'apparent_temperature',
                    'is_day',
                    'precipitation',
                    'weather_code',
                    'cloud_cover',
                    'pressure_msl',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m'
                ].join(','),
                hourly: [
                    'temperature_2m',
                    'apparent_temperature',
                    'relative_humidity_2m',
                    'precipitation',
                    'precipitation_probability',
                    'weathercode',
                    'cloudcover',
                    'visibility',
                    'windspeed_10m',
                    'windgusts_10m',
                    'winddirection_10m'
                ].join(','),
                daily: [
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'sunrise',
                    'sunset',
                    'uv_index_max',
                    'precipitation_sum',
                    'precipitation_probability_max',
                    'weathercode'
                ].join(','),
                timezone: TIMEZONE,
                forecast_days: 7
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}

export async function fetchMarineData(): Promise<WaveConditions> {
    try {
        const response = await axios.get('https://marine-api.open-meteo.com/v1/marine', {
            params: {
                latitude: NATAL_LAT,
                longitude: NATAL_LON,
                current: [
                    'wave_height',
                    'wave_period',
                    'wave_direction'
                ].join(','),
                timezone: TIMEZONE
            }
        });

        const current = response.data.current;
        const deg = current.wave_direction;
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const dirText = directions[Math.round(deg / 45) % 8];

        let seaState: 'calm' | 'moderate' | 'rough' | 'very-rough' = 'calm';
        if (current.wave_height < 0.3) seaState = 'calm';
        else if (current.wave_height < 1.0) seaState = 'moderate';
        else if (current.wave_height < 2.0) seaState = 'rough';
        else seaState = 'very-rough';

        return {
            datetime: new Date(current.time),
            height: current.wave_height,
            period: current.wave_period,
            direction: dirText,
            directionDegrees: deg,
            waterTemp: 27.5, // Fallback ou extrair de outra fonte se disponível
            seaState
        };
    } catch (error) {
        console.error('Error fetching marine data:', error);
        return {
            datetime: new Date(),
            height: 0.5,
            period: 6,
            direction: 'E',
            directionDegrees: 90,
            waterTemp: 27,
            seaState: 'moderate'
        };
    }
}

export function parseWeatherCurrent(data: OpenMeteoResponse): WeatherCurrent {
    const now = new Date();
    const hourIndex = 0; // Primeiro item é a hora atual

    const weatherCode = data.hourly.weathercode?.[hourIndex] || 0;
    const { condition, text, icon } = mapWeatherCondition(weatherCode);

    return {
        datetime: new Date(data.hourly.time[hourIndex]),
        temperature: data.hourly.temperature_2m[hourIndex],
        feelsLike: data.hourly.apparent_temperature?.[hourIndex] || data.hourly.temperature_2m[hourIndex],
        humidity: data.hourly.relative_humidity_2m[hourIndex],
        pressure: 1013, // Open-Meteo free não fornece, usar padrão
        visibility: data.hourly.visibility?.[hourIndex] || 10000,
        uvIndex: data.daily.uv_index_max[0],
        windSpeed: data.hourly.windspeed_10m[hourIndex],
        windGust: data.hourly.windgusts_10m?.[hourIndex],
        windDirection: getWindDirection(data.hourly.winddirection_10m[hourIndex]),
        windDirDegrees: data.hourly.winddirection_10m[hourIndex],
        precipitation: data.hourly.precipitation[hourIndex],
        cloudCover: data.hourly.cloudcover[hourIndex],
        condition,
        conditionText: text,
        icon
    };
}

export function parseWeatherHourly(data: OpenMeteoResponse): WeatherHour[] {
    const hourly: WeatherHour[] = [];

    // Próximas 24 horas
    for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
        const weatherCode = data.hourly.weathercode?.[i] || 0;
        const { condition, text, icon } = mapWeatherCondition(weatherCode);

        hourly.push({
            datetime: new Date(data.hourly.time[i]),
            temperature: data.hourly.temperature_2m[i],
            feelsLike: data.hourly.apparent_temperature?.[i] || data.hourly.temperature_2m[i],
            humidity: data.hourly.relative_humidity_2m[i],
            windSpeed: data.hourly.windspeed_10m[i],
            windDirection: getWindDirection(data.hourly.winddirection_10m[i]),
            precipitation: data.hourly.precipitation[i],
            precipProb: data.hourly.precipitation_probability?.[i] || 0,
            condition,
            conditionText: text,
            icon
        });
    }

    return hourly;
}

export function parseWeatherDaily(data: OpenMeteoResponse): WeatherDay[] {
    const daily: WeatherDay[] = [];

    for (let i = 0; i < data.daily.time.length; i++) {
        const weatherCode = data.daily.weathercode?.[i] || 0;
        const { condition, text, icon } = mapWeatherCondition(weatherCode);

        daily.push({
            date: new Date(data.daily.time[i]),
            tempMin: data.daily.temperature_2m_min[i],
            tempMax: data.daily.temperature_2m_max[i],
            condition,
            conditionText: text,
            precipProb: data.daily.precipitation_probability_max?.[i] || 0,
            uvIndex: data.daily.uv_index_max[i],
            sunrise: data.daily.sunrise[i].split('T')[1],
            sunset: data.daily.sunset[i].split('T')[1],
            icon
        });
    }

    return daily;
}

// Salvar dados no banco (atualização periódica)
export async function saveWeatherToDatabase(data: OpenMeteoResponse) {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const hourly = parseWeatherHourly(data);

        for (const hour of hourly) {
            await prisma.weatherData.upsert({
                where: {
                    // Não há unique constraint, então criar manualmente
                    datetime_location: {
                        datetime: hour.datetime,
                        location: 'Natal-RN'
                    }
                },
                update: {
                    temperature: hour.temperature,
                    feelsLike: hour.feelsLike,
                    tempMin: hour.temperature,
                    tempMax: hour.temperature,
                    humidity: hour.humidity,
                    pressure: 1013,
                    visibility: 10000,
                    uvIndex: 0,
                    precipitation: hour.precipitation,
                    precipProb: hour.precipProb,
                    cloudCover: 0,
                    windSpeed: hour.windSpeed,
                    windGust: null,
                    windDirection: 0,
                    windDirText: hour.windDirection,
                    condition: hour.condition,
                    conditionText: hour.conditionText,
                    icon: hour.icon
                },
                create: {
                    datetime: hour.datetime,
                    location: 'Natal-RN',
                    temperature: hour.temperature,
                    feelsLike: hour.feelsLike,
                    tempMin: hour.temperature,
                    tempMax: hour.temperature,
                    humidity: hour.humidity,
                    pressure: 1013,
                    visibility: 10000,
                    uvIndex: 0,
                    precipitation: hour.precipitation,
                    precipProb: hour.precipProb,
                    cloudCover: 0,
                    windSpeed: hour.windSpeed,
                    windGust: null,
                    windDirection: 0,
                    windDirText: hour.windDirection,
                    condition: hour.condition,
                    conditionText: hour.conditionText,
                    icon: hour.icon
                }
            });
        }

        console.log('Weather data saved successfully');
    } catch (error) {
        console.error('Error saving weather data:', error);
    } finally {
        await prisma.$disconnect();
    }
}
