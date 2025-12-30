// Web Bluetooth API - Heart Rate Monitor
// Sport Club de Natal - Preparação para Wearables

// Declarações de tipos para Web Bluetooth API (experimental)
declare global {
    interface Navigator {
        bluetooth?: {
            requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
        };
    }

    interface RequestDeviceOptions {
        filters?: Array<{ services?: number[] }>;
        optionalServices?: number[];
    }

    interface BluetoothDevice {
        gatt?: BluetoothRemoteGATTServer;
        addEventListener(type: string, listener: () => void): void;
    }

    interface BluetoothRemoteGATTServer {
        connected: boolean;
        connect(): Promise<BluetoothRemoteGATTServer>;
        disconnect(): void;
        getPrimaryService(service: number): Promise<BluetoothRemoteGATTService>;
    }

    interface BluetoothRemoteGATTService {
        getCharacteristic(characteristic: number): Promise<BluetoothRemoteGATTCharacteristic>;
    }

    interface BluetoothRemoteGATTCharacteristic {
        value?: DataView;
        startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
        stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
        addEventListener(type: string, listener: (event: Event) => void): void;
    }
}

const HEART_RATE_SERVICE = 0x180D;
const HEART_RATE_MEASUREMENT = 0x2A37;

interface HeartRateData {
    bpm: number;
    contactDetected: boolean;
    energyExpended?: number;
    rrIntervals?: number[];
}

type HeartRateCallback = (data: HeartRateData) => void;

class HeartRateMonitor {
    private device: BluetoothDevice | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
    private callback: HeartRateCallback | null = null;
    private isSimulated: boolean = false;
    private simulationInterval: NodeJS.Timeout | null = null;

    async connect(): Promise<boolean> {
        // Verificar se Web Bluetooth está disponível
        if (!navigator.bluetooth) {
            console.warn('Web Bluetooth não disponível, usando modo simulado');
            this.isSimulated = true;
            return true;
        }

        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [HEART_RATE_SERVICE] }],
                optionalServices: [HEART_RATE_SERVICE]
            });

            if (!this.device.gatt) {
                throw new Error('GATT não disponível');
            }

            const server = await this.device.gatt.connect();
            const service = await server.getPrimaryService(HEART_RATE_SERVICE);
            this.characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT);

            // Configurar notificações
            await this.characteristic.startNotifications();
            this.characteristic.addEventListener('characteristicvaluechanged', this.handleHeartRate.bind(this));

            // Monitorar desconexão
            this.device.addEventListener('gattserverdisconnected', () => {
                console.log('Monitor cardíaco desconectado');
                this.disconnect();
            });

            return true;
        } catch (error) {
            console.error('Erro ao conectar:', error);
            return false;
        }
    }

    startSimulation() {
        this.isSimulated = true;

        // Simular batimentos cardíacos realistas
        let baseBpm = 65;
        let trend = 0;

        this.simulationInterval = setInterval(() => {
            // Variação natural
            trend += (Math.random() - 0.5) * 2;
            trend = Math.max(-10, Math.min(10, trend));

            const bpm = Math.round(baseBpm + trend + (Math.random() - 0.5) * 4);

            if (this.callback) {
                this.callback({
                    bpm: Math.max(50, Math.min(180, bpm)),
                    contactDetected: true
                });
            }
        }, 1000);
    }

    private handleHeartRate(event: Event) {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;

        if (!value) return;

        // Parsear dados do Heart Rate Measurement
        const flags = value.getUint8(0);
        const is16bit = (flags & 0x01) !== 0;
        const hasContact = (flags & 0x06) !== 0;
        const contactDetected = (flags & 0x02) !== 0;
        const hasEnergy = (flags & 0x08) !== 0;
        const hasRR = (flags & 0x10) !== 0;

        let offset = 1;
        const bpm = is16bit ? value.getUint16(offset, true) : value.getUint8(offset);
        offset += is16bit ? 2 : 1;

        let energyExpended: number | undefined;
        if (hasEnergy) {
            energyExpended = value.getUint16(offset, true);
            offset += 2;
        }

        const rrIntervals: number[] = [];
        if (hasRR) {
            while (offset < value.byteLength) {
                rrIntervals.push(value.getUint16(offset, true));
                offset += 2;
            }
        }

        if (this.callback) {
            this.callback({
                bpm,
                contactDetected: hasContact ? contactDetected : true,
                energyExpended,
                rrIntervals: rrIntervals.length > 0 ? rrIntervals : undefined
            });
        }
    }

    onHeartRate(callback: HeartRateCallback) {
        this.callback = callback;
    }

    disconnect() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }

        if (this.characteristic) {
            this.characteristic.stopNotifications().catch(() => { });
            this.characteristic = null;
        }

        if (this.device?.gatt?.connected) {
            this.device.gatt.disconnect();
        }

        this.device = null;
        this.callback = null;
        this.isSimulated = false;
    }

    isConnected(): boolean {
        return this.isSimulated || (this.device?.gatt?.connected ?? false);
    }

    isSimulatedMode(): boolean {
        return this.isSimulated;
    }
}

// Singleton
let hrMonitor: HeartRateMonitor | null = null;

export function getHeartRateMonitor(): HeartRateMonitor {
    if (!hrMonitor) {
        hrMonitor = new HeartRateMonitor();
    }
    return hrMonitor;
}

export type { HeartRateData, HeartRateCallback };
export { HeartRateMonitor };
