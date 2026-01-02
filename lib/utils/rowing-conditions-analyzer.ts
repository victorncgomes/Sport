// Analisador de Condições para Remo - Rio Potengi
// Sistema de classificação por horários viáveis do Sport Club de Natal

import {
    RowingClassification,
    CurrentType,
    TimePeriod,
    SlotAnalysis,
    BestTimeResult,
    RowingConditionsOutput,
    RowingAnalysisInput
} from '@/types/rowing-conditions';

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

const VALID_MORNING_SLOTS = [
    "05:00", "05:30", "06:00", "06:30", "07:00",
    "07:30", "08:00", "08:30", "09:00"
];

const VALID_AFTERNOON_SLOTS = [
    "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
];

// Dados oficiais da Marinha - Velocidades de corrente relativas à preamar
// Valores para sizígia média (amplitude ~227cm)
interface CurrentSpeedData {
    speed: number; // velocidade média em nós
    type: CurrentType;
}

const CURRENT_SPEEDS_REFERENCE: Record<string, CurrentSpeedData> = {
    '-6': { speed: 0.3, type: 'flood' },  // 6h antes da preamar
    '-5': { speed: 0.9, type: 'flood' },  // 5h antes
    '-4': { speed: 1.1, type: 'flood' },  // 4h antes
    '-3': { speed: 1.4, type: 'flood' },  // 3h antes
    '-2': { speed: 1.35, type: 'flood' }, // 2h antes
    '-1': { speed: 0.8, type: 'flood' },  // 1h antes
    '0': { speed: 0.25, type: 'slack' },  // Preamar (estofa)
    '1': { speed: 1.0, type: 'ebb' },     // 1h após
    '2': { speed: 1.65, type: 'ebb' },    // 2h após
    '3': { speed: 1.65, type: 'ebb' },    // 3h após
    '4': { speed: 1.05, type: 'ebb' },    // 4h após
    '5': { speed: 0.25, type: 'ebb' },    // 5h após
    '6': { speed: 0.3, type: 'ebb' }      // 6h após
};

// Conversão nós para m/s
const KNOTS_TO_MS = 0.514444;

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

/**
 * Adiciona minutos a um horário no formato HH:mm
 */
