// Configurações para cálculos de condições de remo - Rio Potengi

import { CourseConfig } from '@/types/rowing-conditions';

/**
 * Configuração do percurso principal do Sport Club de Natal
 * Rio Potengi - Natal/RN
 * 
 * FÍSICA DO RIO:
 * - Curso: SW → NE (em direção ao oceano Atlântico)
 * - Azimute: ~45° (Nordeste)
 * - Correnteza natural: Sempre para NE (para o mar)
 * - Maré vazante (ebb): Reforça a correnteza (para NE)
 * - Maré enchente (flood): Contraria a correnteza (para SW)
 * - Vento predominante: SE (~135°)
 */
export const POTENGI_COURSE: CourseConfig = {
    name: 'Rio Potengi - Percurso Principal',
    // Azimute do percurso (direção NE - para o mar)
    azimuth: 45,
    coordinates: {
        // Coordenadas do Sport Club de Natal
        start: { lat: -5.7753, lng: -35.2061 }, // ~5°46'31"S
        end: { lat: -5.7700, lng: -35.2000 }
    },
    // Velocidade média de um barco de remo (aproximadamente 2:00/500m)
    average_boat_speed_m_s: 4.5
};

/**
 * Configuração física do Rio Potengi
 */
export const POTENGI_PHYSICS = {
    // Velocidade da correnteza natural do rio (sempre para NE)
    naturalCurrentSpeed: 0.30, // m/s (~1.1 km/h)

    // Coeficiente de arrasto do vento sobre a água
    // ~1.5% da velocidade do vento se traduz em corrente superficial
    windDragCoefficient: 0.015,

    // Direção predominante do vento
    predominantWindDirection: 135, // SE

    // Faixas de velocidade de maré
    tideSpeedRanges: {
        weak: 0.3,      // m/s - maré fraca
        moderate: 0.7,  // m/s - maré moderada
        strong: 1.2,    // m/s - maré forte
        extreme: 1.5    // m/s - maré de sizígia
    }
};

/**
 * Coeficiente de impacto no pace
 * Este valor deve ser calibrado com dados reais do clube
 */
export const PACE_IMPACT_COEFFICIENT = 1.0;

/**
 * Thresholds para classificação de condições
 */
export const CONDITION_THRESHOLDS = {
    // Ângulo <= 30° = Favorável
    favorable: 30,
    // Ângulo > 110° = Ingrata
    difficult: 110
};

/**
 * Thresholds para condição da água
 */
export const WATER_CONDITION_THRESHOLDS = {
    // Velocidade do vento para classificação
    mirror: 2.5, // m/s (<2.5 = espelho)
    ripple: 7.0, // m/s (2.5-7.0 = ondulação)
    // > 7.0 = lago caótico

    // Ângulo lateral para chop
    lateral_angle_min: 60,
    lateral_angle_max: 120
};

/**
 * Conversões úteis
 */
export const CONVERSIONS = {
    // km/h para m/s
    kmh_to_ms: (kmh: number) => kmh / 3.6,
    // m/s para km/h
    ms_to_kmh: (ms: number) => ms * 3.6,
    // nós para m/s
    knots_to_ms: (knots: number) => knots * 0.514444,
    // m/s para nós
    ms_to_knots: (ms: number) => ms / 0.514444
};
