'use client';

import React, { useState } from 'react';
import { Boat } from '@/lib/data/garage-boats';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Ship, User, X } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion, AnimatePresence } from 'framer-motion';

interface ReservationModalProps {
    boat: Boat | null;
    onClose: () => void;
}

export function ReservationModal({ boat, onClose }: ReservationModalProps) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!boat) return null;

    const handleReserve = () => {
        setStep(2);
        // Simulate API call
        setTimeout(() => {
            setStep(3);
        }, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg"
                    onClick={e => e.stopPropagation()}
                >
                    <AnimatedCard variant="metal" className="overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Ship className="w-5 h-5 text-club-gold" />
                                    Agendar Saída
                                </h3>
                                <p className="text-sm text-white/50">
                                    Reserva do barco: <span className="text-club-gold font-bold">{boat.name}</span>
                                </p>
                            </div>
                            <button onClick={onClose} className="text-white/50 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {step === 1 && (
                                <div className="space-y-6">
                                    {/* Info Resumida */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs text-white/40 block">Categoria</span>
                                            <span className="text-sm font-bold text-white uppercase">{boat.category} ({boat.type})</span>
                                        </div>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs text-white/40 block">Nível Requerido</span>
                                            <span className="text-sm font-bold text-white uppercase">{boat.skillLevel}</span>
                                        </div>
                                    </div>

                                    {/* Date Selection */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/70 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-club-gold" />
                                                Data da Saída
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-club-gold/50"
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm text-white/70 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-club-gold" />
                                                Horário de Saída
                                            </label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-club-gold/50"
                                                onChange={(e) => setTime(e.target.value)}
                                            >
                                                <option value="" className="bg-gray-900">Selecione um horário</option>
                                                <option value="05:00" className="bg-gray-900">05:00 - Nascer do Sol</option>
                                                <option value="06:00" className="bg-gray-900">06:00</option>
                                                <option value="07:00" className="bg-gray-900">07:00</option>
                                                <option value="15:00" className="bg-gray-900">15:00</option>
                                                <option value="16:00" className="bg-gray-900">16:00</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-club-gold hover:bg-club-gold-light text-black font-bold h-12"
                                        disabled={!date || !time}
                                        onClick={handleReserve}
                                    >
                                        Confirmar Reserva
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-club-gold border-t-transparent rounded-full animate-spin" />
                                    <p className="text-white/70">Processando sua reserva...</p>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-scale-in">
                                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                                        <Ship className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Agendamento Confirmado!</h3>
                                    <p className="text-white/60 max-w-xs mx-auto mb-6">
                                        Seu barco <strong>{boat.name}</strong> está reservado para {date} às {time}.
                                    </p>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-full mb-6 text-left">
                                        <h4 className="text-xs font-bold text-white/40 uppercase mb-2">Próximos Passos</h4>
                                        <ul className="space-y-2 text-sm text-white/70">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-club-gold" />
                                                Chegue 15min antes para preparar o barco.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-club-gold" />
                                                Assine o livro de saída na secretaria.
                                            </li>
                                        </ul>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        className="w-full"
                                    >
                                        Fechar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </AnimatedCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
