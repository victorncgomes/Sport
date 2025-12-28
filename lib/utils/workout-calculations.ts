// Utilitários para cálculos de treino
// Sport Club de Natal v0.3.8

export interface Split {
    distance: number;  // metros
    time: number;      // segundos
    pace: string;      // "MM:SS/500m"
}

/**
 * Calcula o pace (ritmo) em formato MM:SS/500m
 */
export function calculatePace(distance: number, time: number): string {
    if (distance === 0 || time === 0) return '--:--';

    const pace500m = (time / (distance / 500)); // segundos por 500m
    const minutes = Math.floor(pace500m / 60);
    const seconds = Math.floor(pace500m % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Divide o track em splits de 500m
 */
export function calculateSplits(track: any[]): Split[] {
    if (track.length < 2) return [];

    const splits: Split[] = [];
    let currentDistance = 0;
    let splitStartIndex = 0;
    let splitStartTime = new Date(track[0].timestamp).getTime();

    for (let i = 1; i < track.length; i++) {
        const segmentDistance = calculateDistance(
            track[i - 1].lat,
            track[i - 1].lng,
            track[i].lat,
            track[i].lng
        );

        currentDistance += segmentDistance;

        // Quando completar 500m
        if (currentDistance >= 500) {
            const splitEndTime = new Date(track[i].timestamp).getTime();
            const splitTime = (splitEndTime - splitStartTime) / 1000; // segundos

            splits.push({
                distance: 500,
                time: splitTime,
                pace: calculatePace(500, splitTime)
            });

            // Reset para próximo split
            currentDistance = currentDistance - 500;
            splitStartIndex = i;
            splitStartTime = splitEndTime;
        }
    }

    return splits;
}

/**
 * Estima calorias queimadas
 * Baseado em MET (Metabolic Equivalent of Task)
 */
export function estimateCalories(
    distance: number,    // metros
    time: number,        // segundos
    weight: number,      // kg
    intensity: number    // 0-1 (0=fácil, 1=máximo)
): number {
    // Remo outdoor: 6-12 METs dependendo da intensidade
    const baseMET = 6;
    const maxMET = 12;
    const met = baseMET + (intensity * (maxMET - baseMET));

    // Fórmula: METs × peso (kg) × tempo (horas)
    const hours = time / 3600;
    const calories = met * weight * hours;

    return Math.round(calories);
}

/**
 * Estima SPM (Strokes Per Minute) pela variação de velocidade
 * Algoritmo simplificado - pode ser melhorado com ML no futuro
 */
export function estimateSPM(track: any[]): number | null {
    if (track.length < 10) return null;

    // Analisar últimos 30 segundos
    const recentPoints = track.slice(-30);
    let strokeCount = 0;
    let lastSpeed = 0;
    let isAccelerating = false;

    for (const point of recentPoints) {
        if (point.speed === null || point.speed === undefined) continue;

        const currentSpeed = point.speed;

        // Detectar aceleração (início da remada)
        if (currentSpeed > lastSpeed && !isAccelerating) {
            strokeCount++;
            isAccelerating = true;
        }

        // Detectar desaceleração (fim da remada)
        if (currentSpeed < lastSpeed && isAccelerating) {
            isAccelerating = false;
        }

        lastSpeed = currentSpeed;
    }

    // Calcular SPM baseado no tempo dos pontos recentes
    const timeSpan = (
        new Date(recentPoints[recentPoints.length - 1].timestamp).getTime() -
        new Date(recentPoints[0].timestamp).getTime()
    ) / 1000; // segundos

    if (timeSpan === 0) return null;

    const spm = (strokeCount / timeSpan) * 60;

    // Validar range razoável (15-40 SPM)
    return spm >= 15 && spm <= 40 ? Math.round(spm) : null;
}

/**
 * Calcula distância entre dois pontos GPS (Haversine)
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
}

/**
 * Formata tempo em HH:MM:SS
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formata distância em km
 */
export function formatDistance(meters: number): string {
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(2)} km` : `${meters.toFixed(0)} m`;
}

/**
 * Calcula velocidade média em km/h
 */
export function calculateAverageSpeed(distance: number, time: number): number {
    if (time === 0) return 0;
    const hours = time / 3600;
    const km = distance / 1000;
    return km / hours;
}

/**
 * Detecta se o usuário está parado (para auto-pause)
 */
export function isStationary(recentSpeeds: number[], threshold: number = 0.5): boolean {
    if (recentSpeeds.length < 3) return false;

    const avgSpeed = recentSpeeds.reduce((sum, speed) => sum + speed, 0) / recentSpeeds.length;
    return avgSpeed < threshold;
}
