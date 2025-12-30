'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Settings,
    Ship,
    Users,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Edit2,
    Calendar,
    Clock,
    Anchor,
    X,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoatData {
    id: string;
    name: string;
    type: string;
    capacity: number;
    status: 'AVAILABLE' | 'MAINTENANCE' | 'RESERVED' | 'IN_USE';
    configuration: string;
    lastMaintenance: string;
    notes?: string;
}

const mockBoats: BoatData[] = [
    { id: '1', name: 'Potengi I', type: 'Single Skiff', capacity: 1, status: 'AVAILABLE', configuration: '1x - Single Sculling', lastMaintenance: '2025-01-10', notes: 'Estado perfeito' },
    { id: '2', name: 'Potengi II', type: 'Double Skiff', capacity: 2, status: 'IN_USE', configuration: '2x - Double Sculling', lastMaintenance: '2025-01-05' },
    { id: '3', name: 'Natal', type: 'Quadruple', capacity: 4, status: 'AVAILABLE', configuration: '4x - Quad Sculling', lastMaintenance: '2024-12-20' },
    { id: '4', name: 'Macaíba', type: 'Eight', capacity: 8, status: 'MAINTENANCE', configuration: '8+ - Eight with Cox', lastMaintenance: '2024-12-01', notes: 'Reparo no banco 3' },
    { id: '5', name: 'Pitimbu', type: 'Double', capacity: 2, status: 'AVAILABLE', configuration: '2- - Coxless Pair', lastMaintenance: '2025-01-12' },
    { id: '6', name: 'Jundiaí', type: 'Single Skiff', capacity: 1, status: 'RESERVED', configuration: '1x - Single Sculling', lastMaintenance: '2025-01-08' },
];

