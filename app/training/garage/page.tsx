'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Anchor, Users, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GaragePage() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        loadResources();
    }, [filter]);

    async function loadResources() {
        try {
            const params = new URLSearchParams();
            if (filter !== 'ALL') {
                params.append('type', filter);
            }

            const response = await fetch(`/api/resources?${params}`);
            const data = await response.json();
            setResources(data.resources || []);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    }

    const types = [
        { value: 'ALL', label: 'Todos' },
        { value: 'BOAT', label: 'Barcos' },
        { value: 'TANK', label: 'Tanque' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'RESERVED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'IN_USE': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'MAINTENANCE': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'Disponível';
            case 'RESERVED': return 'Reservado';
            case 'IN_USE': return 'Em Uso';
            case 'MAINTENANCE': return 'Manutenção';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Garagem"
                subtitle="Sport Club de Natal"
                description="Reserve barcos e equipamentos"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {types.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setFilter(type.value)}
                            className="flex-shrink-0"
                        >
                            <Badge
                                className={`cursor-pointer transition-all ${filter === type.value
                                        ? 'bg-club-red text-white border-club-red'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {type.label}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* Minhas Reservas */}
                <Link href="/training/garage/my-reservations">
                    <AnimatedCard variant="gradient" className="p-4 mb-6 hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Minhas Reservas</p>
                                    <p className="text-white/60 text-sm">Ver reservas ativas</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40" />
                        </div>
                    </AnimatedCard>
                </Link>

                {/* Lista de Recursos */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-white/60 py-12">
                            Carregando recursos...
                        </div>
                    ) : resources.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">
                                Nenhum recurso encontrado
                            </p>
                        </AnimatedCard>
                    ) : (
                        resources.map((resource, i) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/training/garage/${resource.id}`}>
                                    <AnimatedCard variant="glass" className="p-5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Anchor className="w-5 h-5 text-club-red" />
                                                    <h3 className="text-lg font-bold text-white">
                                                        {resource.name}
                                                    </h3>
                                                </div>
                                                {resource.category && (
                                                    <p className="text-white/60 text-sm mb-2">
                                                        {resource.category}
                                                    </p>
                                                )}
                                                <p className="text-white/40 text-sm line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(resource.status)}>
                                                {getStatusLabel(resource.status)}
                                            </Badge>
                                        </div>

                                        {/* Estatísticas */}
                                        <div className="flex items-center gap-4 text-xs text-white/40">
                                            <span>{resource._count?.reservations || 0} reservas</span>
                                            {resource._count?.waitlist > 0 && (
                                                <span className="text-orange-400">
                                                    {resource._count.waitlist} na fila
                                                </span>
                                            )}
                                            {resource._count?.maintenanceTickets > 0 && (
                                                <span className="flex items-center gap-1 text-red-400">
                                                    <Wrench className="w-3 h-3" />
                                                    {resource._count.maintenanceTickets}
                                                </span>
                                            )}
                                        </div>
                                    </AnimatedCard>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
