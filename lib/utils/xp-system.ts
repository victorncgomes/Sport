// Sistema de XP e Níveis - Sport Club de Natal
// Fase 1: Fundação do Sistema de Treinos

/**
 * Fórmula de XP: XP necessário para nível N = 100 * N^1.5
 * Nível 1: 0 XP
 * Nível 2: 100 XP
 * Nível 3: 260 XP
 * Nível 5: 1.118 XP
 * Nível 10: 3.162 XP
 * Nível 50: 35.355 XP
 */

// Constantes de XP por ação
export const XP_ACTIONS = {
    // Treino
    COMPLETAR_ANAMNESE: 100,
    COMPLETAR_TREINO: 25,
    COMPLETAR_AQUECIMENTO: 5,
    COMPLETAR_ALONGAMENTO: 5,
    BATER_RECORDE_PESSOAL: 50,
    TREINO_EM_GRUPO: 15,

    // Garagem
    CHECKOUT_NO_PRAZO: 5,
    LAVAR_BARCO: 3,
    REPORTAR_PROBLEMA: 10,

    // Voluntariado
    COMPLETAR_TAREFA_VOLUNTARIO: 30,
    TAREFA_APROVADA: 20,

    // Gamificação
    STREAK_3_DIAS: 20,
    STREAK_7_DIAS: 50,
    STREAK_14_DIAS: 100,
    STREAK_30_DIAS: 250,
    STREAK_100_DIAS: 1000,

    // Competição
    PARTICIPAR_COMPETICAO: 50,
    PODIO: 100,
    PRIMEIRO_LUGAR: 200,

    // Social
    PRIMEIRO_TREINO: 50,
    DESBLOQUEAR_BARCO: 75,
} as const;

// Recompensas por nível
export const LEVEL_REWARDS: Record<number, string[]> = {
    5: ['Badge "Remador Dedicado"', 'Acesso a estatísticas detalhadas'],
    10: ['+1 slot de reserva simultânea', 'Badge "Persistente"'],
    15: ['Acesso a treinos premium', 'Badge "Experiente"'],
    20: ['Badge "Veterano"', 'Desconto 10% na loja'],
    25: ['Desconto 15% na loja', 'Prioridade em reservas'],
    30: ['Acesso ao clube VIP', 'Badge "Elite"'],
    40: ['Badge "Mestre do Remo"', 'Desconto 20% na loja'],
    50: ['Badge "Lenda do Clube" 👑', 'Acesso a área exclusiva'],
};

/**
 * Calcula o XP acumulado necessário para atingir um nível
 */
export function getXPForLevel(level: number): number {
    if (level <= 1) return 0;

    let totalXP = 0;
    for (let i = 2; i <= level; i++) {
        totalXP += Math.round(100 * Math.pow(i, 1.5));
    }
    return totalXP;
}

/**
 * Calcula o nível baseado no XP total
 */
export function calculateLevel(xp: number): number {
    if (xp <= 0) return 1;

    let level = 1;
    let accumulatedXP = 0;

    while (true) {
        const xpForNextLevel = Math.round(100 * Math.pow(level + 1, 1.5));
        if (accumulatedXP + xpForNextLevel > xp) break;
        accumulatedXP += xpForNextLevel;
        level++;
    }

    return level;
}

/**
 * Retorna o progresso (0-100) para o próximo nível
 */
export function getXPProgress(xp: number): number {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = getXPForLevel(currentLevel);
    const xpForNextLevel = getXPForLevel(currentLevel + 1);

    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;

    if (xpNeededForNext <= 0) return 100;

    return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
}

/**
 * Retorna XP restante para o próximo nível
 */
export function getXPToNextLevel(xp: number): number {
    const currentLevel = calculateLevel(xp);
    const xpForNextLevel = getXPForLevel(currentLevel + 1);
    return Math.max(0, xpForNextLevel - xp);
}

/**
 * Retorna as recompensas para um nível específico
 */
export function getLevelRewards(level: number): string[] {
    return LEVEL_REWARDS[level] || [];
}

/**
 * Verifica se houve level up e retorna info
 */
export function checkLevelUp(oldXP: number, newXP: number): {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    rewards: string[];
} {
    const oldLevel = calculateLevel(oldXP);
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > oldLevel;

    // Coletar todas as recompensas dos níveis ganhos
    const rewards: string[] = [];
    if (leveledUp) {
        for (let l = oldLevel + 1; l <= newLevel; l++) {
            rewards.push(...getLevelRewards(l));
        }
    }

    return {
        leveledUp,
        oldLevel,
        newLevel,
        rewards
    };
}

/**
 * Formata XP para exibição
 */
export function formatXP(xp: number): string {
    if (xp >= 1000000) {
        return `${(xp / 1000000).toFixed(1)}M`;
    }
    if (xp >= 1000) {
        return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
}

/**
 * Retorna a intensidade da animação baseada no XP ganho
 */
export function getXPAnimationIntensity(xpGained: number): 'small' | 'medium' | 'large' {
    if (xpGained >= 100) return 'large';
    if (xpGained >= 50) return 'medium';
    return 'small';
}

/**
 * Calcula todos os dados de gamificação de um usuário
 */
export function getGamificationData(xp: number) {
    const level = calculateLevel(xp);
    const progress = getXPProgress(xp);
    const xpToNext = getXPToNextLevel(xp);
    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);

    return {
        xp,
        level,
        progress,
        xpToNext,
        xpInLevel: xp - xpForCurrentLevel,
        xpNeededForLevel: xpForNextLevel - xpForCurrentLevel,
        formattedXP: formatXP(xp),
        rewards: getLevelRewards(level),
    };
}
