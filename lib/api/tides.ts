// Tide Data Parser & Calculator

import type { TideDay, TidePoint, TideType } from '@/types/tides';
import { getAstronomyData, formatTime } from './astronomy';

export interface TideCSVRow {
    date: string; // DD/MM/YYYY
    highTide1Time?: string; // HH:mm
    highTide1Height?: number; // metros
    lowTide1Time?: string;
    lowTide1Height?: number;
    highTide2Time?: string;
    highTide2Height?: number;
    lowTide2Time?: string;
    lowTide2Height?: number;
}

/**
 * Parse CSV data from Marinha do Brasil
 * Expected format: data,alta1_hora,alta1_altura,baixa1_hora,baixa1_altura,alta2_hora,alta2_altura,baixa2_hora,baixa2_altura
 */
export function parseTideCSV(csvData: string): TideCSVRow[] {
    const lines = csvData.trim().split('\n');
    const rows: TideCSVRow[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(s => s.trim());

        if (cols.length < 9) continue;

        rows.push({
            date: cols[0],
            highTide1Time: cols[1] || undefined,
            highTide1Height: cols[2] ? parseFloat(cols[2]) : undefined,
            lowTide1Time: cols[3] || undefined,
            lowTide1Height: cols[4] ? parseFloat(cols[4]) : undefined,
            highTide2Time: cols[5] || undefined,
            highTide2Height: cols[6] ? parseFloat(cols[6]) : undefined,
            lowTide2Time: cols[7] || undefined,
            lowTide2Height: cols[8] ? parseFloat(cols[8]) : undefined,
        });
    }

    return rows;
}

/**
 * Calcula o coeficiente de marés baseado na amplitude
 * Fórmula: (amplitude / amplitudeMaxima) * 100
 */
export function calculateTideCoefficient(
    highTideHeight: number,
    lowTideHeight: number
): number {
    const amplitude = highTideHeight - lowTideHeight;
    const maxAmplitude = 3.3; // Natal máximo histórico (Marinha)

    const coefficient = Math.round((amplitude / maxAmplitude) * 100);

    // Limitar entre 20 e 120
    return Math.max(20, Math.min(120, coefficient));
}

/**
 * Determina o melhor horário para remar baseado nas marés
 * Lógica:
 * - Evitar 1h antes e 1h depois da maré alta (correntes fortes)
 * - Ideal: 2h antes ou 2h depois da maré baixa
 * - Preferir horários com luz natural (entre sunrise e sunset)
 */
export function getBestRowingTime(
    tides: TidePoint[],
    sunrise: Date,
    sunset: Date
): string | null {
    const lowTides = tides.filter(t => t.type === 'LOW');

    if (lowTides.length === 0) return null;

    // Procurar baixa-mar durante o dia
    const today = new Date();

    for (const lowTide of lowTides) {
        const [hours, minutes] = lowTide.time.split(':').map(Number);
        const lowTideTime = new Date(today);
        lowTideTime.setHours(hours, minutes, 0);

        // 2h depois da baixa-mar
        const idealTime = new Date(lowTideTime.getTime() + 2 * 60 * 60 * 1000);

        // Verificar se está entre sunrise e sunset
        if (idealTime >= sunrise && idealTime <= sunset) {
            return formatTime(idealTime);
        }
    }

    // Se não encontrou durante o dia, retornar 2h depois da primeira baixa-mar
    const firstLow = lowTides[0];
    const [hours, minutes] = firstLow.time.split(':').map(Number);
    const lowTideTime = new Date(today);
    lowTideTime.setHours(hours, minutes, 0);
    const idealTime = new Date(lowTideTime.getTime() + 2 * 60 * 60 * 1000);

    return formatTime(idealTime);
}

/**
 * Converte TideCSVRow para TideDay completo
 */
export function convertToTideDay(row: TideCSVRow): TideDay {
    // Parse date
    const [day, month, year] = row.date.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Build tides array
    const tides: TidePoint[] = [];

    if (row.highTide1Time && row.highTide1Height !== undefined) {
        tides.push({
            time: row.highTide1Time,
            height: row.highTide1Height,
            type: 'HIGH'
        });
    }

    if (row.lowTide1Time && row.lowTide1Height !== undefined) {
        tides.push({
            time: row.lowTide1Time,
            height: row.lowTide1Height,
            type: 'LOW'
        });
    }

    if (row.highTide2Time && row.highTide2Height !== undefined) {
        tides.push({
            time: row.highTide2Time,
            height: row.highTide2Height,
            type: 'HIGH'
        });
    }

    if (row.lowTide2Time && row.lowTide2Height !== undefined) {
        tides.push({
            time: row.lowTide2Time,
            height: row.lowTide2Height,
            type: 'LOW'
        });
    }

    // Sort by time
    tides.sort((a, b) => a.time.localeCompare(b.time));

    // Calculate coefficient
    const highTide = tides.find(t => t.type === 'HIGH');
    const lowTide = tides.find(t => t.type === 'LOW');

    const coefficient = (highTide && lowTide)
        ? calculateTideCoefficient(highTide.height, lowTide.height)
        : 50;

    // Get astronomy data
    const astro = getAstronomyData(date);

    // Determine best rowing time
    const bestRowingTime = getBestRowingTime(tides, astro.sunrise, astro.sunset);

    return {
        date,
        coefficient,
        tides,
        sunrise: formatTime(astro.sunrise),
        sunset: formatTime(astro.sunset),
        moonPhase: astro.moonPhase,
        moonIllumination: astro.moonIllumination,
        moonrise: formatTime(astro.moonrise),
        moonset: formatTime(astro.moonset),
        bestRowingTime
    };
}

