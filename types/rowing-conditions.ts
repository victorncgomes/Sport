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
}

// ═══════════════════════════════════════════════════════════
// NOVOS TIPOS - Sistema de Classificação por Horários Viáveis
// ═══════════════════════════════════════════════════════════

export type RowingClassification = 'EXCELENTE' | 'BOA' | 'MODERADA' | 'DIFÍCIL' | 'PERIGOSA';
export type CurrentType = 'flood' | 'ebb' | 'slack'; // enchente, vazante, estofa
export type TimePeriod = 'morning' | 'afternoon';

/**
 * Análise de um slot de horário específico
 */
export interface SlotAnalysis {
    startTime: string;
    endTime: string;
    period: TimePeriod;

    classification: RowingClassification;
    score: number; // 0-100 (menor = melhor)

    tideFactors: {
        departurePhase: string;
        departureTime: string;
        returnPhase: string;
        returnTime: string;

        departureCurrentSpeed: number;
        departureCurrentType: CurrentType;

        returnCurrentSpeed: number;
        returnCurrentType: CurrentType;

        currentBalance: number; // -1 (péssimo) a +1 (perfeito)
    };

    environmentFactors: {
        windSpeed: number;
        windDirection: number;
        waveHeight: number;
        sunIntensity: 'baixa' | 'moderada' | 'alta';
        temperature: number;
    };

    penalties: {
        currentPenalty: number;
        windPenalty: number;
        wavePenalty: number;
        timeOfDayScore: number;
    };

    recommendation: string;
}

/**
 * Resultado da identificação do melhor horário
 */
export interface BestTimeResult {
    slot: SlotAnalysis;
    reason: string;
    alternativeTimes: SlotAnalysis[];
}

/**
 * Saída completa da análise de condições
 */
export interface RowingConditionsOutput {
    date: string;
    morningSlots: SlotAnalysis[];
    afternoonSlots: SlotAnalysis[];
    bestTime: BestTimeResult;
    tideInfo: {
        nextHighTide: string;
        nextLowTide: string;
        amplitude: number;
        tideType: 'sizígia' | 'quadratura' | 'média';
    };
    quickSummary: {
        bestPeriod: TimePeriod;
        bestTimeRange: string;
        classification: RowingClassification;
        oneLineReason: string;
    };
}

/**
 * Entrada para análise de condições
 */
export interface RowingAnalysisInput {
    currentDate: Date;
    tideData: {
        nextHighTide: Date;
        nextLowTide: Date;
        amplitude: number;
    };
    weatherData: {
        windSpeed: number;
        windDirection: number;
        waveHeight: number;
        precipitation?: number;  // mm de chuva
        condition?: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'thunderstorm';
    };
}


