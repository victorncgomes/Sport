// GPS Tracker para treinos outdoor
// Sport Club de Natal v0.3.8

import { openDB, addGPSPoints, STORES } from '@/lib/db/indexed-db';

export interface GPSPoint {
    id: string;
    workoutId: string;
    lat: number;
    lng: number;
    timestamp: string;
    accuracy: number;
    altitude?: number;
    speed?: number;
    heading?: number;
}

export interface GPSTrackerConfig {
    interval: number;          // Intervalo de coleta em ms (2000-5000)
    accuracyThreshold: number; // Filtrar pontos com accuracy > threshold (50m)
    autoPauseSpeed: number;    // Velocidade mínima para auto-pause (0.5 m/s)
    autoPauseTime: number;     // Tempo para auto-pause (30000ms)
}

const DEFAULT_CONFIG: GPSTrackerConfig = {
    interval: 3000,
    accuracyThreshold: 50,
    autoPauseSpeed: 0.5,
    autoPauseTime: 30000
};

export class GPSTracker {
    private workoutId: string;
    private config: GPSTrackerConfig;
    private watchId: number | null = null;
    private track: GPSPoint[] = [];
    private isTracking: boolean = false;
    private isPaused: boolean = false;
    private lastSpeed: number = 0;
    private lowSpeedStartTime: number | null = null;
    private bufferSize: number = 10; // Salvar no IndexedDB a cada 10 pontos

    constructor(workoutId: string, config: Partial<GPSTrackerConfig> = {}) {
        this.workoutId = workoutId;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    async startTracking(): Promise<void> {
        if (this.isTracking) {
            console.warn('[GPS] Tracking already started');
            return;
        }

        if (!('geolocation' in navigator)) {
            throw new Error('Geolocation não suportada neste navegador');
        }

        // Solicitar permissão
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'denied') {
                throw new Error('Permissão de localização negada');
            }
        } catch (error) {
            console.warn('[GPS] Permission API not supported, proceeding anyway');
        }

        this.isTracking = true;
        this.isPaused = false;

        // Iniciar watchPosition
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handlePosition(position),
            (error) => this.handleError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        console.log('[GPS] Tracking started for workout:', this.workoutId);
    }

    stopTracking(): void {
        if (!this.isTracking) return;

        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        this.isTracking = false;
        this.isPaused = false;

        // Salvar pontos restantes
        if (this.track.length > 0) {
            this.saveToIndexedDB();
        }

        console.log('[GPS] Tracking stopped. Total points:', this.track.length);
    }

    pause(): void {
        this.isPaused = true;
        console.log('[GPS] Tracking paused');
    }

    resume(): void {
        this.isPaused = false;
        this.lowSpeedStartTime = null;
        console.log('[GPS] Tracking resumed');
    }

    getCurrentPosition(): GPSPoint | null {
        return this.track.length > 0 ? this.track[this.track.length - 1] : null;
    }

    getTrack(): GPSPoint[] {
        return [...this.track];
    }

    getTotalDistance(): number {
        if (this.track.length < 2) return 0;

        let distance = 0;
        for (let i = 1; i < this.track.length; i++) {
            distance += this.calculateDistance(
                this.track[i - 1].lat,
                this.track[i - 1].lng,
                this.track[i].lat,
                this.track[i].lng
            );
        }

        return distance; // em metros
    }

    private handlePosition(position: GeolocationPosition): void {
        if (this.isPaused) return;

        const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;

        // Filtrar pontos com baixa accuracy
        if (accuracy > this.config.accuracyThreshold) {
            console.warn('[GPS] Point rejected due to low accuracy:', accuracy);
            return;
        }

        // Criar ponto GPS
        const point: GPSPoint = {
            id: `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            workoutId: this.workoutId,
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
            accuracy,
            altitude: altitude || undefined,
            speed: speed || undefined,
            heading: heading || undefined
        };

        this.track.push(point);

        // Auto-pause detection
        if (speed !== null && speed !== undefined) {
            this.lastSpeed = speed;

            if (speed < this.config.autoPauseSpeed) {
                if (this.lowSpeedStartTime === null) {
                    this.lowSpeedStartTime = Date.now();
                } else if (Date.now() - this.lowSpeedStartTime > this.config.autoPauseTime) {
                    this.pause();
                    console.log('[GPS] Auto-paused due to low speed');
                }
            } else {
                this.lowSpeedStartTime = null;
            }
        }

        // Buffer de salvamento
        if (this.track.length % this.bufferSize === 0) {
            this.saveToIndexedDB();
        }

        console.log('[GPS] Point collected:', {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            accuracy: accuracy.toFixed(1),
            speed: speed?.toFixed(2)
        });
    }

    private handleError(error: GeolocationPositionError): void {
        console.error('[GPS] Error:', error.message);

        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('Permissão de localização negada. Ative nas configurações do navegador.');
                this.stopTracking();
                break;
            case error.POSITION_UNAVAILABLE:
                console.warn('[GPS] Position unavailable, retrying...');
                break;
            case error.TIMEOUT:
                console.warn('[GPS] Timeout, retrying...');
                break;
        }
    }

    private async saveToIndexedDB(): Promise<void> {
        try {
            if (this.track.length === 0) return;

            await addGPSPoints(this.track);
            console.log('[GPS] Saved', this.track.length, 'points to IndexedDB');

            // Limpar track local (já está salvo)
            this.track = [];
        } catch (error) {
            console.error('[GPS] Error saving to IndexedDB:', error);
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        // Haversine formula
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

    // Métodos auxiliares para cálculos
    calculateCurrentPace(): string | null {
        if (this.track.length < 2) return null;

        const recentPoints = this.track.slice(-10); // Últimos 10 pontos
        const distance = this.calculateTrackDistance(recentPoints);
        const time = (new Date(recentPoints[recentPoints.length - 1].timestamp).getTime() -
            new Date(recentPoints[0].timestamp).getTime()) / 1000; // segundos

        if (distance === 0 || time === 0) return null;

        const pace500m = (time / (distance / 500)); // segundos por 500m
        const minutes = Math.floor(pace500m / 60);
        const seconds = Math.floor(pace500m % 60);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    private calculateTrackDistance(points: GPSPoint[]): number {
        if (points.length < 2) return 0;

        let distance = 0;
        for (let i = 1; i < points.length; i++) {
            distance += this.calculateDistance(
                points[i - 1].lat,
                points[i - 1].lng,
                points[i].lat,
                points[i].lng
            );
        }

        return distance;
    }
}

// Singleton instance
let trackerInstance: GPSTracker | null = null;

export function getGPSTracker(workoutId: string, config?: Partial<GPSTrackerConfig>): GPSTracker {
    if (!trackerInstance || trackerInstance['workoutId'] !== workoutId) {
        trackerInstance = new GPSTracker(workoutId, config);
    }
    return trackerInstance;
}

export function destroyGPSTracker(): void {
    if (trackerInstance) {
        trackerInstance.stopTracking();
        trackerInstance = null;
    }
}
