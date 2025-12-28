// Configurações para cálculos de condições de remo - Rio Potengi

import { CourseConfig } from '@/types/rowing-conditions';

/**
 * Configuração do percurso principal do Sport Club do Recife e Natal
 * Rio Potengi - Natal/RN
 */
export const POTENGI_COURSE: CourseConfig = {
    name: 'Rio Potengi - Percurso Principal',
    // Azimute aproximado do percurso (direção NW)
    azimuth: 315,
    coordinates: {
        // Coordenadas aproximadas do trecho de remo
        start: { lat: -5.7945, lng: -35.2108 },
        end: { lat: -5.7892, lng: -35.2156 }
    },
    // Velocidade média de um barco de remo (aproximadamente 2:00/500m)
    average_boat_speed_m_s: 4.5
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
    mirror: 2.5, // m/s (< 2.5 = espelho)
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
