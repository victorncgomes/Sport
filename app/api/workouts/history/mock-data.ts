export type SportType = 'ROWING' | 'RUNNING' | 'CYCLING' | 'GYM';
export type WorkoutMode = 'OUTDOOR' | 'INDOOR_TANK' | 'INDOOR_GENERAL';

export interface MockSession {
    id: string;
    sport: SportType;
    mode: WorkoutMode;
    duration: number; // seconds
    distance: number; // meters
    calories: number;
    avgPace: string;
    avgHeartRate: number;
    date: string;
    pointsEarned?: number;
    gpsPoints?: { lat: number; lng: number }[];
}

export const mockSessions: MockSession[] = [
    {
        id: '1',
        sport: 'ROWING',
        mode: 'OUTDOOR',
        duration: 3600,
        distance: 12500,
        calories: 650,
        avgPace: '2:15/500m',
        avgHeartRate: 145,
        date: new Date(Date.now() - 86400000).toISOString(), // Ontem
        pointsEarned: 150,
        gpsPoints: [
            { lat: -5.79448, lng: -35.21124 },
            { lat: -5.79348, lng: -35.21224 },
            { lat: -5.79248, lng: -35.21324 },
            { lat: -5.79148, lng: -35.21424 },
            { lat: -5.79048, lng: -35.21524 }
        ]
    },
    {
        id: '2',
        sport: 'RUNNING',
        mode: 'OUTDOOR',
        duration: 1800,
        distance: 5000,
        calories: 400,
        avgPace: '5:30/km',
        avgHeartRate: 155,
        pointsEarned: 80,
        date: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
    },
    {
        id: '3',
        sport: 'GYM',
        mode: 'INDOOR_GENERAL',
        duration: 2700,
        distance: 0,
        calories: 300,
        avgPace: '-',
        avgHeartRate: 110,
        pointsEarned: 100,
        date: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
    },
    {
        id: '4',
        sport: 'ROWING',
        mode: 'INDOOR_TANK',
        duration: 3000,
        distance: 8000,
        calories: 550,
        avgPace: '2:10/500m',
        avgHeartRate: 138,
        pointsEarned: 120,
        date: new Date(Date.now() - 345600000).toISOString(), // 4 dias atrás
    },
    {
        id: '5',
        sport: 'CYCLING',
        mode: 'OUTDOOR',
        duration: 5400,
        distance: 30000,
        calories: 800,
        avgPace: '25km/h',
        avgHeartRate: 130,
        pointsEarned: 200,
        date: new Date(Date.now() - 432000000).toISOString(), // 5 dias atrás
    },
    {
        id: '6',
        sport: 'ROWING',
        mode: 'OUTDOOR',
        duration: 4200,
        distance: 14000,
        calories: 700,
        avgPace: '2:20/500m',
        avgHeartRate: 148,
        pointsEarned: 160,
        date: new Date(Date.now() - 518400000).toISOString(), // 6 dias atrás
    },
    {
        id: '7',
        sport: 'RUNNING',
        mode: 'INDOOR_GENERAL', // Esteira
        duration: 1200,
        distance: 3000,
        calories: 250,
        avgPace: '5:45/km',
        avgHeartRate: 150,
        pointsEarned: 50,
        date: new Date(Date.now() - 604800000).toISOString(), // 7 dias atrás
    },
    {
        id: '8',
        sport: 'ROWING',
        mode: 'OUTDOOR',
        duration: 3600,
        distance: 12000,
        calories: 620,
        avgPace: '2:18/500m',
        avgHeartRate: 142,
        pointsEarned: 140,
        date: new Date(Date.now() - 691200000).toISOString(), // 8 dias atrás
    },
    {
        id: '9',
        sport: 'GYM',
        mode: 'INDOOR_GENERAL',
        duration: 3600,
        distance: 0,
        calories: 350,
        avgPace: '-',
        avgHeartRate: 115,
        pointsEarned: 100,
        date: new Date(Date.now() - 777600000).toISOString(), // 9 dias atrás
    },
    {
        id: '10',
        sport: 'ROWING',
        mode: 'OUTDOOR',
        duration: 4800,
        distance: 16000,
        calories: 850,
        avgPace: '2:12/500m',
        avgHeartRate: 152,
        pointsEarned: 180,
        date: new Date(Date.now() - 864000000).toISOString(), // 10 dias atrás
    }
];
