// Progressão de Barcos - Sport Club de Natal
// Fase 1: Fundação do Sistema de Treinos

export type BoatLevel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO' | 'ELITE';

export interface BoatType {
    id: string;
    name: string;
    displayName: string;
    level: BoatLevel;
    crew: number;
    description: string;
    imageUrl?: string;
    criteria: BoatCriteria;
    order: number;
}

export interface BoatCriteria {
    minHours?: number;           // Horas mínimas de treino acumuladas
    minPace?: string;            // Pace mínimo (ex: "2:30" = 2:30/500m)
    requiredBoats?: string[];    // Barcos que precisam estar desbloqueados
    minTankWorkouts?: number;    // Treinos mínimos no tanque
    requiresCoachApproval?: boolean;
    minCompetitions?: number;    // Participações em competições
    minPodiums?: number;         // Pódios em competições
}

// Hierarquia de barcos do Sport Club de Natal
export const BOAT_HIERARCHY: BoatType[] = [
    {
        id: 'TANQUE',
        name: 'Tanque',
        displayName: 'Tanque Indoor',
        level: 'INICIANTE',
        crew: 1,
        description: 'Treinamento indoor para aprender a técnica básica de remada.',
        order: 1,
        criteria: {
            // Desbloqueado automaticamente após anamnese
        }
    },
    {
        id: 'CANOE',
        name: 'Canoe',
        displayName: 'Canoa',
        level: 'INICIANTE',
        crew: 1,
        description: 'Embarcação estável para primeiros treinos na água.',
        order: 2,
        criteria: {
            minTankWorkouts: 5,
            minHours: 5,
        }
    },
    {
        id: 'DOUBLE_CANOE',
        name: 'Double Canoe',
        displayName: 'Canoa Dupla',
        level: 'INICIANTE',
        crew: 2,
        description: 'Canoa para dois remadores. Ideal para treinos em dupla.',
        order: 3,
        criteria: {
            minHours: 10,
            requiredBoats: ['CANOE'],
        }
    },
    {
        id: 'OITO',
        name: 'Oito',
        displayName: 'Oito com Timoneiro',
        level: 'INTERMEDIARIO',
        crew: 8,
        description: 'Embarcação de 8 remadores + timoneiro. Experiência em grupo.',
        order: 4,
        criteria: {
            minHours: 20,
            requiredBoats: ['DOUBLE_CANOE'],
            requiresCoachApproval: true,
        }
    },
    {
        id: 'FOUR_SKIFF',
        name: 'Four Skiff',
        displayName: 'Quatro Skiff',
        level: 'INTERMEDIARIO',
        crew: 4,
        description: 'Embarcação de 4 remadores. Requer sincronização.',
        order: 5,
        criteria: {
            minHours: 30,
            minPace: '2:30',
            requiredBoats: ['OITO'],
        }
    },
    {
        id: 'QUATRO_SEM',
        name: 'Quatro Sem',
        displayName: 'Quatro sem Timoneiro',
        level: 'AVANCADO',
        crew: 4,
        description: 'Quatro remadores sem timoneiro. Alto nível técnico.',
        order: 6,
        criteria: {
            minHours: 50,
            minPace: '2:15',
            requiredBoats: ['FOUR_SKIFF'],
            requiresCoachApproval: true,
        }
    },
    {
        id: 'DOUBLE_SKIFF',
        name: 'Double Skiff',
        displayName: 'Double Skiff',
        level: 'AVANCADO',
        crew: 2,
        description: 'Skiff para dois remadores experientes.',
        order: 7,
        criteria: {
            minHours: 70,
            minPace: '2:10',
            requiredBoats: ['QUATRO_SEM'],
        }
    },
    {
        id: 'SINGLE_SKIFF',
        name: 'Single Skiff',
        displayName: 'Single Skiff',
        level: 'ELITE',
        crew: 1,
        description: 'A embarcação mais desafiadora. Para atletas de elite.',
        order: 8,
        criteria: {
            minHours: 100,
            minPace: '2:00',
            requiredBoats: ['DOUBLE_SKIFF'],
            minCompetitions: 1,
        }
    },
    {
        id: 'DOIS_SEM',
        name: 'Dois Sem',
        displayName: 'Dois sem Timoneiro',
        level: 'ELITE',
        crew: 2,
        description: 'O ápice da sincronia. Requer pódio em competição.',
        order: 9,
        criteria: {
            minHours: 120,
            minPace: '1:55',
            requiredBoats: ['SINGLE_SKIFF'],
            minPodiums: 1,
        }
    },
];

/**
 * Converte pace string (MM:SS) para segundos
 */
export function paceToSeconds(pace: string): number {
    const [minutes, seconds] = pace.split(':').map(Number);
    return minutes * 60 + seconds;
}

/**
 * Verifica se o pace do usuário atende ao critério
 */
export function meetsPaceCriteria(userPace: string | null, requiredPace: string): boolean {
    if (!userPace) return false;
    return paceToSeconds(userPace) <= paceToSeconds(requiredPace);
}

/**
 * Verifica se o usuário pode desbloquear um barco
 */
