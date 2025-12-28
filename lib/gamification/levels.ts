// Sistema de Gamificação - Níveis e Regras
// Sport Club de Natal

export interface Level {
    id: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    icon: string;
    color: string;
    benefits: string[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'TRAINING' | 'VOLUNTEER' | 'SOCIAL' | 'LOYALTY' | 'ACHIEVEMENT';
    condition: string;
    points: number;
}

// NÍVEIS DO SISTEMA "DIAMANTE"
// Baseado em pontos acumulados por atividades
export const LEVELS: Level[] = [
    {
        id: 1,
        name: 'Bronze',
        minPoints: 0,
        maxPoints: 499,
        icon: '🥉',
        color: '#CD7F32',
        benefits: [
            'Acesso ao mural de notícias',
            'Reserva de barcos (até 2h)',
            'Participa de treinos em grupo'
        ]
    },
    {
        id: 2,
        name: 'Prata',
        minPoints: 500,
        maxPoints: 1499,
        icon: '🥈',
        color: '#C0C0C0',
        benefits: [
            'Tudo do Bronze +',
            'Reserva de barcos (até 4h)',
            'Desconto 5% na loja',
            'Acesso a treinos especiais'
        ]
    },
    {
        id: 3,
        name: 'Ouro',
        minPoints: 1500,
        maxPoints: 3999,
        icon: '🥇',
        color: '#FFD700',
        benefits: [
            'Tudo do Prata +',
            'Reserva de barcos (até 6h)',
            'Desconto 10% na loja',
            'Prioridade na fila de espera',
            'Acesso a competições'
        ]
    },
    {
        id: 4,
        name: 'Platina',
        minPoints: 4000,
        maxPoints: 7999,
        icon: '💎',
        color: '#E5E4E2',
        benefits: [
            'Tudo do Ouro +',
            'Reserva de barcos ilimitada',
            'Desconto 15% na loja',
            'Convites para eventos exclusivos',
            'Mentoria com atletas experientes'
        ]
    },
    {
        id: 5,
        name: 'Diamante',
        minPoints: 8000,
        maxPoints: Infinity,
        icon: '💠',
        color: '#B9F2FF',
        benefits: [
            'Tudo do Platina +',
            'Desconto 20% na loja',
            'Vaga garantida em competições',
            'Acesso VIP a eventos',
            'Participação em decisões do clube',
            'Carteirinha especial holográfica'
        ]
    }
];

// COMO GANHAR PONTOS
export const POINT_RULES = {
    // TREINOS
    WORKOUT_COMPLETED: 10,          // Completar um treino
    WORKOUT_GPS_TRACKED: 5,         // Treino com GPS
    WORKOUT_STREAK_7_DAYS: 50,      // 7 dias seguidos treinando
    WORKOUT_STREAK_30_DAYS: 200,    // 30 dias seguidos treinando
    WORKOUT_DISTANCE_5KM: 15,       // Remar 5km em um treino
    WORKOUT_DISTANCE_10KM: 30,      // Remar 10km em um treino

    // GARAGEM
    RESERVATION_CHECKIN: 5,         // Fazer check-in
    RESERVATION_CHECKOUT_CLEAN: 10, // Check-out com barco limpo
    RESERVATION_ON_TIME: 15,        // Devolver no horário
    MAINTENANCE_REPORT: 20,         // Reportar problema

    // VOLUNTARIADO
    VOLUNTEER_TASK_LOW: 10,         // Tarefa prioridade baixa
    VOLUNTEER_TASK_MEDIUM: 15,      // Tarefa prioridade média
    VOLUNTEER_TASK_HIGH: 25,        // Tarefa prioridade alta
    VOLUNTEER_TASK_URGENT: 40,      // Tarefa urgente
    VOLUNTEER_HOURS_MULTIPLIER: 5,  // x5 por hora trabalhada

    // SOCIAL
    PROFILE_COMPLETE: 50,           // Completar perfil
    ANAMNESE_COMPLETE: 100,         // Completar anamnese
    INVITE_FRIEND: 100,             // Convidar amigo que se cadastra
    EVENT_ATTENDANCE: 25,           // Participar de evento

    // LOJA
    STORE_PURCHASE_MULTIPLIER: 0.1, // 10% do valor em pontos

    // ESPECIAIS
    BIRTHDAY_BONUS: 100,            // Aniversário no clube
    ANNIVERSARY_BONUS: 200,         // Aniversário de associação
    COMPETITION_PARTICIPATION: 150, // Participar de competição
    COMPETITION_PODIUM: 500,        // Pódio em competição
};

// BADGES DISPONÍVEIS
export const BADGES: Badge[] = [
    // TREINOS
    {
        id: 'first_workout',
        name: 'Primeiro Remo',
        description: 'Complete seu primeiro treino',
        icon: '🚣',
        category: 'TRAINING',
        condition: 'workouts_completed >= 1',
        points: 50
    },
    {
        id: 'early_bird',
        name: 'Madrugador',
        description: 'Treine antes das 6h da manhã',
        icon: '🌅',
        category: 'TRAINING',
        condition: 'early_morning_workout',
        points: 30
    },
    {
        id: 'marathon_rower',
        name: 'Maratonista',
        description: 'Reme 42km acumulados',
        icon: '🏅',
        category: 'TRAINING',
        condition: 'total_distance >= 42000',
        points: 200
    },
    {
        id: 'consistency_king',
        name: 'Rei da Consistência',
        description: 'Treine 30 dias seguidos',
        icon: '👑',
        category: 'TRAINING',
        condition: 'workout_streak >= 30',
        points: 300
    },

    // VOLUNTARIADO
    {
        id: 'helping_hand',
        name: 'Mão Amiga',
        description: 'Complete sua primeira tarefa voluntária',
        icon: '🤝',
        category: 'VOLUNTEER',
        condition: 'volunteer_tasks_completed >= 1',
        points: 50
    },
    {
        id: 'super_volunteer',
        name: 'Super Voluntário',
        description: 'Complete 10 tarefas voluntárias',
        icon: '⭐',
        category: 'VOLUNTEER',
        condition: 'volunteer_tasks_completed >= 10',
        points: 200
    },
    {
        id: 'hero',
        name: 'Herói do Clube',
        description: 'Acumule 100 horas de voluntariado',
        icon: '🦸',
        category: 'VOLUNTEER',
        condition: 'volunteer_hours >= 100',
        points: 500
    },

    // SOCIAL
    {
        id: 'networker',
        name: 'Networker',
        description: 'Convide 3 amigos para o clube',
        icon: '🔗',
        category: 'SOCIAL',
        condition: 'friends_invited >= 3',
        points: 150
    },
    {
        id: 'event_lover',
        name: 'Amante de Eventos',
        description: 'Participe de 5 eventos',
        icon: '🎉',
        category: 'SOCIAL',
        condition: 'events_attended >= 5',
        points: 100
    },

    // LEALDADE
    {
        id: 'one_year',
        name: 'Veterano',
        description: '1 ano de associação',
        icon: '🎂',
        category: 'LOYALTY',
        condition: 'membership_years >= 1',
        points: 200
    },
    {
        id: 'five_years',
        name: 'Lenda',
        description: '5 anos de associação',
        icon: '🏆',
        category: 'LOYALTY',
        condition: 'membership_years >= 5',
        points: 1000
    },

    // CONQUISTAS
    {
        id: 'diamond_member',
        name: 'Sócio Diamante',
        description: 'Alcance o nível Diamante',
        icon: '💠',
        category: 'ACHIEVEMENT',
        condition: 'level >= 5',
        points: 500
    },
    {
        id: 'completionist',
        name: 'Completista',
        description: 'Desbloqueie todos os badges',
        icon: '🎯',
        category: 'ACHIEVEMENT',
        condition: 'all_badges_unlocked',
        points: 1000
    }
];

// Funções utilitárias
export function getLevelByPoints(points: number): Level {
    return LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || LEVELS[0];
}

export function getNextLevel(currentPoints: number): Level | null {
    const currentLevel = getLevelByPoints(currentPoints);
    const nextIndex = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

export function getPointsToNextLevel(currentPoints: number): number {
    const nextLevel = getNextLevel(currentPoints);
    if (!nextLevel) return 0;
    return nextLevel.minPoints - currentPoints;
}

export function calculateProgressToNextLevel(currentPoints: number): number {
    const currentLevel = getLevelByPoints(currentPoints);
    const nextLevel = getNextLevel(currentPoints);

    if (!nextLevel) return 100; // Já está no máximo

    const pointsInCurrentLevel = currentPoints - currentLevel.minPoints;
    const pointsNeededForNext = nextLevel.minPoints - currentLevel.minPoints;

    return Math.round((pointsInCurrentLevel / pointsNeededForNext) * 100);
}
