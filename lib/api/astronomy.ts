// Astronomy Calculator using SunCalc library

import SunCalc from 'suncalc';
import type { MoonPhase } from '@/types/tides';

const NATAL_LAT = -5.7945;
const NATAL_LON = -35.2110;

export interface AstronomyData {
    sunrise: Date;
    sunset: Date;
    moonrise: Date | null;
    moonset: Date | null;
    moonPhase: MoonPhase;
    moonIllumination: number; // 0-100%
}

export function getMoonPhaseName(phase: number): MoonPhase {
    // SunCalc retorna fase lunar de 0 a 1
    // 0 = Lua Nova
    // 0.25 = Quarto Crescente
    // 0.5 = Lua Cheia
    // 0.75 = Quarto Minguante

    if (phase < 0.125 || phase >= 0.875) {
        return 'NEW';
    } else if (phase >= 0.125 && phase < 0.375) {
        return 'FIRST_QUARTER';
    } else if (phase >= 0.375 && phase < 0.625) {
        return 'FULL';
    } else {
        return 'LAST_QUARTER';
    }
}

export function getAstronomyData(date: Date): AstronomyData {
    // Sun times
    const sunTimes = SunCalc.getTimes(date, NATAL_LAT, NATAL_LON);

    // Moon times
    const moonTimes = SunCalc.getMoonTimes(date, NATAL_LAT, NATAL_LON);

    // Moon illumination
    const moonIllum = SunCalc.getMoonIllumination(date);

    return {
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
        moonrise: moonTimes.rise || null,
        moonset: moonTimes.set || null,
        moonPhase: getMoonPhaseName(moonIllum.phase),
        moonIllumination: moonIllum.fraction * 100
    };
}

export function formatTime(date: Date | null): string {
    if (!date) return '--:--';

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

// Calcular períodos solunares (melhores horários para pesca/remo)
export function getSolunarPeriods(date: Date): {
    major: { start: Date; end: Date }[];
    minor: { start: Date; end: Date }[];
} {
    const moonPosition = SunCalc.getMoonPosition(date, NATAL_LAT, NATAL_LON);
    const moonTimes = SunCalc.getMoonTimes(date, NATAL_LAT, NATAL_LON);

    const major: { start: Date; end: Date }[] = [];
    const minor: { start: Date; end: Date }[] = [];

    // Períodos maiores: trânsito lunar (2h de duração)
    // Simplificado: meio-dia lunar (quando lua está no ponto mais alto)
    const lunarTransit = new Date(date);
    lunarTransit.setHours(12, 0, 0);

    major.push({
        start: new Date(lunarTransit.getTime() - 60 * 60 * 1000), // -1h
        end: new Date(lunarTransit.getTime() + 60 * 60 * 1000) // +1h
    });

    // Períodos menores: nascer/pôr da lua (1h de duração)
    if (moonTimes.rise) {
        minor.push({
            start: new Date(moonTimes.rise.getTime() - 30 * 60 * 1000), // -30min
            end: new Date(moonTimes.rise.getTime() + 30 * 60 * 1000) // +30min
        });
    }

    if (moonTimes.set) {
        minor.push({
            start: new Date(moonTimes.set.getTime() - 30 * 60 * 1000), // -30min
            end: new Date(moonTimes.set.getTime() + 30 * 60 * 1000) // +30min
        });
    }

    return { major, minor };
}
