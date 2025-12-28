'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Boat {
    id: string;
    name: string;
    type: string;
    status: string;
    capacity: number;
    description?: string;
    imageUrl?: string;
}

export default function GaragePage() {
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [boats, setBoats] = useState<Boat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBoats() {
            try {
                const response = await fetch('/api/boats');
                if (response.ok) {
                    const data = await response.json();
                    setBoats(data);
                }
            } catch (error) {
                console.error('Error fetching boats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBoats();
    }, []);

    const statusLabels: Record<string, string> = {
        AVAILABLE: 'Disponível',
        RESERVED: 'Reservado',
        IN_USE: 'Em uso',
        MAINTENANCE: 'Manutenção',
        BLOCKED: 'Bloqueado'
    };

    const statusColors: Record<string, string> = {
        AVAILABLE: 'bg-green-500/20 text-green-300 border-green-500/30',
        RESERVED: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        IN_USE: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        MAINTENANCE: 'bg-red-500/20 text-red-300 border-red-500/30',
        BLOCKED: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    const filteredBoats = boats.filter(boat => {
        if (filterStatus !== 'all' && boat.status !== filterStatus) return false;
        if (filterType !== 'all' && boat.type !== filterType) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Anchor className="h-16 w-16 text-blue-400 animate-pulse mx-auto mb-4" />
                    <p className="text-white/60">Carregando embarcações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
            {/* Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Anchor className="h-8 w-8 text-blue-400" />
                        <h1 className="font-display text-4xl font-bold text-white">
                            Garagem
                        </h1>
                    </div>
                    <p className="text-white/60">
                        Reserve embarcações para seus treinos
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="all">Todos</option>
                            <option value="AVAILABLE">Disponíveis</option>
                            <option value="RESERVED">Reservados</option>
                            <option value="MAINTENANCE">Manutenção</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Tipo</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="all">Todos</option>
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                            <option value="QUAD">Quad</option>
                            <option value="EIGHT">Eight</option>
                        </select>
                    </div>
                </div>

                {/* Boats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBoats.map((boat, index) => (
                        <motion.div
                            key={boat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                        >
                            {/* Image */}
                            <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-cyan-900/20 relative overflow-hidden">
                                {boat.imageUrl ? (
                                    <img
                                        src={boat.imageUrl}
                                        alt={boat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Anchor className="h-16 w-16 text-white/20" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md",
                                        statusColors[boat.status] || statusColors.AVAILABLE
                                    )}>
                                        {statusLabels[boat.status] || boat.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-display text-2xl font-bold text-white mb-2">
                                    {boat.name}
                                </h3>

                                <p className="text-white/60 text-sm mb-4">
                                    {boat.description || `Barco tipo ${boat.type}`}
                                </p>

                                {/* Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <span>Capacidade: {boat.capacity} pessoa(s)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <span>Tipo: {boat.type}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {boat.status === 'AVAILABLE' && (
                                    <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50">
                                        Reservar
                                    </button>
                                )}

                                {boat.status === 'MAINTENANCE' && (
                                    <div className="flex items-center gap-2 justify-center py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-sm font-semibold">Em manutenção</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredBoats.length === 0 && (
                    <div className="text-center py-16">
                        <Anchor className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60 text-lg">
                            Nenhuma embarcação encontrada com os filtros selecionados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