function addMinutes(time: string, minutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

/**
 * Calcula diferença em horas entre dois horários
 */
function calculateHoursDifference(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    return (minutes1 - minutes2) / 60;
}

/**
 * Calcula horas desde a preamar para um horário específico
 */
function calculateHoursFromHighTide(time: string, highTideDate: Date): number {
    const highTideTime = `${highTideDate.getHours().toString().padStart(2, '0')}:${highTideDate.getMinutes().toString().padStart(2, '0')}`;
    return calculateHoursDifference(time, highTideTime);
}

/**
 * Aplica correção de amplitude nas velocidades de corrente
 */
function applyAmplitudeCorrection(baseSpeed: number, amplitude: number): number {
    const factor = amplitude / 227; // 227cm = sizígia média
    return baseSpeed * factor;
}

/**
 * Obtém velocidade da corrente baseada no ciclo de maré completo
 * 
 * A corrente segue um padrão senoidal entre DUAS estofas:
 * - ESTOFA (slack) = velocidade ZERO (na preamar e na baixamar)
 * - MÁXIMA velocidade = no meio caminho entre preamar e baixamar (~3h de cada)
 * 
 * @param hoursFromNearestSlack Horas desde a estofa mais próxima (0 a 3)
 * @param amplitude Amplitude da maré em cm
 * @param isFloodPhase Se verdadeiro, estamos em fase de enchente
 */
function getCurrentSpeed(
    hoursFromNearestSlack: number,
    amplitude: number,
    isFloodPhase: boolean
): { speed: number; type: CurrentType } {
    // Ciclo de maré completo é ~12.4h, meio ciclo é ~6.2h
    // A velocidade máxima ocorre a ~3h da estofa
    // Velocidade base em m/s (para sizígia média ≈ 0.85 m/s máximo)
    const baseMaxSpeed = 0.85; // m/s

    // Fator de amplitude (227cm = sizígia média)
    const amplitudeFactor = amplitude / 227;

    // hoursFromNearestSlack deve ser 0 a 3:
    // 0 = na estofa (velocidade = 0)
    // 3 = no meio do ciclo (velocidade = máxima)
    const clampedHours = Math.min(Math.abs(hoursFromNearestSlack), 3);

    // Usar senóide: sin(0) = 0, sin(π/2) = 1
    // Quando clampedHours = 0 → phase = 0 → velocidade = 0
    // Quando clampedHours = 3 → phase = π/2 → velocidade = máxima
    const phase = (clampedHours / 3) * (Math.PI / 2);
    const speedFactor = Math.sin(phase);

    const speed = baseMaxSpeed * amplitudeFactor * speedFactor;

    // Determinar tipo de corrente
    let type: CurrentType;
    if (clampedHours < 0.3) {
        type = 'slack'; // Estofa (muito perto da referência)
    } else if (isFloodPhase) {
        type = 'flood'; // Enchendo
    } else {
        type = 'ebb'; // Vazando
    }

    return { speed, type };
}

/**
 * Calcula balance de correntes (favorabilidade ida/volta)
 */
function calculateCurrentBalance(
    departure: { speed: number; type: CurrentType },
    returnData: { speed: number; type: CurrentType }
): number {
    // Favorabilidade IDA (corrente contra = bom para treino)
    let idaFavor = 0;
    if (departure.type === 'flood') {
        // Enchente na ida = BOM (resistência)
        if (departure.speed < 0.25) idaFavor = 1.0;
        else if (departure.speed < 0.5) idaFavor = 0.8;
        else if (departure.speed < 0.75) idaFavor = 0.5;
        else idaFavor = 0.2;
    } else if (departure.type === 'ebb') {
        // Vazante na ida = RUIM (vai embora fácil)
        if (departure.speed < 0.25) idaFavor = -0.2;
        else if (departure.speed < 0.5) idaFavor = -0.5;
        else if (departure.speed < 0.75) idaFavor = -0.8;
        else idaFavor = -1.0;
    } else {
        idaFavor = 0.5; // Estofa = neutro
    }

    // Favorabilidade VOLTA (corrente a favor = bom)
    let voltaFavor = 0;
    if (returnData.type === 'ebb') {
        // Vazante na volta = BOM (empurra de volta)
        if (returnData.speed < 0.25) voltaFavor = 0.3;
        else if (returnData.speed < 0.5) voltaFavor = 0.7;
        else if (returnData.speed < 0.75) voltaFavor = 0.9;
        else voltaFavor = 1.0;
    } else if (returnData.type === 'flood') {
        // Enchente na volta = RUIM (contra)
        if (returnData.speed < 0.25) voltaFavor = -0.3;
        else if (returnData.speed < 0.5) voltaFavor = -0.6;
        else if (returnData.speed < 0.75) voltaFavor = -0.9;
        else voltaFavor = -1.0;
    } else {
        voltaFavor = 0.2; // Estofa = neutro baixo
    }

    // Média ponderada (volta pesa mais)
    return idaFavor * 0.4 + voltaFavor * 0.6;
}

/**
 * Ajusta velocidade do vento por horário
 */
function adjustWindByTime(baseSpeed: number, endTime: string): number {
    const [hours, minutes] = endTime.split(':').map(Number);
    const hour = hours + minutes / 60;

    // Manhã: vento mais calmo
    if (hour <= 7) return baseSpeed * 0.6;
    if (hour <= 8) return baseSpeed * 0.75;
    if (hour <= 9) return baseSpeed * 0.9;
    if (hour <= 10) return baseSpeed * 1.0;

    // Tarde: vento mais forte
    if (hour <= 16) return baseSpeed * 1.3;
    if (hour <= 17.5) return baseSpeed * 1.2;
    if (hour <= 18.5) return baseSpeed * 1.1;

    return baseSpeed;
}

/**
 * Calcula penalidade de vento
 */
function calculateWindPenalty(adjustedWind: number): number {
    if (adjustedWind < 10) return 0;
    if (adjustedWind < 15) return 8;
    if (adjustedWind < 20) return 17;
    if (adjustedWind < 25) return 25;
    return 30;
}

/**
 * Calcula penalidade de ondas
 */
function calculateWavePenalty(waveHeight: number): number {
    if (waveHeight < 0.3) return 0;
    if (waveHeight < 0.5) return 5;
    if (waveHeight < 0.8) return 10;
    return 15;
}

/**
 * Calcula penalidade climática (chuva/tempestade)
 */
function calculateWeatherPenalty(
    precipitation?: number,
    condition?: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'thunderstorm'
): number {
    // Penalidade por precipitação
    let rainPenalty = 0;
    if (precipitation) {
        if (precipitation < 2) rainPenalty = 5;      // Chuva leve
        else if (precipitation < 5) rainPenalty = 15; // Chuva moderada
        else if (precipitation < 10) rainPenalty = 25; // Chuva forte
        else rainPenalty = 35;                        // Chuva muito forte
    }

    // Penalidade por condição climática
    let conditionPenalty = 0;
    if (condition) {
        switch (condition) {
            case 'clear':
            case 'partly-cloudy':
                conditionPenalty = 0;
                break;
            case 'cloudy':
                conditionPenalty = 3;
                break;
            case 'rain':
                conditionPenalty = 15;
                break;
            case 'heavy-rain':
                conditionPenalty = 30;
                break;
            case 'thunderstorm':
                conditionPenalty = 50; // PERIGOSO!
                break;
        }
    }

    return Math.max(rainPenalty, conditionPenalty);
}

/**
 * Converte score para classificação
 */
function scoreToClassification(score: number): RowingClassification {
    if (score <= 15) return 'EXCELENTE';
    if (score <= 30) return 'BOA';
    if (score <= 50) return 'MODERADA';
    if (score <= 70) return 'DIFÍCIL';
    return 'PERIGOSA';
}

/**
 * Formata fase da maré
 */
function formatPhase(hoursFromHT: number): string {
    const absHours = Math.abs(hoursFromHT);
    const hours = Math.floor(absHours);
    const minutes = Math.round((absHours - hours) * 60);

    if (hoursFromHT < 0) {
        return `${hours}h${minutes.toString().padStart(2, '0')}min antes PM`;
    } else if (hoursFromHT > 0) {
        return `${hours}h${minutes.toString().padStart(2, '0')}min após PM`;
    } else {
        return 'Preamar';
    }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES PRINCIPAIS
// ═══════════════════════════════════════════════════════════

/**
 * Analisa um slot de horário específico
 * EXPORTADA para uso externo (seletor de horário dinâmico)
 */
export function analyzeSlot(
    startTime: string,
    period: TimePeriod,
    input: RowingAnalysisInput
): SlotAnalysis {
    const endTime = addMinutes(startTime, 60);
    const midTime = addMinutes(startTime, 30);

    // Converter horários para minutos para facilitar comparação
    const [startH, startM] = startTime.split(':').map(Number);
    const slotMinutes = startH * 60 + startM;

    const htMinutes = input.tideData.nextHighTide.getHours() * 60 + input.tideData.nextHighTide.getMinutes();
    const ltMinutes = input.tideData.nextLowTide.getHours() * 60 + input.tideData.nextLowTide.getMinutes();

    // Determinar em qual fase do ciclo de maré estamos
    // Se estamos ANTES da preamar e DEPOIS da baixamar anterior → ENCHENDO (flood)
    // Se estamos DEPOIS da preamar e ANTES da baixamar seguinte → VAZANDO (ebb)
    let isFloodPhase: boolean;
    let hoursFromNearestSlack: number;

    // Calcular distância até preamar e baixamar
    const hoursToHT = (htMinutes - slotMinutes) / 60;
    const hoursToLT = (ltMinutes - slotMinutes) / 60;

    // Determinar a estofa mais próxima e a fase
    // A distância da estofa mais próxima determina a velocidade (0 na estofa, máxima a 3h)
    const absHoursToHT = Math.abs(hoursToHT);
    const absHoursToLT = Math.abs(hoursToLT);

    if (ltMinutes < htMinutes) {
        // Sequência do dia: LT ... HT (baixamar primeiro, depois preamar)
        if (slotMinutes < ltMinutes) {
            // Antes da baixamar → vazando, se aproximando da estofa da baixamar
            isFloodPhase = false;
            hoursFromNearestSlack = absHoursToLT; // Distância até a baixamar
        } else if (slotMinutes < htMinutes) {
            // Entre baixamar e preamar → enchendo
            isFloodPhase = true;
            // Usar a menor distância (da LT que passou ou da HT que vem)
            hoursFromNearestSlack = Math.min(absHoursToLT, absHoursToHT);
        } else {
            // Depois da preamar → vazando, se afastando da estofa da preamar
            isFloodPhase = false;
            hoursFromNearestSlack = absHoursToHT;
        }
    } else {
        // Sequência do dia: HT ... LT (preamar primeiro, depois baixamar)
        if (slotMinutes < htMinutes) {
            // Antes da preamar → enchendo, se aproximando da estofa da preamar
            isFloodPhase = true;
            hoursFromNearestSlack = absHoursToHT;
        } else if (slotMinutes < ltMinutes) {
            // Entre preamar e baixamar → vazando
            isFloodPhase = false;
            // Usar a menor distância
            hoursFromNearestSlack = Math.min(absHoursToHT, absHoursToLT);
        } else {
            // Depois de ambas → enchendo para próxima preamar
            isFloodPhase = true;
            hoursFromNearestSlack = absHoursToLT;
        }
    }

    // Obter velocidades das correntes com a fase correta
    const departureCurrentData = getCurrentSpeed(hoursFromNearestSlack, input.tideData.amplitude, isFloodPhase);

    // Para o retorno (30 min depois), ajustar distância
    const midHoursFromSlack = Math.max(0, hoursFromNearestSlack - 0.5);
    const returnCurrentData = getCurrentSpeed(midHoursFromSlack, input.tideData.amplitude, isFloodPhase);

    // Calcular balance de corrente
    const currentBalance = calculateCurrentBalance(departureCurrentData, returnCurrentData);

    // Calcular penalties
    const currentPenalty = 20 * (1 - currentBalance);

    const adjustedWind = adjustWindByTime(input.weatherData.windSpeed, endTime);
    const windPenalty = calculateWindPenalty(adjustedWind);

    const wavePenalty = calculateWavePenalty(input.weatherData.waveHeight);

    // Weather penalty (chuva/tempestade)
    const weatherPenalty = calculateWeatherPenalty(
        input.weatherData.precipitation,
        input.weatherData.condition
    );

    // Time of day score
    const [hours, minutes] = endTime.split(':').map(Number);
    const endHour = hours + minutes / 60;
    let timeOfDayScore = 0;

    if (period === 'morning') {
        if (endHour <= 7) timeOfDayScore = -8;
        else if (endHour <= 8) timeOfDayScore = -5;
        else if (endHour <= 9) timeOfDayScore = 0;
        else timeOfDayScore = 12;
    } else {
        if (endHour <= 16.5) timeOfDayScore = 15;
        else if (endHour <= 17.5) timeOfDayScore = 10;
        else timeOfDayScore = 5;
    }

    const totalScore = Math.max(0, currentPenalty + windPenalty + wavePenalty + weatherPenalty + timeOfDayScore);

    // Gerar recomendação
    let recommendation = '';
    if (totalScore <= 15) {
        recommendation = 'Condições excelentes para treino! Aproveite.';
    } else if (totalScore <= 30) {
        recommendation = 'Boas condições. Treino produtivo garantido.';
    } else if (totalScore <= 50) {
        recommendation = 'Condições moderadas. Requer atenção.';
    } else if (totalScore <= 70) {
        recommendation = 'Condições difíceis. Apenas para remadores experientes.';
    } else {
        recommendation = 'Condições perigosas. Não recomendado.';
    }

    return {
        startTime,
        endTime,
        period,
        classification: scoreToClassification(totalScore),
        score: Math.round(totalScore),
        tideFactors: {
            departurePhase: `${isFloodPhase ? 'Enchendo' : 'Vazando'} - ${hoursFromNearestSlack.toFixed(1)}h da estofa`,
            departureTime: startTime,
            returnPhase: `${isFloodPhase ? 'Enchendo' : 'Vazando'} - ${midHoursFromSlack.toFixed(1)}h da estofa`,
            returnTime: midTime,
            departureCurrentSpeed: departureCurrentData.speed,
            departureCurrentType: departureCurrentData.type,
            returnCurrentSpeed: returnCurrentData.speed,
            returnCurrentType: returnCurrentData.type,
            currentBalance
        },
        environmentFactors: {
            windSpeed: Math.round(adjustedWind),
            windDirection: input.weatherData.windDirection,
            waveHeight: input.weatherData.waveHeight,
            sunIntensity: endHour < 8 || endHour > 17 ? 'baixa' : endHour < 16 ? 'alta' : 'moderada',
            temperature: 28 // Simplificado
        },
        penalties: {
            currentPenalty: Math.round(currentPenalty),
            windPenalty,
            wavePenalty,
            timeOfDayScore
        },
        recommendation
    };
}

/**
 * Encontra o melhor horário para remo
 */
function findBestRowingTime(slots: SlotAnalysis[]): BestTimeResult {
    const morningSlots = slots.filter(s => s.period === 'morning').sort((a, b) => a.score - b.score);
    const afternoonSlots = slots.filter(s => s.period === 'afternoon').sort((a, b) => a.score - b.score);

    const bestMorning = morningSlots[0];
    const bestAfternoon = afternoonSlots[0];

    let best: SlotAnalysis;
    let reason: string;

    // REGRA DE OURO: Preferir manhã se diferença <= 10 pontos
    if (bestMorning && bestAfternoon) {
        if (bestAfternoon.score - bestMorning.score <= 10) {
            best = bestMorning;
            reason = 'Manhã preferida (vento mais estável e temperatura amena)';
        } else if (bestMorning.score < bestAfternoon.score) {
            best = bestMorning;
            reason = 'Melhores condições pela manhã';
        } else {
            best = bestAfternoon;
            reason = 'Melhores condições pela tarde';
        }
    } else {
        best = bestMorning || bestAfternoon;
        reason = best.period === 'morning' ? 'Única opção viável pela manhã' : 'Única opção viável pela tarde';
    }

    // Alternativas (2-3 melhores após o escolhido)
    const allSorted = slots.filter(s => s !== best).sort((a, b) => a.score - b.score);
    const alternativeTimes = allSorted.slice(0, 3);

    return {
        slot: best,
        reason,
        alternativeTimes
    };
}

/**
 * Função principal: Analisa condições de remo para todos os horários viáveis
 */
export function analyzeRowingConditions(input: RowingAnalysisInput): RowingConditionsOutput {
    const allSlots: SlotAnalysis[] = [];

    // Analisar slots da manhã
    for (const time of VALID_MORNING_SLOTS) {
        allSlots.push(analyzeSlot(time, 'morning', input));
    }

    // Analisar slots da tarde
    for (const time of VALID_AFTERNOON_SLOTS) {
        allSlots.push(analyzeSlot(time, 'afternoon', input));
    }

    const morningSlots = allSlots.filter(s => s.period === 'morning');
    const afternoonSlots = allSlots.filter(s => s.period === 'afternoon');

    const bestTime = findBestRowingTime(allSlots);

    // Determinar tipo de maré
    let tideType: 'sizígia' | 'quadratura' | 'média';
    if (input.tideData.amplitude > 200) tideType = 'sizígia';
    else if (input.tideData.amplitude < 100) tideType = 'quadratura';
    else tideType = 'média';

    return {
        date: input.currentDate.toISOString().split('T')[0],
        morningSlots,
        afternoonSlots,
        bestTime,
        tideInfo: {
            nextHighTide: `${input.tideData.nextHighTide.getHours().toString().padStart(2, '0')}:${input.tideData.nextHighTide.getMinutes().toString().padStart(2, '0')}`,
            nextLowTide: `${input.tideData.nextLowTide.getHours().toString().padStart(2, '0')}:${input.tideData.nextLowTide.getMinutes().toString().padStart(2, '0')}`,
            amplitude: input.tideData.amplitude,
            tideType
        },
        quickSummary: {
            bestPeriod: bestTime.slot.period,
            bestTimeRange: `${bestTime.slot.startTime}-${bestTime.slot.endTime}`,
            classification: bestTime.slot.classification,
            oneLineReason: bestTime.reason
        }
    };
}

/**
 * Encontra o slot atual (se estiver em horário viável)
 */
export function findCurrentSlot(currentTime: Date, analysis: RowingConditionsOutput): SlotAnalysis | null {
    const timeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    const [currentH, currentM] = timeStr.split(':').map(Number);
    const currentMinutes = currentH * 60 + currentM;

    const allSlots = [...analysis.morningSlots, ...analysis.afternoonSlots];

    for (const slot of allSlots) {
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
            return slot;
        }
    }

    return null;
}