interface ReservationData {
    id: string;
    boat: string;
    user: string;
    date: string;
    time: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

const mockReservations: ReservationData[] = [
    { id: '1', boat: 'Potengi I', user: 'João Silva', date: '2025-01-02', time: '06:00 - 07:30', status: 'CONFIRMED' },
    { id: '2', boat: 'Natal', user: 'Equipe Júnior', date: '2025-01-02', time: '08:00 - 10:00', status: 'CONFIRMED' },
    { id: '3', boat: 'Potengi II', user: 'Ana & Bia', date: '2025-01-02', time: '16:00 - 17:30', status: 'PENDING' },
    { id: '4', boat: 'Pitimbu', user: 'Carlos Mendes', date: '2025-01-03', time: '07:00 - 08:30', status: 'CONFIRMED' },
];

const statusConfig = {
    AVAILABLE: { label: 'Disponível', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    MAINTENANCE: { label: 'Em Manutenção', color: 'bg-amber-500/20 text-amber-400', icon: Wrench },
    RESERVED: { label: 'Reservado', color: 'bg-blue-500/20 text-blue-400', icon: Calendar },
    IN_USE: { label: 'Em Uso', color: 'bg-purple-500/20 text-purple-400', icon: Ship },
};

const resStatusConfig = {
    CONFIRMED: { label: 'Confirmada', color: 'bg-emerald-500/20 text-emerald-400' },
    PENDING: { label: 'Pendente', color: 'bg-amber-500/20 text-amber-400' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400' },
};

export default function CoachAjustesPage() {
    const [boats, setBoats] = useState<BoatData[]>(mockBoats);
    const [reservations] = useState<ReservationData[]>(mockReservations);
    const [activeTab, setActiveTab] = useState<'boats' | 'reservations'>('boats');
    const [editingBoat, setEditingBoat] = useState<BoatData | null>(null);

    const handleStatusChange = (boatId: string, newStatus: BoatData['status']) => {
        setBoats(boats.map(b =>
            b.id === boatId ? { ...b, status: newStatus } : b
        ));
    };

    const handleSaveBoat = () => {
        if (editingBoat) {
            setBoats(boats.map(b =>
                b.id === editingBoat.id ? editingBoat : b
            ));
            setEditingBoat(null);
        }
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Settings className="w-8 h-8 text-blue-500" />
                                Ajustes e Configurações
                            </h1>
                            <p className="text-white/50">Gerencie barcos, reservas e configurações de treino</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'boats' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('boats')}
                        className={`gap-2 text-xs font-bold uppercase tracking-widest ${activeTab === 'boats'
                                ? 'bg-club-red hover:bg-club-red/90'
                                : 'border-white/20 text-white/60 hover:text-white'
                            }`}
                    >
                        <Ship className="w-4 h-4" />
                        Barcos ({boats.length})
                    </Button>
                    <Button
                        variant={activeTab === 'reservations' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('reservations')}
                        className={`gap-2 text-xs font-bold uppercase tracking-widest ${activeTab === 'reservations'
                                ? 'bg-club-red hover:bg-club-red/90'
                                : 'border-white/20 text-white/60 hover:text-white'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Reservas ({reservations.length})
                    </Button>
                </div>

                {/* Boats Tab */}
                {activeTab === 'boats' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {boats.map((boat, i) => {
                            const StatusIcon = statusConfig[boat.status].icon;
                            return (
                                <motion.div
                                    key={boat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <AnimatedCard variant="glass" className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-club-red/20 flex items-center justify-center">
                                                    <Anchor className="w-5 h-5 text-club-red" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{boat.name}</h3>
                                                    <p className="text-xs text-white/40">{boat.type}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setEditingBoat(boat)}
                                            >
                                                <Edit2 className="w-4 h-4 text-white/50" />
                                            </Button>
                                        </div>

                                        <Badge className={`${statusConfig[boat.status].color} border-0 flex items-center gap-1 w-fit mb-3`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig[boat.status].label}
                                        </Badge>

                                        <div className="space-y-1 text-xs text-white/50">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3 h-3" />
                                                {boat.capacity} remadores
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-3 h-3" />
                                                {boat.configuration}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Wrench className="w-3 h-3" />
                                                Última manutenção: {new Date(boat.lastMaintenance).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>

                                        {boat.notes && (
                                            <div className="mt-3 p-2 bg-white/5 rounded-lg text-xs text-white/40 italic">
                                                {boat.notes}
                                            </div>
                                        )}

                                        {/* Quick Status Change */}
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`flex-1 text-[10px] ${boat.status === 'MAINTENANCE' ? 'border-amber-500 text-amber-500' : 'border-white/20 text-white/50'}`}
                                                onClick={() => handleStatusChange(boat.id, boat.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE')}
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {boat.status === 'MAINTENANCE' ? 'Liberar' : 'Manutenção'}
                                            </Button>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Reservations Tab */}
                {activeTab === 'reservations' && (
                    <div className="space-y-3">
                        {reservations.map((res, i) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    {new Date(res.date).getDate()}
                                                </span>
                                                <span className="text-[10px] text-white/40 uppercase">
                                                    {new Date(res.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{res.boat}</h3>
                                                <div className="flex items-center gap-3 text-xs text-white/50">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {res.user}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {res.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={`${resStatusConfig[res.status].color} border-0`}>
                                                {resStatusConfig[res.status].label}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingBoat && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setEditingBoat(null)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative z-10"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Editar {editingBoat.name}</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingBoat(null)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Configuração</label>
                                        <select
                                            value={editingBoat.configuration}
                                            onChange={e => setEditingBoat({ ...editingBoat, configuration: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="1x - Single Sculling">1x - Single Sculling</option>
                                            <option value="2x - Double Sculling">2x - Double Sculling</option>
                                            <option value="2- - Coxless Pair">2- - Coxless Pair (2 sem)</option>
                                            <option value="4x - Quad Sculling">4x - Quad Sculling</option>
                                            <option value="4- - Coxless Four">4- - Coxless Four</option>
                                            <option value="8+ - Eight with Cox">8+ - Eight with Cox</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Status</label>
                                        <select
                                            value={editingBoat.status}
                                            onChange={e => setEditingBoat({ ...editingBoat, status: e.target.value as BoatData['status'] })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="AVAILABLE">Disponível</option>
                                            <option value="MAINTENANCE">Em Manutenção</option>
                                            <option value="RESERVED">Reservado</option>
                                            <option value="IN_USE">Em Uso</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Observações</label>
                                        <textarea
                                            value={editingBoat.notes || ''}
                                            onChange={e => setEditingBoat({ ...editingBoat, notes: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                                            placeholder="Notas sobre o barco..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setEditingBoat(null)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-club-red hover:bg-club-red/90 gap-2"
                                        onClick={handleSaveBoat}
                                    >
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