/**
 * Generate mock tide data for next N days (for testing)
 */
export function generateMockTideData(days: number = 7): TideDay[] {
    const tideData: TideDay[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Mock tide times (baseado em padrões reais de Natal)
        const tides: TidePoint[] = [
            { time: '05:00', height: 2.4, type: 'HIGH' },
            { time: '11:00', height: 0.3, type: 'LOW' },
            { time: '17:00', height: 2.6, type: 'HIGH' },
            { time: '23:00', height: 0.2, type: 'LOW' },
        ];

        const astro = getAstronomyData(date);
        const coefficient = calculateTideCoefficient(2.6, 0.2);
        const bestRowingTime = getBestRowingTime(tides, astro.sunrise, astro.sunset);

        tideData.push({
            date,
            coefficient,
            tides,
            sunrise: formatTime(astro.sunrise),
            sunset: formatTime(astro.sunset),
            moonPhase: astro.moonPhase,
            moonIllumination: astro.moonIllumination,
            moonrise: formatTime(astro.moonrise),
            moonset: formatTime(astro.moonset),
            bestRowingTime
        });
    }

    return tideData;
}

/**
 * Save tide data to database
 */
export async function saveTideDataToDatabase(tideDay: TideDay) {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
        await prisma.tideData.upsert({
            where: {
                date_location: {
                    date: tideDay.date,
                    location: 'Natal-RN'
                }
            },
            update: {
                highTide1Time: tideDay.tides.find(t => t.type === 'HIGH')?.time,
                highTide1Height: tideDay.tides.find(t => t.type === 'HIGH')?.height,
                highTide2Time: tideDay.tides.filter(t => t.type === 'HIGH')[1]?.time,
                highTide2Height: tideDay.tides.filter(t => t.type === 'HIGH')[1]?.height,
                lowTide1Time: tideDay.tides.find(t => t.type === 'LOW')?.time,
                lowTide1Height: tideDay.tides.find(t => t.type === 'LOW')?.height,
                lowTide2Time: tideDay.tides.filter(t => t.type === 'LOW')[1]?.time,
                lowTide2Height: tideDay.tides.filter(t => t.type === 'LOW')[1]?.height,
                coefficient: tideDay.coefficient,
                sunrise: tideDay.sunrise,
                sunset: tideDay.sunset,
                moonrise: tideDay.moonrise,
                moonset: tideDay.moonset,
                moonPhase: tideDay.moonPhase,
                moonIllumination: tideDay.moonIllumination,
                bestRowingTime: tideDay.bestRowingTime
            },
            create: {
                date: tideDay.date,
                location: 'Natal-RN',
                highTide1Time: tideDay.tides.find(t => t.type === 'HIGH')?.time,
                highTide1Height: tideDay.tides.find(t => t.type === 'HIGH')?.height,
                highTide2Time: tideDay.tides.filter(t => t.type === 'HIGH')[1]?.time,
                highTide2Height: tideDay.tides.filter(t => t.type === 'HIGH')[1]?.height,
                lowTide1Time: tideDay.tides.find(t => t.type === 'LOW')?.time,
                lowTide1Height: tideDay.tides.find(t => t.type === 'LOW')?.height,
                lowTide2Time: tideDay.tides.filter(t => t.type === 'LOW')[1]?.time,
                lowTide2Height: tideDay.tides.filter(t => t.type === 'LOW')[1]?.height,
                coefficient: tideDay.coefficient,
                sunrise: tideDay.sunrise,
                sunset: tideDay.sunset,
                moonrise: tideDay.moonrise,
                moonset: tideDay.moonset,
                moonPhase: tideDay.moonPhase,
                moonIllumination: tideDay.moonIllumination,
                bestRowingTime: tideDay.bestRowingTime
            }
        });

        console.log(`Tide data saved for ${tideDay.date.toLocaleDateString()}`);
    } catch (error) {
        console.error('Error saving tide data:', error);
    } finally {
        await prisma.$disconnect();
    }
}
