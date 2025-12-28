'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        loadReservations();
    }, [filter]);

    async function loadReservations() {
        try {
            const params = new URLSearchParams();
            if (filter !== 'ALL') {
                params.append('status', filter);
            }

            const response = await fetch(`/api/reservations?${params}`);
            const data = await response.json();
            setReservations(data.reservations || []);
        } catch (error) {
            console.error('Error loading reservations:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCheckIn = async (id: string) => {
        try {
            const response = await fetch(`/api/reservations/${id}/check-in`, {
                method: 'POST'
            });

            if (response.ok) {
                alert('Check-in realizado com sucesso!');
                loadReservations();
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao fazer check-in');
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            alert('Erro ao fazer check-in');
        }
    };

    const statuses = [
        { value: 'ALL', label: 'Todas' },
        { value: 'CONFIRMED', label: 'Confirmadas' },
        { value: 'IN_USE', label: 'Em Uso' },
        { value: 'COMPLETED', label: 'Concluídas' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'IN_USE': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Minhas Reservas"
                subtitle="Gerenciar reservas"
                description="Check-in e check-out de recursos"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => setFilter(status.value)}
                            className="flex-shrink-0"
                        >
                            <Badge
                                className={`cursor-pointer transition-all ${filter === status.value
                                        ? 'bg-club-red text-white border-club-red'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {status.label}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* Lista de Reservas */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-white/60 py-12">
                            Carregando reservas...
                        </div>
                    ) : reservations.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">
                                Nenhuma reserva encontrada
                            </p>
                        </AnimatedCard>
                    ) : (
                        reservations.map((reservation, i) => (
                            <motion.div
                                key={reservation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                {reservation.resource.name}
                                            </h3>
                                            <div className="space-y-1 text-sm text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(reservation.startAt).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(reservation.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    {' - '}
                                                    {new Date(reservation.expectedEndAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                {reservation.resource.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        {reservation.resource.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(reservation.status)}>
                                            {reservation.status}
                                        </Badge>
                                    </div>

                                    {/* Ações */}
                                    {reservation.status === 'CONFIRMED' && (
                                        <Button
                                            onClick={() => handleCheckIn(reservation.id)}
                                            className="w-full bg-club-red hover:bg-club-red/90"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Fazer Check-in
                                        </Button>
                                    )}

                                    {reservation.status === 'IN_USE' && (
                                        <Button
                                            onClick={() => window.location.href = `/training/garage/checkout/${reservation.id}`}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Fazer Check-out
                                        </Button>
                                    )}

                                    {reservation.status === 'COMPLETED' && reservation.pointsEarned > 0 && (
                                        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
                                            +{reservation.pointsEarned} pontos ganhos
                                        </div>
                                    )}
                                </AnimatedCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
