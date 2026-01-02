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
    POTENGI_PHYSICS,
    PACE_IMPACT_COEFFICIENT,
    CONDITION_THRESHOLDS,
    WATER_CONDITION_THRESHOLDS
} from '@/lib/config/rowing-config';

/**
 * Tipo de maré
 */
export type TideType = 'ebb' | 'flood' | 'slack';

/**
 * Resultado do cálculo de pace para ambas as direções
 */
export interface DualPaceImpact {
    towardsSea: PaceImpact;      // Remando para NE (mar)
    towardsUpstream: PaceImpact; // Remando para SW (nascente)
    netForce: number;            // Força resultante em m/s (+ = NE, - = SW)
    dominantForce: string;       // Descrição da força dominante
}

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
 * Calcula a força resultante no eixo do rio (SW-NE)
 * Positivo = força para NE (mar)
 * Negativo = força para SW (nascente)
 * 
 * NOTA: A velocidade da corrente (tideCurrentSpeed) já vem calculada pelo
 * rowing-conditions-analyzer.ts usando a tabela de referência da Marinha,
 * que já contempla a resultante de todas as forças (rio + maré).
 * 
 * @param tideCurrentSpeed Velocidade da corrente em m/s (já calculada pelo analyzer)
 * @param tideType Tipo da maré: 'ebb' (vazante), 'flood' (enchente), 'slack' (estofa)
 * @param windSpeed_m_s Velocidade do vento em m/s
 * @param windDirection Direção do vento em graus
 * @returns Força resultante em m/s
 */
export function calculateNetForce(
    tideCurrentSpeed: number,
    tideType: TideType,
    windSpeed_m_s: number,
    windDirection: number
): { netForce: number; components: { river: number; tide: number; wind: number } } {
    // A velocidade da corrente já é a resultante (dados da Marinha)
    // NÃO adicionar correnteza natural separada - já está embutida

    // Força da corrente (já é a resultante rio + maré)
    let F_tide: number;
    if (tideType === 'ebb') {
        // Vazante: corrente vai para o mar (NE) = positivo
        F_tide = +tideCurrentSpeed;
    } else if (tideType === 'flood') {
        // Enchente: corrente vai para dentro (SW) = negativo
        F_tide = -tideCurrentSpeed;
    } else {
        // Estofa: sem contribuição significativa
        F_tide = 0;
    }

    // Componente do vento no eixo SW-NE (45°)
    const RIVER_AZIMUTH = POTENGI_COURSE.azimuth; // 45°
    const windAngleRad = ((windDirection - RIVER_AZIMUTH) * Math.PI) / 180;
    const F_wind = windSpeed_m_s * Math.cos(windAngleRad) * POTENGI_PHYSICS.windDragCoefficient;

    // Força total (sem adicionar rio separado)
    const netForce = F_tide + F_wind;

    return {
        netForce,
        components: {
            river: 0, // Já embutido na corrente
            tide: F_tide,
            wind: F_wind
        }
    };
}

/**
 * Calcula o impacto no pace para AMBAS as direções de remo
 * Esta é a função principal que considera toda a física do Rio Potengi
 * 
 * @param tideCurrentSpeed Velocidade da corrente da maré em m/s
 * @param tideType Tipo da maré: 'ebb' (vazante), 'flood' (enchente), 'slack' (estofa)
 * @param windSpeed_m_s Velocidade do vento em m/s
 * @param windDirection Direção do vento em graus
 * @param boatSpeed Velocidade média do barco em m/s (padrão: 4.5 m/s = 2:00/500m)
 * @returns Impacto no pace para ambas as direções
 */
export function calculateDualPaceImpact(
    tideCurrentSpeed: number,
    tideType: TideType,
    windSpeed_m_s: number,
    windDirection: number,
    boatSpeed: number = POTENGI_COURSE.average_boat_speed_m_s
): DualPaceImpact {
    // Calcular força resultante
    const { netForce, components } = calculateNetForce(
        tideCurrentSpeed,
        tideType,
        windSpeed_m_s,
        windDirection
    );

    // Tempo base para 500m sem corrente
    const baseTime = 500 / boatSpeed; // ~111 segundos (1:51)

    // Remando para NE (mar):
    // Força positiva AJUDA (aumenta velocidade efetiva)
    // Força negativa ATRAPALHA (diminui velocidade efetiva)
    const effectiveSpeedNE = Math.max(boatSpeed + netForce, 0.5); // Mínimo 0.5 m/s para evitar divisão por zero
    const timeNE = 500 / effectiveSpeedNE;
    const deltaNE = timeNE - baseTime;

    // Remando para SW (nascente):
    // Força positiva ATRAPALHA (diminui velocidade efetiva)
    // Força negativa AJUDA (aumenta velocidade efetiva)
    const effectiveSpeedSW = Math.max(boatSpeed - netForce, 0.5);
    const timeSW = 500 / effectiveSpeedSW;
    const deltaSW = timeSW - baseTime;

    // Determinar força dominante baseado na corrente (que já inclui efeito do rio)
    let dominantForce: string;
    if (tideType === 'slack' || tideCurrentSpeed < 0.15) {
        dominantForce = 'Estofa - corrente mínima';
    } else if (tideType === 'ebb') {
        if (tideCurrentSpeed > 0.5) {
            dominantForce = 'Vazante forte';
        } else {
            dominantForce = 'Vazante moderada';
        }
    } else if (tideType === 'flood') {
        if (tideCurrentSpeed > 0.5) {
            dominantForce = 'Enchente forte';
        } else {
            dominantForce = 'Enchente moderada';
        }
    } else {
        dominantForce = 'Condição neutra';
    }

    return {
        towardsSea: {
            delta_s_per_500m: Math.round(deltaNE * 10) / 10,
            percentage: Math.round((deltaNE / baseTime) * 1000) / 10,
            description: deltaNE < -2 ? `Ganho de ${Math.abs(deltaNE).toFixed(1)}s/500m` :
                deltaNE > 2 ? `Perda de ${deltaNE.toFixed(1)}s/500m` :
                    'Impacto mínimo'
        },
        towardsUpstream: {
            delta_s_per_500m: Math.round(deltaSW * 10) / 10,
            percentage: Math.round((deltaSW / baseTime) * 1000) / 10,
            description: deltaSW < -2 ? `Ganho de ${Math.abs(deltaSW).toFixed(1)}s/500m` :
                deltaSW > 2 ? `Perda de ${deltaSW.toFixed(1)}s/500m` :
                    'Impacto mínimo'
        },
        netForce: Math.round(netForce * 100) / 100,
        dominantForce
    };
}

/**
 * Função legada para compatibilidade - usa calculateDualPaceImpact internamente
 * @deprecated Use calculateDualPaceImpact para resultados mais precisos
 */
export function calculatePaceImpact(
    current_speed_m_s: number,
    current_relative_angle: number,
    boat_speed_m_s: number = POTENGI_COURSE.average_boat_speed_m_s
): PaceImpact {
    // Converter ângulo relativo para tipo de maré (aproximação)
    // 0° = a favor (vazante), 180° = contra (enchente)
    const tideType: TideType = current_relative_angle < 90 ? 'ebb' : 'flood';

    // Calcular com a nova função (sem vento para compatibilidade)
    const dualImpact = calculateDualPaceImpact(
        current_speed_m_s,
        tideType,
        0, // sem vento
        0  // direção irrelevante
    );

    // Retornar o impacto para o Mar (NE) como padrão
    return dualImpact.towardsSea;
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

