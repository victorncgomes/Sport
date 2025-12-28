'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyReservationsPage() {

    // Mock data (será substituído por API)
    const reservations = [
        {
            id: '1',
            boat: {
                id: '1',
                name: 'Single 1',
                category: 'Single',
                location: 'Garagem Principal'
            },
            startTime: '2025-12-28T08:00:00',
            endTime: '2025-12-28T10:00:00',
            status: 'CONFIRMED',
            createdAt: '2025-12-27T15:00:00'
        },
        {
            id: '2',
            boat: {
                id: '2',
                name: 'Double 1',
                category: 'Double',
                location: 'Garagem Principal'
            },
            startTime: '2025-12-30T07:00:00',
            endTime: '2025-12-30T09:00:00',
            status: 'PENDING',
            createdAt: '2025-12-27T14:30:00'
        }
    ];

    const statusLabels = {
        PENDING: 'Pendente',
        CONFIRMED: 'Confirmada',
        IN_USE: 'Em uso',
        COMPLETED: 'Concluída',
        CANCELLED: 'Cancelada'
    };

    const statusIcons = {
        PENDING: AlertCircle,
        CONFIRMED: CheckCircle2,
        IN_USE: Clock,
        COMPLETED: CheckCircle2,
        CANCELLED: XCircle
    };

    const statusColors = {
        PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        CONFIRMED: 'bg-green-500/20 text-green-300 border-green-500/30',
        IN_USE: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        COMPLETED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Calendar className="h-8 w-8 text-blue-400 mb-2" />
                    <h1 className="font-display text-4xl font-bold text-white mb-2">
                        Minhas Reservas
                    </h1>
                    <p className="text-white/60">
                        Gerencie suas reservas de embarcações
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Reservations List */}
                {reservations.length > 0 ? (
                    <div className="space-y-4">
                        {reservations.map((reservation, index) => {
                            const StatusIcon = statusIcons[reservation.status as keyof typeof statusIcons];
                            const startDate = new Date(reservation.startTime);
                            const endDate = new Date(reservation.endTime);

                            return (
                                <motion.div
                                    key={reservation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-display text-2xl font-bold text-white mb-1">
                                                {reservation.boat.name}
                                            </h3>
                                            <p className="text-white/60 text-sm">
                                                {reservation.boat.category}
                                            </p>
                                        </div>

                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5",
                                            statusColors[reservation.status as keyof typeof statusColors]
                                        )}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {statusLabels[reservation.status as keyof typeof statusLabels]}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {/* Data/Hora - display: flex-col com ícone à esquerda */}
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-white/40 mb-1">Data e Horário</p>
                                                <p className="text-white font-semibold">
                                                    {startDate.toLocaleDateString('pt-BR')}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Localização */}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-white/40 mb-1">Localização</p>
                                                <p className="text-white font-semibold">
                                                    {reservation.boat.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {reservation.status === 'CONFIRMED' && (
                                        <div className="flex gap-3 pt-4 border-t border-white/10">
                                            <button className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-all duration-200 text-sm">
                                                Cancelar Reserva
                                            </button>
                                            <button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all duration-200 text-sm">
                                                Iniciar Uso
                                            </button>
                                        </div>
                                    )}

                                    {reservation.status === 'IN_USE' && (
                                        <div className="pt-4 border-t border-white/10">
                                            <button className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold text-white transition-all duration-200">
                                                Finalizar Uso
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                        <Calendar className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60 text-lg mb-2">
                            Você ainda não tem reservas
                        </p>
                        <p className="text-white/40 text-sm">
                            Acesse a Garagem para reservar uma embarcação
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
