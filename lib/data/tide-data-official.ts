// Dados oficiais da Tábua de Marés - Marinha do Brasil
// Porto de Natal - Capitania dos Portos do RN
// Latitude 05° 46'.7 S / Longitude 35° 12'.4 W
// Fuso UTC -03:00 / Nível Médio 1.29m

import tideData from './tide-data.json';

// Exportação compatível com o código antigo que esperava um array chamado december2025
export const december2025 = (tideData as Record<string, any>)['2025-12']?.days ?? [];


export interface TideEntry {
    time: string; // HH:MM
    height: number; // metros
}

export interface DayTides {
    day: number;
    weekday: string;
    tides: TideEntry[];
}

export interface MonthTides {
    month: number;
    year: number;
    days: DayTides[];
}

// Função auxiliar para determinar se é maré alta ou baixa
// Baseado no Nível Médio de 1.29m para o Porto de Natal
export function isHighTide(height: number): boolean {
    const NIVEL_MEDIO = 1.29; // metros
    return height > NIVEL_MEDIO;
}

/**
 * Obtém as marés de um dia específico.
 * Retorna null se não houver dados para a data solicitada.
 */
export function getTidesForDate(date: Date): DayTides | null {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1‑12
    const day = date.getDate();
    const key = `${year}-${month}`;
    const monthData: MonthTides | undefined = (tideData as Record<string, MonthTides>)[key];
    if (!monthData) return null;
    return monthData.days.find(d => d.day === day) || null;
}

// Função para obter próxima maré
export function getNextTide(date: Date): { type: 'high' | 'low'; time: string; height: number } | null {
    const dayData = getTidesForDate(date);
    if (!dayData) return null;
    const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    for (const tide of dayData.tides) {
        if (tide.time > currentTime) {
            return {
                type: isHighTide(tide.height) ? 'high' : 'low',
                time: tide.time,
                height: tide.height
            };
        }
    }
    return null;
}

// Função de debug para logging
export function debugTideData(date: Date): void {
    const dayData = getTidesForDate(date);
    console.log('🌊 [Tide Data Debug]', {
        requestedDate: date.toISOString(),
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        foundData: !!dayData,
        tides: dayData?.tides,
        source: dayData ? 'Marinha do Brasil (Oficial)' : 'Dados não encontrados'
    });
}
