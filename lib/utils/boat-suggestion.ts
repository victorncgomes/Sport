/**
 * Sistema de Sugestão Inteligente de Barcos
 * 
 * Sugere o barco ideal baseado em:
 * - Nível de habilidade do atleta
 * - Histórico de treinos
 * - Disponibilidade atual
 * - Condições climáticas
 */

import { SkillLevel } from './xp-system';

// Tipos de barcos disponíveis
export type BoatCategory = '1x' | '2-' | '2x' | '4-' | '4x' | '8+';

export interface BoatSuggestion {
    resourceId: string;
    name: string;
    category: BoatCategory;
    score: number; // 0-100
    reason: string;
    warnings?: string[];
}

// Requisitos mínimos por categoria
const BOAT_REQUIREMENTS: Record<BoatCategory, {
    minLevel: number;
    minWorkouts: number;
    requiresTankExperience: boolean;
    crewSize: number;
}> = {
    '1x': { minLevel: 1, minWorkouts: 5, requiresTankExperience: true, crewSize: 1 },
    '2-': { minLevel: 3, minWorkouts: 15, requiresTankExperience: true, crewSize: 2 },
    '2x': { minLevel: 2, minWorkouts: 10, requiresTankExperience: true, crewSize: 2 },
    '4-': { minLevel: 5, minWorkouts: 30, requiresTankExperience: true, crewSize: 4 },
    '4x': { minLevel: 4, minWorkouts: 25, requiresTankExperience: true, crewSize: 4 },
    '8+': { minLevel: 7, minWorkouts: 50, requiresTankExperience: true, crewSize: 9 },
};

// Peso por condição
const SCORING_WEIGHTS = {
    skillMatch: 30,      // Nível de habilidade compatível
    availability: 25,    // Disponível agora
    recentUsage: 15,     // Usado recentemente pelo atleta
    condition: 20,       // Bom estado de conservação
    weatherMatch: 10     // Adequado para condições climáticas
};

interface UserProfile {
    id: string;
    level: number;
    totalOutdoorWorkouts: number;
    totalTankWorkouts: number;
    preferredBoatCategories?: BoatCategory[];
    lastBoatUsed?: string;
}

interface ResourceInfo {
    id: string;
    name: string;
    category: BoatCategory;
    status: 'AVAILABLE' | 'RESERVED' | 'IN_USE' | 'MAINTENANCE';
    usageCount: number;
    lastMaintenanceAt?: Date;
    nextMaintenanceAt?: Date;
}

interface WeatherConditions {
    windSpeed: number;   // km/h
    waveHeight: number;  // metros
    isRainy: boolean;
}

/**
 * Sugere barcos para um usuário baseado em seu perfil
 */
