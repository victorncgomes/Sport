'use client';

import { motion } from 'framer-motion';
import { Lock, Users, Trophy, Clock } from 'lucide-react';
import { BoatType, BoatLevel, BOAT_LEVEL_COLORS } from '@/lib/utils/boat-progression';

interface BoatCardProps {
    boat: BoatType;
    isUnlocked: boolean;
    progress?: number;
    missingCriteria?: string[];
    onClick?: () => void;
}

export function BoatCard({ boat, isUnlocked, progress = 0, missingCriteria = [], onClick }: BoatCardProps) {
    const levelColors = BOAT_LEVEL_COLORS[boat.level];

    return (
        <motion.div
            className={`
                relative rounded-xl overflow-hidden cursor-pointer
                ${isUnlocked
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/40'
                    : 'bg-white/5 border border-white/10'
                }
                transition-all duration-300
            `}
            whileHover={{
                y: isUnlocked ? -5 : 0,
                scale: isUnlocked ? 1.02 : 1
            }}
            onClick={onClick}
        >
            {/* Badge de nível */}
            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${levelColors.bg} ${levelColors.text}`}>
                {boat.level}
            </div>

            {/* Gráfico isométrico do barco */}
            <div className={`h-32 flex items-center justify-center ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                <BoatIsometricIcon boatId={boat.id} isUnlocked={isUnlocked} />
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                    {boat.displayName}
                </h3>

                <div className="flex items-center gap-3 text-sm text-white/60 mb-2">
                    <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {boat.crew}
                    </span>
                </div>

                <p className={`text-sm mb-3 ${isUnlocked ? 'text-white/70' : 'text-white/40'}`}>
                    {boat.description}
                </p>

                {/* Status de desbloqueio */}
                {isUnlocked ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Trophy className="w-4 h-4" />
                        <span>Desbloqueado</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Barra de progresso */}
                        <div>
                            <div className="flex justify-between text-xs text-white/40 mb-1">
                                <span>Progresso</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full bg-gradient-to-r ${boat.level === 'ELITE'
                                            ? 'from-yellow-500 to-orange-500'
                                            : 'from-blue-500 to-purple-500'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Critérios faltando */}
                        {missingCriteria.length > 0 && (
                            <div className="space-y-1">
                                {missingCriteria.slice(0, 2).map((criteria, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                                        <Lock className="w-3 h-3" />
                                        <span>{criteria}</span>
                                    </div>
                                ))}
                                {missingCriteria.length > 2 && (
                                    <span className="text-xs text-white/30">
                                        +{missingCriteria.length - 2} mais
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Overlay de bloqueado */}
            {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white/50" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// Ícones isométricos dos barcos
function BoatIsometricIcon({ boatId, isUnlocked }: { boatId: string; isUnlocked: boolean }) {
    const color = isUnlocked ? '#ef4444' : '#6b7280';
    const accent = isUnlocked ? '#dc2626' : '#4b5563';

    // SVG simplificado para cada tipo de barco
    const getBoatSVG = () => {
        switch (boatId) {
            case 'TANQUE':
                return (
                    <svg viewBox="0 0 100 60" className="w-24 h-16">
                        <rect x="10" y="20" width="80" height="30" rx="5" fill={color} opacity="0.8" />
                        <ellipse cx="50" cy="20" rx="40" ry="8" fill={accent} />
                        <path d="M20 35 L35 25 L35 45 Z" fill="white" opacity="0.3" />
                    </svg>
                );
            case 'CANOE':
            case 'DOUBLE_CANOE':
                return (
                    <svg viewBox="0 0 120 40" className="w-28 h-12">
                        <path d="M5 20 Q60 5 115 20 Q60 35 5 20" fill={color} />
                        <path d="M20 18 L100 18" stroke={accent} strokeWidth="2" />
                        <circle cx="50" cy="18" r="3" fill="white" opacity="0.5" />
                        {boatId === 'DOUBLE_CANOE' && (
                            <circle cx="70" cy="18" r="3" fill="white" opacity="0.5" />
                        )}
                    </svg>
                );
            case 'SINGLE_SKIFF':
            case 'DOUBLE_SKIFF':
                return (
                    <svg viewBox="0 0 140 35" className="w-32 h-10">
                        <path d="M0 17 Q70 0 140 17 Q70 34 0 17" fill={color} />
                        <line x1="0" y1="17" x2="140" y2="17" stroke={accent} strokeWidth="1" />
                        <circle cx="70" cy="15" r="4" fill="white" opacity="0.5" />
                        {boatId === 'DOUBLE_SKIFF' && (
                            <circle cx="95" cy="15" r="4" fill="white" opacity="0.5" />
                        )}
                    </svg>
                );
            case 'OITO':
                return (
                    <svg viewBox="0 0 160 35" className="w-36 h-10">
                        <path d="M0 17 Q80 0 160 17 Q80 34 0 17" fill={color} />
                        {[20, 35, 50, 65, 80, 95, 110, 125].map((x, i) => (
                            <circle key={i} cx={x} cy="15" r="3" fill="white" opacity="0.5" />
                        ))}
                        <circle cx="145" cy="17" r="4" fill={accent} />
                    </svg>
                );
            case 'FOUR_SKIFF':
            case 'QUATRO_SEM':
                return (
                    <svg viewBox="0 0 150 35" className="w-34 h-10">
                        <path d="M0 17 Q75 0 150 17 Q75 34 0 17" fill={color} />
                        {[35, 55, 75, 95].map((x, i) => (
                            <circle key={i} cx={x} cy="15" r="4" fill="white" opacity="0.5" />
                        ))}
                        {boatId === 'FOUR_SKIFF' && (
                            <circle cx="125" cy="17" r="4" fill={accent} />
                        )}
                    </svg>
                );
            case 'DOIS_SEM':
                return (
                    <svg viewBox="0 0 130 35" className="w-30 h-10">
                        <path d="M0 17 Q65 0 130 17 Q65 34 0 17" fill={color} />
                        <circle cx="50" cy="15" r="4" fill="white" opacity="0.5" />
                        <circle cx="80" cy="15" r="4" fill="white" opacity="0.5" />
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 100 40" className="w-24 h-12">
                        <ellipse cx="50" cy="20" rx="45" ry="15" fill={color} />
                    </svg>
                );
        }
    };

    return (
        <motion.div
            animate={isUnlocked ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
            {getBoatSVG()}
        </motion.div>
    );
}
