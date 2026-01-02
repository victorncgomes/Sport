// Gamification Levels - Sport Club de Natal
// Sistema de pontos, níveis e badges

export interface Level {
    id: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    color: string;
    icon: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    points: number;
    condition?: string;
}

// Definição dos níveis
export const LEVELS: Level[] = [
    { id: 1, name: 'Iniciante', minPoints: 0, maxPoints: 99, color: '#9CA3AF', icon: '🌱' },
    { id: 2, name: 'Bronze', minPoints: 100, maxPoints: 299, color: '#CD7F32', icon: '🥉' },
    { id: 3, name: 'Prata', minPoints: 300, maxPoints: 599, color: '#C0C0C0', icon: '🥈' },
    { id: 4, name: 'Ouro', minPoints: 600, maxPoints: 999, color: '#FFD700', icon: '🥇' },
    { id: 5, name: 'Platina', minPoints: 1000, maxPoints: 1999, color: '#E5E4E2', icon: '💎' },
    { id: 6, name: 'Diamante', minPoints: 2000, maxPoints: 4999, color: '#B9F2FF', icon: '💠' },
    { id: 7, name: 'Master', minPoints: 5000, maxPoints: 9999, color: '#DC2626', icon: '🏆' },
    { id: 8, name: 'Lendário', minPoints: 10000, maxPoints: Infinity, color: '#8B5CF6', icon: '👑' },
];

// Regras de pontuação
export const POINT_RULES = {
    // Treinos
    TRAINING_COMPLETE: 50,
    TRAINING_GPS: 10,
    TRAINING_STREAK_7: 100,
    TRAINING_STREAK_30: 500,

    // Reservas
    RESERVATION_COMPLETE: 20,
    RESERVATION_ON_TIME: 10,
    RESERVATION_FIRST: 50,

    // Voluntariado
    VOLUNTEER_TASK: 30,
    VOLUNTEER_HOUR: 15,
    VOLUNTEER_RATING_5: 50,

    // Social
    PROFILE_COMPLETE: 100,
    ANAMNESE_COMPLETE: 50,
    REFERRAL: 200,

    // Badges
    BADGE_UNLOCK: 25,

    // Penalidades
    RESERVATION_NO_SHOW: -50,
    RESERVATION_LATE: -25,
};

// Badges disponíveis
export const BADGES: Badge[] = [
    {
        id: 'first_workout',
        name: 'Primeiro Remo',
        description: 'Complete seu primeiro treino',
        icon: '🚣',
        rarity: 'common',
        points: 50,
    },
    {
        id: 'helping_hand',
        name: 'Mão Amiga',
        description: 'Complete sua primeira tarefa voluntária',
        icon: '🤝',
        rarity: 'common',
        points: 50,
    },
    {
        id: 'super_volunteer',
        name: 'Super Voluntário',
        description: 'Complete 10 tarefas voluntárias',
        icon: '🦸',
        rarity: 'rare',
        points: 200,
    },
    {
        id: 'one_year',
        name: 'Aniversário',
        description: 'Complete 1 ano como membro',
        icon: '🎂',
        rarity: 'uncommon',
        points: 100,
    },
    {
        id: 'diamond_member',
        name: 'Membro Diamante',
        description: 'Alcance o nível Diamante',
        icon: '💠',
        rarity: 'epic',
        points: 300,
    },
    {
        id: 'early_bird',
        name: 'Madrugador',
        description: 'Complete 10 treinos antes das 7h',
        icon: '🌅',
        rarity: 'uncommon',
        points: 75,
    },
    {
        id: 'night_owl',
        name: 'Coruja',
        description: 'Complete 10 treinos após as 18h',
        icon: '🦉',
        rarity: 'uncommon',
        points: 75,
    },
    {
        id: 'streak_master',
        name: 'Consistência',
        description: 'Mantenha 30 dias de treino consecutivos',
        icon: '🔥',
        rarity: 'epic',
        points: 500,
    },
    {
        id: 'club_legend',
        name: 'Lenda do Clube',
        description: 'Alcance o nível Lendário',
        icon: '👑',
        rarity: 'legendary',
        points: 1000,
    },
];

/**
 * Retorna o nível baseado nos pontos
 */
export function getLevelByPoints(points: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (points >= LEVELS[i].minPoints) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

/**
 * Calcula progresso para o próximo nível (0-100)
 */
export function getLevelProgress(points: number): number {
    const currentLevel = getLevelByPoints(points);
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);

    if (!nextLevel) return 100; // Já está no nível máximo

    const range = currentLevel.maxPoints - currentLevel.minPoints + 1;
    const progress = points - currentLevel.minPoints;

    return Math.min(100, Math.round((progress / range) * 100));
}

/**
 * Pontos necessários para o próximo nível
 */
export function getPointsToNextLevel(points: number): number {
    const currentLevel = getLevelByPoints(points);
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);

    if (!nextLevel) return 0;

    return nextLevel.minPoints - points;
}

/**
 * Retorna badge por ID
 */
export function getBadgeById(id: string): Badge | undefined {
    return BADGES.find(b => b.id === id);
}

/**
 * Cor da raridade do badge
 */
export function getBadgeRarityColor(rarity: Badge['rarity']): string {
    const colors = {
        common: '#9CA3AF',
        uncommon: '#22C55E',
        rare: '#3B82F6',
        epic: '#A855F7',
        legendary: '#F59E0B',
    };
    return colors[rarity];
}
