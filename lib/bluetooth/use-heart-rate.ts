'use client';

import { useState, useEffect, useCallback } from 'react';
import { getHeartRateMonitor, HeartRateData } from './heart-rate';

interface UseHeartRateReturn {
    bpm: number;
    isConnected: boolean;
    isSimulated: boolean;
    contactDetected: boolean;
    connect: () => Promise<boolean>;
    startSimulation: () => void;
    disconnect: () => void;
}

export function useHeartRate(): UseHeartRateReturn {
    const [bpm, setBpm] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isSimulated, setIsSimulated] = useState(false);
    const [contactDetected, setContactDetected] = useState(false);

    useEffect(() => {
        const monitor = getHeartRateMonitor();

        monitor.onHeartRate((data: HeartRateData) => {
            setBpm(data.bpm);
            setContactDetected(data.contactDetected);
        });

        return () => {
            // Limpar ao desmontar
        };
    }, []);

    const connect = useCallback(async (): Promise<boolean> => {
        const monitor = getHeartRateMonitor();
        const success = await monitor.connect();

        if (success) {
            setIsConnected(true);
            setIsSimulated(monitor.isSimulatedMode());
        }

        return success;
    }, []);

    const startSimulation = useCallback(() => {
        const monitor = getHeartRateMonitor();
        monitor.startSimulation();
        setIsConnected(true);
        setIsSimulated(true);
    }, []);

    const disconnect = useCallback(() => {
        const monitor = getHeartRateMonitor();
        monitor.disconnect();
        setIsConnected(false);
        setIsSimulated(false);
        setBpm(0);
        setContactDetected(false);
    }, []);

    return {
        bpm,
        isConnected,
        isSimulated,
        contactDetected,
        connect,
        startSimulation,
        disconnect
    };
}
