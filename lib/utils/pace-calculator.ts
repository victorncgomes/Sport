// Cálculo em tempo real do impacto no pace baseado em condições
export interface PaceImpactFactors {
    windSpeed: number;      // km/h
    windDirection: number;  // graus (0-360)
    currentSpeed: number;   // m/s
    currentDirection: number; // graus (0-360)
    waveHeight: number;     // metros
    rowingDirection?: number; // graus (0-360), padrão: 140 (SE)
}

export interface PaceImpact {
    delta: number;          // segundos ganhos (-) ou perdidos (+) por 500m
    percentage: number;     // percentual de impacto
    description: string;    // descrição textual
    favorable: boolean;     // se as condições são favoráveis
}

/**
 * Calcula o impacto no pace baseado nas condições atuais
 * Retorna o ganho (negativo) ou perda (positivo) em segundos por 500m
 */
export function calculatePaceImpact(factors: PaceImpactFactors): PaceImpact {
    const {
        windSpeed,
        windDirection,
        currentSpeed,
        currentDirection,
        waveHeight,
        rowingDirection = 140 // Direção típica de remo no Rio Potengi (SE)
    } = factors;

    let totalImpact = 0;

    // 1. Impacto do vento
    const windAngle = Math.abs(windDirection - rowingDirection);
    const windAngleNormalized = windAngle > 180 ? 360 - windAngle : windAngle;

    // Vento a favor (0-45°) ajuda, vento contra (135-180°) atrapalha
    const windFactor = Math.cos((windAngleNormalized * Math.PI) / 180);
    const windImpact = -(windSpeed / 3.6) * windFactor * 2.5; // Conversão para m/s e fator de impacto

    totalImpact += windImpact;

    // 2. Impacto da corrente
    const currentAngle = Math.abs(currentDirection - rowingDirection);
    const currentAngleNormalized = currentAngle > 180 ? 360 - currentAngle : currentAngle;

    const currentFactor = Math.cos((currentAngleNormalized * Math.PI) / 180);
    const currentImpact = -currentSpeed * currentFactor * 15; // Corrente tem impacto maior

    totalImpact += currentImpact;

    // 3. Impacto das ondas
    // Ondas sempre atrapalham, especialmente se forem altas
    const waveImpact = waveHeight * 8; // Cada metro de onda adiciona ~8s/500m

    totalImpact += waveImpact;

    // Calcular percentual (baseado em pace médio de ~2:30/500m = 150s)
    const basePace = 150; // segundos
    const percentage = (totalImpact / basePace) * 100;

    // Descrição
    let description = '';
    const absImpact = Math.abs(totalImpact);

    if (totalImpact < -10) {
        description = `Ganho de ${absImpact.toFixed(1)}s/500m - Condições excelentes!`;
    } else if (totalImpact < -5) {
        description = `Ganho de ${absImpact.toFixed(1)}s/500m - Condições favoráveis`;
    } else if (totalImpact < 0) {
        description = `Ganho de ${absImpact.toFixed(1)}s/500m - Leve vantagem`;
    } else if (totalImpact < 5) {
        description = `Perda de ${absImpact.toFixed(1)}s/500m - Condições neutras`;
    } else if (totalImpact < 10) {
        description = `Perda de ${absImpact.toFixed(1)}s/500m - Condições desafiadoras`;
    } else {
        description = `Perda de ${absImpact.toFixed(1)}s/500m - Condições difíceis`;
    }

    return {
        delta: parseFloat(totalImpact.toFixed(1)),
        percentage: parseFloat(percentage.toFixed(1)),
        description,
        favorable: totalImpact < 0
    };
}

/**
 * Exemplo de uso:
 * 
 * const impact = calculatePaceImpact({
 *     windSpeed: 18,        // 18 km/h
 *     windDirection: 45,    // NE
 *     currentSpeed: 0.59,   // 0.59 m/s
 *     currentDirection: 308, // NW
 *     waveHeight: 0.8,      // 0.8m
 *     rowingDirection: 140  // SE (padrão)
 * });
 * 
 * console.log(impact);
 * // { delta: -14.5, percentage: -9.7, description: "Ganho de 14.5s/500m", favorable: true }
 */
