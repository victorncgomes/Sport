// Types for Rowing Conditions - Rio Potengi (Natal-RN)

export type ConditionRating = 'favorable' | 'technical' | 'difficult';
export type WaterSurface = 'mirror' | 'ripple' | 'chaotic';

/**
 * Dados de correnteza
 */
export interface CurrentData {
    speed_m_s: number; // velocidade em m/s
    direction_deg: number; // direção em graus (0-360)
    relative_angle_deg: number; // ângulo relativo ao percurso
}

/**
 * Dados de vento com direção relativa
 */
export interface WindData {
    speed_m_s: number;
    direction_deg: number;
    relative_angle_deg: number;
    gusts_m_s?: number;
}

/**
 * Classificação de condição baseada em ângulo
 */
export interface ConditionClassification {
    rating: ConditionRating;
    color: 'green' | 'yellow' | 'red';
    label: string;
    description: string;
}

/**
 * Condição da superfície da água
 */
export interface WaterCondition {
    surface: WaterSurface;
    side_chop_index: number; // 0-100
    description: string;
}

/**
 * Impacto estimado no pace
 */
export interface PaceImpact {
    delta_s_per_500m: number; // segundos por 500m (pode ser negativo se favorável)
    percentage: number; // impacto percentual
    description: string;
}

/**
 * Dados completos de condições de remo
 */
export interface RowingConditionsData {
    current: CurrentData;
    wind: WindData;
    condition_rating: ConditionRating;
    condition_classification: ConditionClassification;
    water_condition: WaterCondition;
    pace_impact: PaceImpact;
    timestamp: Date;
}

/**
 * Configuração do percurso de remo
 */
export interface CourseConfig {
    name: string;
    azimuth: number; // direção do percurso em graus
    coordinates: {
        start: { lat: number; lng: number };
        end: { lat: number; lng: number };
    };
    average_boat_speed_m_s: number;
}

/**
 * Dados históricos para calibração
 */
export interface CalibrationData {
    date: Date;
    actual_pace_s_500m: number;
    predicted_pace_s_500m: number;
    current_speed_m_s: number;
    wind_speed_m_s: number;
    notes?: string;
}
