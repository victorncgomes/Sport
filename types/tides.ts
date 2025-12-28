// Types for Tides & Weather System

export type MoonPhase = 'NEW' | 'FIRST_QUARTER' | 'FULL' | 'LAST_QUARTER';
export type SeaState = 'calm' | 'moderate' | 'rough' | 'very-rough';
export type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'overcast' | 'rain' | 'drizzle' | 'thunderstorm' | 'fog';
export type TideType = 'HIGH' | 'LOW';

export interface TidePoint {
    time: string; // HH:mm format
    height: number; // metros
    type: TideType;
}

export interface TideDay {
    date: Date;
    coefficient: number; // 0-100
    tides: TidePoint[];
    sunrise: string; // HH:mm
    sunset: string; // HH:mm
    moonPhase: MoonPhase;
    moonIllumination: number; // 0-100%
    moonrise?: string; // HH:mm
    moonset?: string; // HH:mm
    bestRowingTime: string | null; // HH:mm
}

export interface WeatherHour {
    datetime: Date;
    temperature: number; // °C
    feelsLike: number; // °C
    humidity: number; // %
    windSpeed: number; // km/h
    windDirection: string; // N, NE, E, SE, S, SW, W, NW
    precipitation: number; // mm
    precipProb: number; // %
    condition: WeatherCondition;
    conditionText: string;
    icon: string;
}

export interface WeatherDay {
    date: Date;
    tempMin: number;
    tempMax: number;
    condition: WeatherCondition;
    conditionText: string;
    precipProb: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
    icon: string;
}

export interface WeatherCurrent {
    datetime: Date;
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number; // hPa
    visibility: number; // metros
    uvIndex: number;
    windSpeed: number;
    windGust?: number;
    windDirection: string;
    windDirDegrees: number;
    precipitation: number;
    cloudCover: number;
    condition: WeatherCondition;
    conditionText: string;
    icon: string;
}

export interface WaveConditions {
    datetime: Date;
    height: number; // metros
    period: number; // segundos
    direction: string; // NE, E, SE, S, SW, W, NW, N
    directionDegrees: number;
    waterTemp: number; // °C
    seaState: SeaState;
}

export interface TideAlertConditions {
    minCoefficient?: number;
    maxCoefficient?: number;
    idealWindSpeed?: { min: number; max: number };
    idealWaveHeight?: { max: number };
}

export interface TideAlertData {
    id: string;
    userId: string;
    alertType: 'IDEAL_CONDITIONS' | 'HIGH_TIDE' | 'LOW_TIDE';
    enabled: boolean;
    threshold?: TideAlertConditions;
}

// Helper Types
export interface TidesWeatherData {
    tides: TideDay[];
    current: WeatherCurrent;
    hourly: WeatherHour[]; // próximas 24h
    daily: WeatherDay[]; // próximos 7 dias
    waves: WaveConditions;
}

export interface RowingConditions {
    isIdeal: boolean;
    score: number; // 0-100
    factors: {
        tide: 'excellent' | 'good' | 'moderate' | 'poor';
        wind: 'excellent' | 'good' | 'moderate' | 'poor';
        waves: 'excellent' | 'good' | 'moderate' | 'poor';
        weather: 'excellent' | 'good' | 'moderate' | 'poor';
    };
    bestTime: string | null; // HH:mm
    recommendation: string;
}

// API Response Types
export interface OpenMeteoResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    hourly: {
        time: string[];
        temperature_2m: number[];
        apparent_temperature?: number[];
        relative_humidity_2m: number[];
        precipitation: number[];
        precipitation_probability?: number[];
        weathercode?: number[];
        cloudcover: number[];
        visibility?: number[];
        windspeed_10m: number[];
        windgusts_10m?: number[];
        winddirection_10m: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        sunrise: string[];
        sunset: string[];
        uv_index_max: number[];
        precipitation_sum?: number[];
        precipitation_probability_max?: number[];
        weathercode?: number[];
    };
}