export function checkBoatUnlockCriteria(
    boatId: string,
    userStats: {
        totalHours: number;
        tankWorkouts: number;
        bestPace: string | null;
        competitions: number;
        podiums: number;
        coachApproved: boolean;
        unlockedBoats: string[];
    }
): { canUnlock: boolean; missingCriteria: string[] } {
    const boat = BOAT_HIERARCHY.find(b => b.id === boatId);
    if (!boat) return { canUnlock: false, missingCriteria: ['Barco não encontrado'] };

    const criteria = boat.criteria;
    const missing: string[] = [];

    // Verificar horas mínimas
    if (criteria.minHours && userStats.totalHours < criteria.minHours) {
        missing.push(`${criteria.minHours - userStats.totalHours}h restantes de treino`);
    }

    // Verificar treinos no tanque
    if (criteria.minTankWorkouts && userStats.tankWorkouts < criteria.minTankWorkouts) {
        missing.push(`${criteria.minTankWorkouts - userStats.tankWorkouts} treinos no tanque`);
    }

    // Verificar pace
    if (criteria.minPace && !meetsPaceCriteria(userStats.bestPace, criteria.minPace)) {
        missing.push(`Pace mínimo de ${criteria.minPace}/500m`);
    }

    // Verificar barcos anteriores
    if (criteria.requiredBoats) {
        const missingBoats = criteria.requiredBoats.filter(
            b => !userStats.unlockedBoats.includes(b)
        );
        if (missingBoats.length > 0) {
            const boatNames = missingBoats.map(id =>
                BOAT_HIERARCHY.find(b => b.id === id)?.displayName || id
            );
            missing.push(`Desbloquear: ${boatNames.join(', ')}`);
        }
    }

    // Verificar aprovação do coach
    if (criteria.requiresCoachApproval && !userStats.coachApproved) {
        missing.push('Requer aprovação do treinador');
    }

    // Verificar competições
    if (criteria.minCompetitions && userStats.competitions < criteria.minCompetitions) {
        missing.push(`${criteria.minCompetitions - userStats.competitions} competições necessárias`);
    }

    // Verificar pódios
    if (criteria.minPodiums && userStats.podiums < criteria.minPodiums) {
        missing.push(`${criteria.minPodiums - userStats.podiums} pódios necessários`);
    }

    return {
        canUnlock: missing.length === 0,
        missingCriteria: missing
    };
}

/**
 * Retorna o progresso percentual para desbloquear um barco
 */
export function getBoatUnlockProgress(
    boatId: string,
    userStats: {
        totalHours: number;
        tankWorkouts: number;
        bestPace: string | null;
        competitions: number;
        podiums: number;
        coachApproved: boolean;
        unlockedBoats: string[];
    }
): number {
    const boat = BOAT_HIERARCHY.find(b => b.id === boatId);
    if (!boat) return 0;

    const criteria = boat.criteria;
    let totalCriteria = 0;
    let metCriteria = 0;

    if (criteria.minHours) {
        totalCriteria++;
        if (userStats.totalHours >= criteria.minHours) metCriteria++;
    }

    if (criteria.minTankWorkouts) {
        totalCriteria++;
        if (userStats.tankWorkouts >= criteria.minTankWorkouts) metCriteria++;
    }

    if (criteria.minPace) {
        totalCriteria++;
        if (meetsPaceCriteria(userStats.bestPace, criteria.minPace)) metCriteria++;
    }

    if (criteria.requiredBoats && criteria.requiredBoats.length > 0) {
        totalCriteria++;
        const allUnlocked = criteria.requiredBoats.every(b => userStats.unlockedBoats.includes(b));
        if (allUnlocked) metCriteria++;
    }

    if (criteria.requiresCoachApproval) {
        totalCriteria++;
        if (userStats.coachApproved) metCriteria++;
    }

    if (criteria.minCompetitions) {
        totalCriteria++;
        if (userStats.competitions >= criteria.minCompetitions) metCriteria++;
    }

    if (criteria.minPodiums) {
        totalCriteria++;
        if (userStats.podiums >= criteria.minPodiums) metCriteria++;
    }

    if (totalCriteria === 0) return 100; // Sem critérios = desbloqueado

    return Math.round((metCriteria / totalCriteria) * 100);
}

/**
 * Retorna todos os barcos com status de desbloqueio
 */
export function getBoatsWithStatus(unlockedBoatIds: string[]): Array<BoatType & { isUnlocked: boolean }> {
    return BOAT_HIERARCHY.map(boat => ({
        ...boat,
        isUnlocked: unlockedBoatIds.includes(boat.id) || boat.id === 'TANQUE'
    }));
}

/**
 * Retorna o próximo barco a desbloquear
 */
export function getNextBoatToUnlock(unlockedBoatIds: string[]): BoatType | null {
    const lockedBoats = BOAT_HIERARCHY.filter(
        boat => !unlockedBoatIds.includes(boat.id) && boat.id !== 'TANQUE'
    ).sort((a, b) => a.order - b.order);

    return lockedBoats[0] || null;
}

/**
 * Cores por nível de barco
 */
export const BOAT_LEVEL_COLORS: Record<BoatLevel, { bg: string; text: string; border: string }> = {
    INICIANTE: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
    INTERMEDIARIO: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
    AVANCADO: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
    ELITE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
};
