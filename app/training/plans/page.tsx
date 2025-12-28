'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WorkoutPlansPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        loadTemplates();
    }, [filter]);

    async function loadTemplates() {
        try {
            const params = new URLSearchParams();
            if (filter !== 'ALL') {
                params.append('type', filter);
            }

            const response = await fetch(`/api/workouts/templates?${params}`);
            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    }

    const types = [
        { value: 'ALL', label: 'Todos' },
        { value: 'TECHNIQUE', label: 'Técnica' },
        { value: 'BASE', label: 'Base' },
        { value: 'INTERVALS', label: 'Intervalos' },
        { value: 'RECOVERY', label: 'Recuperação' },
        { value: 'INDOOR_TANK', label: 'Tanque' }
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Planilhas de Treino"
                subtitle="Treinos aprovados pelos treinadores"
                description="Escolha um treino e comece agora"
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

                {/* Lista de Templates */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-white/60 py-12">
                            Carregando planilhas...
                        </div>
                    ) : templates.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">
                                Nenhuma planilha encontrada para este filtro
                            </p>
                        </AnimatedCard>
                    ) : (
                        templates.map((template, i) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-white">
                                                    {template.title}
                                                </h3>
                                                <Badge className="text-[10px] font-black uppercase bg-club-red/20 text-club-red border-club-red/30">
                                                    {template.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-white/60">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {template.duration} min
                                                </span>
                                                {template.distance && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {(template.distance / 1000).toFixed(1)} km
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {template.stages?.length || 0} etapas
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                                    </div>

                                    {/* Etapas */}
                                    {template.stages && template.stages.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {template.stages.slice(0, 3).map((stage: any) => (
                                                <div
                                                    key={stage.id}
                                                    className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-2"
                                                >
                                                    <span className="text-white/80">{stage.name}</span>
                                                    <span className="text-white/40">
                                                        {stage.duration} min · {stage.intensity}
                                                    </span>
                                                </div>
                                            ))}
                                            {template.stages.length > 3 && (
                                                <p className="text-xs text-white/40 text-center">
                                                    +{template.stages.length - 3} etapas
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <Link href={`/training/start?templateId=${template.id}`}>
                                        <Button className="w-full bg-club-red/20 hover:bg-club-red/30 text-club-red border border-club-red/30">
                                            Usar esta Planilha
                                        </Button>
                                    </Link>
                                </AnimatedCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
