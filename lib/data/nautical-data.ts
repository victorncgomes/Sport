
export interface TideLevel {
    time: string;
    height: number;
    type: 'high' | 'low';
}

export interface NauticalData {
    temperature: number;
    windSpeed: number;
    windDirection: string;
    humidity: number;
    pressure: number;
    visibility: number;
    waterTemp: number;
    uvIndex: number;
    condition: 'Optimal' | 'Caution' | 'Prohibited';
    message: string;
    tides: TideLevel[];
    forecast: {
        time: string;
        temp: number;
        condition: string;
    }[];
}

export const activeNauticalData: NauticalData = {
    temperature: 28,
    windSpeed: 12, // knots
    windDirection: 'SE',
    humidity: 75,
    pressure: 1012,
    visibility: 10,
    waterTemp: 26,
    uvIndex: 8,
    condition: 'Optimal',
    message: 'Condição excelente para remo. Ventos leves de Sudeste.',
    tides: [
        { time: '04:20', height: 0.2, type: 'low' },
        { time: '10:45', height: 2.1, type: 'high' },
        { time: '16:55', height: 0.3, type: 'low' },
        { time: '23:10', height: 2.0, type: 'high' },
    ],
    forecast: [
        { time: '14:00', temp: 30, condition: 'Sunny' },
        { time: '16:00', temp: 29, condition: 'Partly Cloudy' },
        { time: '18:00', temp: 27, condition: 'Clear' },
        { time: '20:00', temp: 26, condition: 'Clear' },
    ]
};
