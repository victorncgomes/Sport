/**
 * GPS Tracker - Sport Club de Natal
 * Módulo para rastreamento GPS em treinos outdoor
 */

export interface GPSPoint {
    lat: number;
    lng: number;
    timestamp: number;
    accuracy: number;
    altitude?: number;
    speed?: number;
    heading?: number;
}

export interface GPSTrackStats {
    totalDistance: number;      // metros
    elapsedTime: number;        // segundos
    currentPace: string;        // "MM:SS/500m"
    avgPace: string;
    currentSpeed: number;       // m/s
    avgSpeed: number;
    splits: Split[];
}

export interface Split {
    distance: number;           // metros
    time: number;               // segundos
    pace: string;               // "MM:SS/500m"
}

// Calcular distância entre dois pontos usando fórmula de Haversine
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371000; // Raio da Terra em metros
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Formatar pace em MM:SS/500m
export function formatPace(secondsPer500m: number): string {
    if (!isFinite(secondsPer500m) || secondsPer500m <= 0) return '--:--';
    const minutes = Math.floor(secondsPer500m / 60);
    const seconds = Math.floor(secondsPer500m % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Calcular pace (segundos por 500m)
export function calculatePace(distanceMeters: number, timeSeconds: number): number {
    if (distanceMeters <= 0 || timeSeconds <= 0) return 0;
    return (timeSeconds / distanceMeters) * 500;
}

// Calcular splits de 500m
export function calculateSplits(track: GPSPoint[]): Split[] {
    if (track.length < 2) return [];

    const splits: Split[] = [];
    let splitStartIndex = 0;
    let accumulatedDistance = 0;

    for (let i = 1; i < track.length; i++) {
        const distance = calculateDistance(
            track[i - 1].lat,
            track[i - 1].lng,
            track[i].lat,
            track[i].lng
        );

        accumulatedDistance += distance;

        // A cada 500m, criar um split
        if (accumulatedDistance >= 500) {
            const splitTime = (track[i].timestamp - track[splitStartIndex].timestamp) / 1000;
            const pace = calculatePace(accumulatedDistance, splitTime);

            splits.push({
                distance: accumulatedDistance,
                time: splitTime,
                pace: formatPace(pace)
            });

            splitStartIndex = i;
            accumulatedDistance = 0;
        }
    }

    return splits;
}

// Estimar calorias queimadas
export function estimateCalories(
    distanceMeters: number,
    timeSeconds: number,
    weightKg: number,
    intensity: number = 0.7  // 0-1
): number {
    // MET para remo: 6-12 dependendo da intensidade
    const met = 6 + (intensity * 6);
    const hours = timeSeconds / 3600;
    return Math.round(met * weightKg * hours);
}

// Calcular estatísticas do track
export function calculateTrackStats(
    track: GPSPoint[],
    startTime: number
): GPSTrackStats {
    if (track.length < 2) {
        return {
            totalDistance: 0,
            elapsedTime: 0,
            currentPace: '--:--',
            avgPace: '--:--',
            currentSpeed: 0,
            avgSpeed: 0,
            splits: []
        };
    }

    // Calcular distância total
    let totalDistance = 0;
    for (let i = 1; i < track.length; i++) {
        totalDistance += calculateDistance(
            track[i - 1].lat,
            track[i - 1].lng,
            track[i].lat,
            track[i].lng
        );
    }

    // Tempo decorrido
    const elapsedTime = (Date.now() - startTime) / 1000;

    // Pace médio
    const avgPaceSeconds = calculatePace(totalDistance, elapsedTime);
    const avgPace = formatPace(avgPaceSeconds);

    // Pace atual (últimos 30 segundos)
    const recentPoints = track.filter(
        p => p.timestamp > Date.now() - 30000
    );
    let recentDistance = 0;
    for (let i = 1; i < recentPoints.length; i++) {
        recentDistance += calculateDistance(
            recentPoints[i - 1].lat,
            recentPoints[i - 1].lng,
            recentPoints[i].lat,
            recentPoints[i].lng
        );
    }
    const recentTime = recentPoints.length > 1
        ? (recentPoints[recentPoints.length - 1].timestamp - recentPoints[0].timestamp) / 1000
        : 0;
    const currentPaceSeconds = calculatePace(recentDistance, recentTime);
    const currentPace = formatPace(currentPaceSeconds);

    // Velocidade
    const avgSpeed = elapsedTime > 0 ? totalDistance / elapsedTime : 0;
    const currentSpeed = recentTime > 0 ? recentDistance / recentTime : 0;

    // Splits
    const splits = calculateSplits(track);

    return {
        totalDistance,
        elapsedTime,
        currentPace,
        avgPace,
        currentSpeed,
        avgSpeed,
        splits
    };
}

// Filtrar pontos com baixa precisão
export function filterByAccuracy(
    points: GPSPoint[],
    maxAccuracy: number = 50
): GPSPoint[] {
    return points.filter(p => p.accuracy <= maxAccuracy);
}

// Detectar se usuário está parado (para auto-pause)
export function isStationary(
    track: GPSPoint[],
    thresholdSpeed: number = 0.5,  // m/s
    checkDuration: number = 30000  // ms
): boolean {
    const recentPoints = track.filter(
        p => p.timestamp > Date.now() - checkDuration
    );

    if (recentPoints.length < 2) return false;

    let totalDistance = 0;
    for (let i = 1; i < recentPoints.length; i++) {
        totalDistance += calculateDistance(
            recentPoints[i - 1].lat,
            recentPoints[i - 1].lng,
            recentPoints[i].lat,
            recentPoints[i].lng
        );
    }

    const timeDiff = (recentPoints[recentPoints.length - 1].timestamp - recentPoints[0].timestamp) / 1000;
    const speed = timeDiff > 0 ? totalDistance / timeDiff : 0;

    return speed < thresholdSpeed;
}

// Formatar distância
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
}

// Formatar tempo
export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
