// Serviço para geração de dados de correnteza
// Baseado em dados de maré e padrões do Rio Potengi

import { CurrentData } from '@/types/rowing-conditions';
import { POTENGI_COURSE } from '@/lib/config/rowing-config';

/**
 * Gera dados simulados de correnteza baseados em:
 * - Altura da maré
 * - Coeficiente de maré
 * - Horário (corrente mais forte durante mudança de maré)
 */
export function generateCurrentData(
    tideHeight: number,
    tideCoefficient: number,
    currentTime: string,
    nextTideTime: string,
    nextTideType: 'HIGH' | 'LOW'
): CurrentData {
    // Calcular velocidade base da corrente
    // Corrente é mais forte durante a mudança de maré (meio do ciclo)
    const timeToNextTide = calculateTimeToNextTide(currentTime, nextTideTime);

    // Velocidade máxima baseada no coeficiente (maior coeficiente = corrente mais forte)
    const maxSpeed = (tideCoefficient / 100) * 1.2; // até 1.2 m/s em marés fortes

    // Corrente mais forte no meio do ciclo (função senoidal)
    // Assumindo ciclo de ~6h entre marés
    const cycleFactor = Math.sin((timeToNextTide / 360) * Math.PI);
    const currentSpeed = maxSpeed * Math.abs(cycleFactor);

    // Direção da corrente
    // Em estuários, corrente segue o canal
    // Maré enchente: corrente entra (direção ~135° SE)
    // Maré vazante: corrente sai (direção ~315° NW)
    let currentDirection: number;
    if (nextTideType === 'HIGH') {
        // Maré enchendo - corrente entrando
        currentDirection = 135 + (Math.random() * 20 - 10); // 135° ± 10°
    } else {
        // Maré vazando - corrente saindo
        currentDirection = 315 + (Math.random() * 20 - 10); // 315° ± 10°
    }

    // Calcular ângulo relativo ao percurso
    const relativeAngle = calculateRelativeAngleToCourse(currentDirection);

    return {
        speed_m_s: Math.round(currentSpeed * 100) / 100,
        direction_deg: Math.round(currentDirection),
        relative_angle_deg: Math.round(relativeAngle)
    };
}

/**
 * Calcula tempo até próxima maré em minutos
 */
function calculateTimeToNextTide(currentTime: string, nextTideTime: string): number {
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    const [nextHour, nextMin] = nextTideTime.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMin;
    let nextMinutes = nextHour * 60 + nextMin;

    // Se próxima maré é no dia seguinte
    if (nextMinutes < currentMinutes) {
        nextMinutes += 24 * 60;
    }

    return nextMinutes - currentMinutes;
}

/**
 * Calcula ângulo relativo ao percurso
 */
function calculateRelativeAngleToCourse(direction: number): number {
    const courseAzimuth = POTENGI_COURSE.azimuth;
    let diff = Math.abs(direction - courseAzimuth);

    if (diff > 180) {
        diff = 360 - diff;
    }

    return diff;
}

/**
 * Gera dados simulados de corrente para horário atual
 * Versão simplificada para uso quando não há dados completos de maré
 */
export function generateSimpleCurrentData(): CurrentData {
    const now = new Date();
    const hour = now.getHours();

    // Simular ciclo de maré baseado na hora do dia
    // Assumir 2 ciclos por dia (maré semi-diurna)
    const cycleFactor = Math.sin((hour / 12) * Math.PI * 2);
    const speed = Math.abs(cycleFactor) * 0.8; // até 0.8 m/s

    // Direção baseada no ciclo
    const direction = cycleFactor > 0 ? 135 : 315;

    return {
        speed_m_s: Math.round(speed * 100) / 100,
        direction_deg: direction,
        relative_angle_deg: calculateRelativeAngleToCourse(direction)
    };
}
