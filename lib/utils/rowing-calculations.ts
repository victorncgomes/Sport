// Funções de cálculo para condições de remo

import {
    ConditionRating,
    ConditionClassification,
    WaterSurface,
    WaterCondition,
    PaceImpact
} from '@/types/rowing-conditions';
import {
    POTENGI_COURSE,
    PACE_IMPACT_COEFFICIENT,
    CONDITION_THRESHOLDS,
    WATER_CONDITION_THRESHOLDS
} from '@/lib/config/rowing-config';

/**
 * Normaliza um ângulo para o intervalo 0-360
 */
function normalizeAngle(angle: number): number {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

/**
 * Calcula o ângulo relativo entre uma direção (vento/corrente) e o percurso
 * @param direction_deg Direção do vento/corrente em graus (0-360)
 * @param course_azimuth Azimute do percurso em graus (padrão: percurso do Potengi)
 * @returns Ângulo relativo em graus (0-180)
 */
export function calculateRelativeAngle(
    direction_deg: number,
    course_azimuth: number = POTENGI_COURSE.azimuth
): number {
    const dir = normalizeAngle(direction_deg);
    const course = normalizeAngle(course_azimuth);

    let diff = Math.abs(dir - course);

    // Garantir que o ângulo seja o menor (0-180)
    if (diff > 180) {
        diff = 360 - diff;
    }

    return diff;
}

/**
 * Classifica a condição baseada no ângulo relativo
 * @param relative_angle Ângulo relativo em graus
 * @returns Classificação da condição
 */
export function classifyCondition(relative_angle: number): ConditionClassification {
    if (relative_angle <= CONDITION_THRESHOLDS.favorable) {
        return {
            rating: 'favorable',
            color: 'green',
            label: 'Favorável',
            description: 'Condições ideais para remo - vento/corrente a favor'
        };
    } else if (relative_angle <= CONDITION_THRESHOLDS.difficult) {
        return {
            rating: 'technical',
            color: 'yellow',
            label: 'Técnica',
            description: 'Condições desafiadoras - requer técnica apurada'
        };
    } else {
        return {
            rating: 'difficult',
            color: 'red',
            label: 'Ingrata',
            description: 'Condições adversas - vento/corrente contrários'
        };
    }
}

/**
 * Determina a condição da superfície da água
 * @param wind_speed_m_s Velocidade do vento em m/s
 * @param wind_relative_angle Ângulo relativo do vento
 * @returns Condição da superfície
 */
export function calculateWaterSurface(
    wind_speed_m_s: number,
    wind_relative_angle: number
): WaterCondition {
    let surface: WaterSurface;
    let description: string;

    if (wind_speed_m_s < WATER_CONDITION_THRESHOLDS.mirror) {
        surface = 'mirror';
        description = 'Água espelhada - condições perfeitas';
    } else if (wind_speed_m_s < WATER_CONDITION_THRESHOLDS.ripple) {
        surface = 'ripple';
        description = 'Ondulação leve a moderada';
    } else {
        surface = 'chaotic';
        description = 'Lago caótico - ondas significativas';
    }

    // Calcular índice de chop lateral
    const side_chop_index = calculateSideChopIndex(wind_speed_m_s, wind_relative_angle);

    return {
        surface,
        side_chop_index,
        description
    };
}

/**
 * Calcula o índice de chop lateral (0-100)
 * Chop lateral é mais intenso quando o vento está perpendicular ao percurso
 * @param wind_speed_m_s Velocidade do vento em m/s
 * @param wind_relative_angle Ângulo relativo do vento
 * @returns Índice de 0 a 100
 */
export function calculateSideChopIndex(
    wind_speed_m_s: number,
    wind_relative_angle: number
): number {
    // Chop lateral máximo ocorre em ~90° (perpendicular)
    // Usar função senoidal para modelar isso
    const lateral_factor = Math.sin((wind_relative_angle * Math.PI) / 180);

    // Normalizar velocidade do vento (assumindo max ~15 m/s para escala)
    const wind_factor = Math.min(wind_speed_m_s / 15, 1);

    // Combinar fatores
    const index = lateral_factor * wind_factor * 100;

    return Math.round(Math.max(0, Math.min(100, index)));
}

/**
 * Calcula o impacto estimado no pace
 * @param current_speed_m_s Velocidade da corrente em m/s
 * @param current_relative_angle Ângulo relativo da corrente
 * @param boat_speed_m_s Velocidade do barco (padrão: velocidade média do Potengi)
 * @returns Impacto no pace
 */
export function calculatePaceImpact(
    current_speed_m_s: number,
    current_relative_angle: number,
    boat_speed_m_s: number = POTENGI_COURSE.average_boat_speed_m_s
): PaceImpact {
    // Componente da corrente na direção do percurso
    // Positivo = a favor, Negativo = contra
    const angle_rad = (current_relative_angle * Math.PI) / 180;
    const current_component = current_speed_m_s * Math.cos(angle_rad);

    // Fórmula: pace_delta = (current_component / boat_speed) × K × 500m_time
    // Onde 500m_time é o tempo base para percorrer 500m
    const base_time_500m = 500 / boat_speed_m_s; // segundos

    // Impacto relativo
    const relative_impact = (current_component / boat_speed_m_s) * PACE_IMPACT_COEFFICIENT;

    // Delta em segundos por 500m (negativo = mais rápido, positivo = mais lento)
    const delta_s_per_500m = -relative_impact * base_time_500m;

    // Percentual de impacto
    const percentage = (relative_impact * 100);

    // Descrição
    let description: string;
    if (Math.abs(delta_s_per_500m) < 2) {
        description = 'Impacto mínimo no pace';
    } else if (delta_s_per_500m < 0) {
        description = `Ganho de ${Math.abs(delta_s_per_500m).toFixed(1)}s/500m`;
    } else {
        description = `Perda de ${delta_s_per_500m.toFixed(1)}s/500m`;
    }

    return {
        delta_s_per_500m: Math.round(delta_s_per_500m * 10) / 10,
        percentage: Math.round(percentage * 10) / 10,
        description
    };
}

/**
 * Converte direção em graus para texto (N, NE, E, SE, S, SW, W, NW)
 */
export function degreesToCardinal(degrees: number): string {
    const normalized = normalizeAngle(degrees);
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(normalized / 45) % 8;
    return directions[index];
}

/**
 * Converte m/s para km/h
 */
export function msToKmh(ms: number): number {
    return Math.round(ms * 3.6 * 10) / 10;
}
