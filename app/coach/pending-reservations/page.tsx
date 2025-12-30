'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Anchor,
    User,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Reservation {
    id: string;
    userName: string;
    userAvatar: string;
    boatName: string;
    boatType: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    notes?: string;
}

// Dados simulados de reservas pendentes
const mockReservations: Reservation[] = [
    {
        id: '1',
        userName: 'João Silva',
        userAvatar: 'JS',
        boatName: 'Potengi I',
        boatType: 'Single Skiff',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startTime: '06:00',
        endTime: '07:30',
        status: 'PENDING',
        notes: 'Treino técnico individual'
    },
    {
        id: '2',
        userName: 'Maria Santos',
        userAvatar: 'MS',
        boatName: 'Natal',
        boatType: 'Quadruple',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startTime: '07:00',
        endTime: '09:00',
        status: 'PENDING',
        notes: 'Treino equipe feminina'
    },
    {
        id: '3',
        userName: 'Carlos Melo',
        userAvatar: 'CM',
        boatName: 'Potengi II',
        boatType: 'Double Scull',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        startTime: '16:00',
        endTime: '17:30',
        status: 'PENDING'
    },
    {
        id: '4',
        userName: 'Ana Beatriz',
        userAvatar: 'AB',
        boatName: 'Macaíba',
        boatType: 'Single Skiff',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startTime: '05:30',
        endTime: '07:00',
        status: 'PENDING',
        notes: 'Preparação para competição'
    }
];

export default function PendingReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>(mockReservations);

    const handleApprove = async (id: string) => {
        setReservations(prev => prev.map(r =>
            r.id === id ? { ...r, status: 'APPROVED' as const } : r
        ));
        // Aqui faria a chamada à API
    };

    const handleReject = async (id: string) => {
        setReservations(prev => prev.map(r =>
            r.id === id ? { ...r, status: 'REJECTED' as const } : r
        ));
        // Aqui faria a chamada à API
    };

    const pendingCount = reservations.filter(r => r.status === 'PENDING').length;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'APPROVED': return { label: 'Aprovada', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle };
            case 'REJECTED': return { label: 'Rejeitada', color: 'bg-red-500/20 text-red-400', icon: XCircle };
            default: return { label: 'Pendente', color: 'bg-amber-500/20 text-amber-400', icon: AlertCircle };
        }
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Anchor className="w-8 h-8 text-orange-400" />
                                Reservas Pendentes
                            </h1>
                            <p className="text-white/50">Aprovar ou rejeitar reservas de barcos</p>
                        </div>
                        {pendingCount > 0 && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-lg px-4 py-2">
                                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Lista de Reservas */}
                <div className="space-y-4">
                    {reservations.map((reservation, i) => {
                        const statusConfig = getStatusConfig(reservation.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                            <motion.div
                                key={reservation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard
                                    variant="glass"
                                    className={`p-6 ${reservation.status === 'PENDING' ? 'border-orange-500/30' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold">
                                                {reservation.userAvatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{reservation.userName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={statusConfig.color}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <div className="text-white/40 text-xs mb-1">Barco</div>
                                                <div className="text-white font-medium">{reservation.boatName}</div>
                                                <div className="text-white/50 text-xs">{reservation.boatType}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/40 text-xs mb-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Data
                                                </div>
                                                <div className="text-white font-medium">
                                                    {reservation.date.toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-white/40 text-xs mb-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Horário
                                                </div>
                                                <div className="text-white font-medium">
                                                    {reservation.startTime} - {reservation.endTime}
                                                </div>
                                            </div>
                                            {reservation.notes && (
                                                <div className="col-span-2 md:col-span-1">
                                                    <div className="text-white/40 text-xs mb-1">Notas</div>
                                                    <div className="text-white/70 text-xs">{reservation.notes}</div>
                                                </div>
                                            )}
                                        </div>

                                        {reservation.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                    onClick={() => handleReject(reservation.id)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Rejeitar
                                                </Button>
                                                <Button
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => handleApprove(reservation.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Aprovar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {reservations.length === 0 && (
                    <AnimatedCard variant="glass" className="p-12 text-center">
                        <Anchor className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white font-bold mb-2">Nenhuma reserva pendente</h3>
                        <p className="text-white/40">Novas reservas aparecerão aqui para aprovação</p>
                    </AnimatedCard>
                )}
            </div>
        </div>
    );
}
