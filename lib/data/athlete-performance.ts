export interface PerformanceMetric {
    date: string;
    erg500m: string;
    erg2000m: string;
    weight: number;
    heartRateRest: number;
}

export interface TrainingPlan {
    id: string;
    athleteRole: string;
    weekNumber: number;
    sessions: {
        day: string;
        target: string;
        description: string;
        intensity: 'Baixa' | 'Moderada' | 'Alta' | 'V02 Máx';
    }[];
}

export interface Anamnesis {
    lastUpdate: string;
    bloodType: string;
    allergies: string[];
    medications: string[];
    previousInjuries: string[];
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
}

export interface AthleteData {
    id: string;
    name: string;
    category: string;
    coach: string;
    performance: PerformanceMetric[];
    anamnesis: Anamnesis;
    currentPlan: TrainingPlan;
}

export const athleteData: AthleteData = {
    id: 'ath_1',
    name: 'Remador Exemplo',
    category: 'Sênior A',
    coach: 'Fernando Lima',
    performance: [
        { date: '2024-10-01', erg500m: '01:28.5', erg2000m: '06:15.2', weight: 82.5, heartRateRest: 52 },
        { date: '2024-11-01', erg500m: '01:27.2', erg2000m: '06:10.8', weight: 81.8, heartRateRest: 50 },
        { date: '2024-12-01', erg500m: '01:26.5', erg2000m: '06:05.4', weight: 80.5, heartRateRest: 48 },
    ],
    anamnesis: {
        lastUpdate: '2024-06-15',
        bloodType: 'O+',
        allergies: ['Nenhuma'],
        medications: ['Nenhum'],
        previousInjuries: ['Tendinite no punho esquerdo (2022)'],
        emergencyContact: {
            name: 'Maria Silva',
            phone: '(84) 99888-7766',
            relation: 'Esposa'
        }
    },
    currentPlan: {
        id: 'plan_123',
        athleteRole: 'Sênior A',
        weekNumber: 42,
        sessions: [
            { day: 'Segunda', target: 'Endurance', description: '20km contínuo (Rate 18-20)', intensity: 'Moderada' },
            { day: 'Terça', target: 'Potência', description: '4x500m (Pausa 4min) - All out', intensity: 'V02 Máx' },
            { day: 'Quarta', target: 'Recuperação', description: '10km remo técnico (Rate 16)', intensity: 'Baixa' },
            { day: 'Quinta', target: 'Limiar', description: '3x3000m (Pausa 3min) - Rate 24', intensity: 'Alta' },
            { day: 'Sexta', target: 'Musculação', description: 'Treino A (Força Explosiva)', intensity: 'Alta' },
            { day: 'Sábado', target: 'Simulado', description: '2000m contra o relógio', intensity: 'V02 Máx' }
        ]
    }
};
