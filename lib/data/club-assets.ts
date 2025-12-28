
export interface RankingEntry {
    id: string;
    name: string;
    avatar?: string;
    meters: number;
    attendance: number;
    socialPoints: number;
    totalXP: number;
    category: 'Elite' | 'Master' | 'Base' | 'Iniciante';
    rank: number;
    trend: 'up' | 'down' | 'stable';
}

export const performanceRanking: RankingEntry[] = [
    {
        id: '1',
        name: 'Carlos Oliveira',
        meters: 154000,
        attendance: 100,
        socialPoints: 450,
        totalXP: 2500,
        category: 'Elite',
        rank: 1,
        trend: 'stable'
    },
    {
        id: '2',
        name: 'Mariana Santos',
        meters: 142000,
        attendance: 95,
        socialPoints: 600,
        totalXP: 2350,
        category: 'Elite',
        rank: 2,
        trend: 'up'
    },
    {
        id: '3',
        name: 'Roberto Lima',
        meters: 128000,
        attendance: 85,
        socialPoints: 300,
        totalXP: 1950,
        category: 'Master',
        rank: 3,
        trend: 'down'
    },
    {
        id: '4',
        name: 'Fernanda Costa',
        meters: 95000,
        attendance: 90,
        socialPoints: 850,
        totalXP: 1800,
        category: 'Base',
        rank: 4,
        trend: 'up'
    },
    {
        id: '5',
        name: 'João Pedro',
        meters: 88000,
        attendance: 80,
        socialPoints: 200,
        totalXP: 1450,
        category: 'Base',
        rank: 5,
        trend: 'stable'
    }
];

export interface ClubEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'social' | 'assembly' | 'ceremony';
    capacity?: number;
    rsvps: number;
    isConfirmed: boolean;
}

export const clubEvents: ClubEvent[] = [
    {
        id: '1',
        title: 'Feijoada do Centenário',
        description: 'Evento tradicional para arrecadação de fundos e confraternização entre sócios e atletas.',
        date: '2025-01-19',
        time: '12:00',
        location: 'Sede Social - Salão Principal',
        type: 'social',
        capacity: 200,
        rsvps: 145,
        isConfirmed: true
    },
    {
        id: '2',
        title: 'Assembleia Geral Ordinária',
        description: 'Votação do orçamento anual e prestação de contas do exercício anterior.',
        date: '2025-02-05',
        time: '19:00',
        location: 'Sede Social - Auditório',
        type: 'assembly',
        rsvps: 45,
        isConfirmed: false
    },
    {
        id: '3',
        title: 'Cerimônia de Batismo de Barcos',
        description: 'Batismo dos novos Single Skiffs adquiridos pelo clube.',
        date: '2025-01-10',
        time: '09:00',
        location: 'Garagem de Barcos',
        type: 'ceremony',
        rsvps: 30,
        isConfirmed: true
    }
];
