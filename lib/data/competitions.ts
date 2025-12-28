export type CompetitionStatus = 'upcoming' | 'open' | 'ongoing' | 'finished';

export interface Competition {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: 'Interna' | 'Estadual' | 'Nacional' | 'Internacional';
    status: CompetitionStatus;
    participants: number;
}

export const regatas: Competition[] = [
    {
        id: '1',
        title: 'Regata de Verão - SCN 110 Anos',
        description: 'Grande celebração do aniversário do clube com participação de todas as categorias.',
        date: '2025-04-07',
        location: 'Raia do Potengi, Natal/RN',
        type: 'Interna',
        status: 'open',
        participants: 120
    },
    {
        id: '2',
        title: 'Campeonato Potiguar de Remo - 1ª Etapa',
        description: 'Abertura oficial do calendário estadual de 2025.',
        date: '2025-01-20',
        location: 'Base Naval, Natal/RN',
        type: 'Estadual',
        status: 'upcoming',
        participants: 85
    },
    {
        id: '3',
        title: 'Copa Brasil de Remo Master',
        description: 'Competição nacional reunindo veteranos de todo o país.',
        date: '2024-11-10',
        location: 'Lagoa Rodrigo de Freitas, RJ',
        type: 'Nacional',
        status: 'finished',
        participants: 350
    },
    {
        id: '4',
        title: 'Regata Noturna de São João',
        description: 'Tradicinal prova noturna seguida de festejos juninos na sede.',
        date: '2025-06-24',
        location: 'Raia do Potengi, Natal/RN',
        type: 'Interna',
        status: 'upcoming',
        participants: 50
    }
];
