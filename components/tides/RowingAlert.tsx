'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Waves, CheckCircle, AlertTriangle } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

interface RowingAlertProps {
    bestTime: string | null; // HH:mm format
    coefficient: number;
    windSpeed: number;
    waveHeight: number;
}

export const RowingAlert: React.FC<RowingAlertProps> = ({
    bestTime,
    coefficient,
    windSpeed,
    waveHeight
}) => {
    if (!bestTime) return null;

    // Calcular score de condições ideais (0-100)
    const coefficientScore = coefficient > 70 ? 50 : 100; // Prefere coeficiente menor
    const windScore = windSpeed < 15 ? 100 : windSpeed < 25 ? 70 : 40;
    const waveScore = waveHeight < 0.5 ? 100 : waveHeight < 1.0 ? 70 : 40;

    const score = Math.round((coefficientScore + windScore + waveScore) / 3);
    const isIdeal = score >= 70;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${isIdeal
                    ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30'
                    : 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isIdeal ? 'bg-green-500/20' : 'bg-yellow-500/20'
                    }`}>
                    {isIdeal ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    ) : (
                        <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-display text-xl text-white">
                            {isIdeal ? 'Condições Ideais para Remo!' : 'Condições Moderadas'}
                        </h4>
                        <div className="px-3 py-1 rounded-full bg-white/10">
                            <span className="text-sm font-mono text-white">{score}/100</span>
                        </div>
                    </div>

                    <p className="text-white/80 mb-4">
                        {isIdeal ? (
                            <>Excelente horário para treino: <strong>{bestTime}</strong>. Mar calmo e ventos favoráveis.</>
                        ) : (
                            <>Condições aceitáveis para treino: <strong>{bestTime}</strong>. Atenção às correntes e ventos.</>
                        )}
                    </p>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-gray-400 mb-1">Marés</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${coefficientScore > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${coefficientScore}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-white">{coefficientScore}</span>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-gray-400 mb-1">Ventos</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${windScore > 70 ? 'bg-green-500' : windScore > 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                        style={{ width: `${windScore}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-white">{windScore}</span>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-gray-400 mb-1">Ondas</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${waveScore > 70 ? 'bg-green-500' : waveScore > 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                        style={{ width: `${waveScore}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-white">{waveScore}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
