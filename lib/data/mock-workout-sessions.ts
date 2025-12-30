// Mock Workout Sessions Generator
// Gera 10 sessões de treino fictícias com dados realistas

export interface MockWorkoutSession {
    id: string;
    date: Date;
    sport: 'ROWING' | 'RUNNING' | 'CYCLING';
    location: string;
    duration: number; // segundos
    distance: number; // metros
    avgPace: string; // mm:ss/500m
    avgHeartRate: number;
    maxHeartRate: number;
    calories: number;
    gpsTrack?: { lat: number; lng: number; timestamp: number }[];
}

// Coordenadas base do Sport Club de Natal
const BASE_LAT = -5.7945;
const BASE_LON = -35.2110;

// Gera um track GPS simulado para remo no Rio Potengi
function generateRowingGPSTrack(distance: number): { lat: number; lng: number; timestamp: number }[] {
    const points: { lat: number; lng: number; timestamp: number }[] = [];
    const numPoints = Math.floor(distance / 100); // Um ponto a cada 100m
    const startTime = Date.now() - (distance * 3); // ~3s por metro

    for (let i = 0; i < numPoints; i++) {
        // Simula movimento ao longo do rio (variação pequena)
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lonOffset = (Math.random() - 0.5) * 0.01;

        points.push({
            lat: BASE_LAT + latOffset,
            lng: BASE_LON + lonOffset,
            timestamp: startTime + (i * (distance / numPoints) * 3)
        });
    }

    return points;
}

// Calcula pace em formato mm:ss/500m
function calculatePace(distance: number, duration: number): string {
    const paceSeconds = (duration / distance) * 500;
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.floor(paceSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Gera 10 sessões de treino dos últimos 30 dias
export function generateMockWorkoutSessions(): MockWorkoutSession[] {
    const sessions: MockWorkoutSession[] = [];
    const today = new Date();

    // Sessão 1: Treino longo de remo (10 dias atrás)
    sessions.push({
        id: 'mock-session-1',
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Rio Potengi - Outdoor',
        duration: 3600, // 60 min
        distance: 12000, // 12km
        avgPace: calculatePace(12000, 3600),
        avgHeartRate: 145,
        maxHeartRate: 165,
        calories: 720,
        gpsTrack: generateRowingGPSTrack(12000)
    });

    // Sessão 2: Treino intervalado (9 dias atrás)
    sessions.push({
        id: 'mock-session-2',
        date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Tanque de Remo - Indoor',
        duration: 1800, // 30 min
        distance: 6000, // 6km
        avgPace: calculatePace(6000, 1800),
        avgHeartRate: 162,
        maxHeartRate: 178,
        calories: 450
    });

    // Sessão 3: Corrida leve (8 dias atrás)
    sessions.push({
        id: 'mock-session-3',
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
        sport: 'RUNNING',
        location: 'Parque das Dunas',
        duration: 2400, // 40 min
        distance: 8000, // 8km
        avgPace: '5:00', // 5min/km
        avgHeartRate: 138,
        maxHeartRate: 155,
        calories: 480
    });

    // Sessão 4: Remo técnico (7 dias atrás)
    sessions.push({
        id: 'mock-session-4',
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Rio Potengi - Outdoor',
        duration: 2700, // 45 min
        distance: 9000, // 9km
        avgPace: calculatePace(9000, 2700),
        avgHeartRate: 140,
        maxHeartRate: 158,
        calories: 540,
        gpsTrack: generateRowingGPSTrack(9000)
    });

    // Sessão 5: Treino de velocidade (6 dias atrás)
    sessions.push({
        id: 'mock-session-5',
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Remoergômetro - Indoor',
        duration: 900, // 15 min
        distance: 3000, // 3km
        avgPace: calculatePace(3000, 900),
        avgHeartRate: 170,
        maxHeartRate: 185,
        calories: 225
    });

    // Sessão 6: Treino regenerativo (5 dias atrás)
    sessions.push({
        id: 'mock-session-6',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        sport: 'CYCLING',
        location: 'Ciclovia da Praia',
        duration: 3000, // 50 min
        distance: 20000, // 20km
        avgPace: '2:30', // 2:30min/km
        avgHeartRate: 125,
        maxHeartRate: 142,
        calories: 450
    });

    // Sessão 7: Remo longo (4 dias atrás)
    sessions.push({
        id: 'mock-session-7',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Rio Potengi - Outdoor',
        duration: 4200, // 70 min
        distance: 14000, // 14km
        avgPace: calculatePace(14000, 4200),
        avgHeartRate: 148,
        maxHeartRate: 168,
        calories: 840,
        gpsTrack: generateRowingGPSTrack(14000)
    });

    // Sessão 8: Intervalado curto (3 dias atrás)
    sessions.push({
        id: 'mock-session-8',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Tanque de Remo - Indoor',
        duration: 1200, // 20 min
        distance: 4000, // 4km
        avgPace: calculatePace(4000, 1200),
        avgHeartRate: 165,
        maxHeartRate: 180,
        calories: 300
    });

    // Sessão 9: Treino técnico (2 dias atrás)
    sessions.push({
        id: 'mock-session-9',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Rio Potengi - Outdoor',
        duration: 3300, // 55 min
        distance: 11000, // 11km
        avgPace: calculatePace(11000, 3300),
        avgHeartRate: 142,
        maxHeartRate: 160,
        calories: 660,
        gpsTrack: generateRowingGPSTrack(11000)
    });

    // Sessão 10: Treino de resistência (1 dia atrás)
    sessions.push({
        id: 'mock-session-10',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        sport: 'ROWING',
        location: 'Remoergômetro - Indoor',
        duration: 2400, // 40 min
        distance: 8000, // 8km
        avgPace: calculatePace(8000, 2400),
        avgHeartRate: 155,
        maxHeartRate: 172,
        calories: 480
    });

    return sessions;
}

// Calcula estatísticas agregadas das sessões
export function calculateWorkoutStats(sessions: MockWorkoutSession[]) {
    const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgPace = calculatePace(totalDistance, totalTime);

    // Frequência semanal
    const weeklyTrend = [
        { day: 'Seg', workouts: 0 },
        { day: 'Ter', workouts: 0 },
        { day: 'Qua', workouts: 0 },
        { day: 'Qui', workouts: 0 },
        { day: 'Sex', workouts: 0 },
        { day: 'Sáb', workouts: 0 },
        { day: 'Dom', workouts: 0 },
    ];

    sessions.forEach(session => {
        const dayOfWeek = session.date.getDay();
        weeklyTrend[dayOfWeek === 0 ? 6 : dayOfWeek - 1].workouts++;
    });

    return {
        totalWorkouts7Days: sessions.filter(s => s.date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
        totalWorkouts30Days: sessions.length,
        totalDistance,
        totalTime: Math.floor(totalTime / 60), // em minutos
        avgPace,
        weeklyTrend
    };
}