export function suggestBoats(
    user: UserProfile,
    availableResources: ResourceInfo[],
    weather?: WeatherConditions
): BoatSuggestion[] {
    const suggestions: BoatSuggestion[] = [];

    for (const resource of availableResources) {
        if (resource.status !== 'AVAILABLE') continue;

        const requirements = BOAT_REQUIREMENTS[resource.category];
        if (!requirements) continue;

        let score = 0;
        let reason = '';
        const warnings: string[] = [];

        // Verificar requisitos mínimos
        const meetsLevelRequirement = user.level >= requirements.minLevel;
        const meetsWorkoutRequirement = user.totalOutdoorWorkouts >= requirements.minWorkouts;
        const meetsTankRequirement = !requirements.requiresTankExperience ||
            user.totalTankWorkouts >= 3;

        if (!meetsLevelRequirement) {
            warnings.push(`Nível mínimo: ${requirements.minLevel} (seu: ${user.level})`);
        }
        if (!meetsWorkoutRequirement) {
            warnings.push(`Treinos mínimos: ${requirements.minWorkouts}`);
        }
        if (!meetsTankRequirement) {
            warnings.push('Requer experiência no tanque');
        }

        // Se não atende requisitos básicos, pular
        if (!meetsLevelRequirement || !meetsWorkoutRequirement) {
            continue;
        }

        // Pontuação: Compatibilidade de nível
        if (meetsLevelRequirement && meetsWorkoutRequirement && meetsTankRequirement) {
            score += SCORING_WEIGHTS.skillMatch;
            reason = 'Compatível com seu nível';
        }

        // Pontuação: Disponibilidade
        if (resource.status === 'AVAILABLE') {
            score += SCORING_WEIGHTS.availability;
        }

        // Pontuação: Uso recente (familiaridade)
        if (user.lastBoatUsed === resource.id) {
            score += SCORING_WEIGHTS.recentUsage;
            reason = 'Você usou recentemente';
        }

        // Pontuação: Preferência do usuário
        if (user.preferredBoatCategories?.includes(resource.category)) {
            score += 10;
            reason = 'Categoria preferida';
        }

        // Pontuação: Estado de conservação
        if (resource.usageCount < 100) {
            score += SCORING_WEIGHTS.condition;
        } else if (resource.usageCount < 200) {
            score += SCORING_WEIGHTS.condition * 0.7;
        } else {
            score += SCORING_WEIGHTS.condition * 0.4;
            warnings.push('Alto uso - verificar condições');
        }

        // Pontuação: Condições climáticas
        if (weather) {
            const isStableWeather = weather.windSpeed < 20 &&
                weather.waveHeight < 0.5 &&
                !weather.isRainy;

            if (isStableWeather) {
                score += SCORING_WEIGHTS.weatherMatch;
            } else {
                // Single é mais difícil com vento
                if (resource.category === '1x' && weather.windSpeed > 15) {
                    score -= 10;
                    warnings.push('Vento forte para single');
                }
            }
        }

        suggestions.push({
            resourceId: resource.id,
            name: resource.name,
            category: resource.category,
            score: Math.min(100, Math.max(0, score)),
            reason,
            warnings: warnings.length > 0 ? warnings : undefined
        });
    }

    // Ordenar por score (maior primeiro)
    return suggestions.sort((a, b) => b.score - a.score);
}

/**
 * Verifica se um usuário pode reservar determinado barco
 */
export function canUserReserveBoat(
    user: UserProfile,
    boatCategory: BoatCategory
): { allowed: boolean; reason?: string } {
    const requirements = BOAT_REQUIREMENTS[boatCategory];

    if (!requirements) {
        return { allowed: false, reason: 'Categoria de barco desconhecida' };
    }

    if (user.level < requirements.minLevel) {
        return {
            allowed: false,
            reason: `Nível ${requirements.minLevel} necessário (você está no ${user.level})`
        };
    }

    if (user.totalOutdoorWorkouts < requirements.minWorkouts) {
        return {
            allowed: false,
            reason: `${requirements.minWorkouts} treinos outdoor necessários`
        };
    }

    if (requirements.requiresTankExperience && user.totalTankWorkouts < 3) {
        return {
            allowed: false,
            reason: 'Complete 3 treinos no tanque primeiro'
        };
    }

    return { allowed: true };
}

/**
 * Gera slots de horário disponíveis com intervalos de 5 minutos
 */
export function generateTimeSlots(
    startHour: number = 5,
    endHour: number = 20,
    intervalMinutes: number = 5
): string[] {
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            slots.push(`${h}:${m}`);
        }
    }

    return slots;
}

/**
 * Filtra slots ocupados de uma lista de horários
 */
export function getAvailableSlots(
    allSlots: string[],
    occupiedSlots: string[],
    durationMinutes: number = 60
): string[] {
    const slotsNeeded = Math.ceil(durationMinutes / 5);
    const available: string[] = [];

    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
        const startSlot = allSlots[i];
        let isAvailable = true;

        for (let j = 0; j < slotsNeeded; j++) {
            if (occupiedSlots.includes(allSlots[i + j])) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            available.push(startSlot);
        }
    }

    return available;
}
