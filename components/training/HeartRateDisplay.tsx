'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bluetooth, BluetoothOff, Wifi, WifiOff } from 'lucide-react';
import { useHeartRate } from '@/lib/bluetooth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HeartRateDisplayProps {
    showConnectButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function HeartRateDisplay({
    showConnectButton = true,
    size = 'md',
    className = ''
}: HeartRateDisplayProps) {
    const { bpm, isConnected, isSimulated, contactDetected, connect, startSimulation, disconnect } = useHeartRate();
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const success = await connect();
            if (!success) {
                // Fallback para simulação
                startSimulation();
            }
        } finally {
            setConnecting(false);
        }
    };

    // Tamanhos
    const sizes = {
        sm: { heart: 'w-6 h-6', text: 'text-2xl', label: 'text-xs' },
        md: { heart: 'w-8 h-8', text: 'text-4xl', label: 'text-sm' },
        lg: { heart: 'w-12 h-12', text: 'text-6xl', label: 'text-base' }
    };

    const s = sizes[size];

    // Calcular zona cardíaca
    const getZone = (bpm: number) => {
        if (bpm < 100) return { name: 'Descanso', color: 'text-blue-400', bg: 'bg-blue-400' };
        if (bpm < 120) return { name: 'Leve', color: 'text-green-400', bg: 'bg-green-400' };
        if (bpm < 140) return { name: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-400' };
        if (bpm < 160) return { name: 'Intenso', color: 'text-orange-400', bg: 'bg-orange-400' };
        return { name: 'Máximo', color: 'text-red-500', bg: 'bg-red-500' };
    };

    const zone = bpm > 0 ? getZone(bpm) : null;

    if (!isConnected) {
        return (
            <div className={`flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 ${className}`}>
                <BluetoothOff className="w-8 h-8 text-white/30 mb-2" />
                <p className="text-xs text-white/40 text-center mb-3">
                    Monitor cardíaco não conectado
                </p>
                {showConnectButton && (
                    <Button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="bg-club-red hover:bg-club-red/80 text-xs h-8"
                    >
                        {connecting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Bluetooth className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <>
                                <Bluetooth className="w-4 h-4 mr-1" />
                                Conectar
                            </>
                        )}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/20 p-4 ${className}`}>
            {/* Indicador de conexão */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
                {isSimulated ? (
                    <div className="flex items-center gap-1 text-yellow-400 text-[10px]">
                        <Wifi className="w-3 h-3" />
                        <span>SIM</span>
                    </div>
                ) : (
                    <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1 text-green-400 text-[10px]"
                    >
                        <Bluetooth className="w-3 h-3" />
                        <span>BLE</span>
                    </motion.div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Coração pulsante */}
                <motion.div
                    animate={bpm > 0 ? {
                        scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                        duration: 60 / Math.max(bpm, 60),
                        repeat: Infinity
                    }}
                >
                    <Heart className={`${s.heart} text-red-500 fill-red-500`} />
                </motion.div>

                {/* BPM */}
                <div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={bpm}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`${s.text} font-black text-white`}
                        >
                            {bpm || '--'}
                        </motion.div>
                    </AnimatePresence>
                    <div className={`${s.label} text-white/60`}>BPM</div>
                </div>

                {/* Zona */}
                {zone && (
                    <div className="ml-auto text-right">
                        <div className={`text-xs font-bold ${zone.color}`}>{zone.name}</div>
                        <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                    key={level}
                                    className={`w-2 h-1 rounded-full ${(bpm >= 60 + (level - 1) * 25) ? zone.bg : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Botão desconectar */}
            {showConnectButton && (
                <button
                    onClick={disconnect}
                    className="absolute bottom-2 right-2 text-white/30 hover:text-white/60 transition-colors"
                >
                    <BluetoothOff className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default HeartRateDisplay;
