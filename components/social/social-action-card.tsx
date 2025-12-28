'use client';

import React from 'react';
import { SocialAction } from '@/lib/data/social-actions';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Heart, Hammer, Megaphone, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialActionCardProps {
    action: SocialAction;
    onJoin: (action: SocialAction) => void;
}

export function SocialActionCard({ action, onJoin }: SocialActionCardProps) {
    const typeConfig = {
        voluntariado: { icon: Heart, label: 'Voluntariado', color: 'text-red-500', bg: 'bg-red-500/10' },
        tarefa: { icon: Hammer, label: 'Tarefa', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        campanha: { icon: Megaphone, label: 'Campanha', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    };

    const statusConfig = {
        aberto: { label: 'Inscrições Abertas', color: 'text-green-500' },
        'em-progresso': { label: 'Em Andamento', color: 'text-blue-400' },
        concluido: { label: 'Finalizado', color: 'text-gray-500' },
        cancelado: { label: 'Cancelado', color: 'text-red-500' },
    };

    const Config = typeConfig[action.type];
    const Status = statusConfig[action.status];

    const progress = (action.volunteersRegistered / action.volunteersNeeded) * 100;

    return (
        <AnimatedCard variant="metal" hover="lift" className="flex flex-col h-full h-full">
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2", Config.bg, Config.color)}>
                        <Config.icon className="w-3 h-3" />
                        {Config.label}
                    </div>
                    <span className="text-xs font-bold text-club-gold">{action.points} pts</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{action.title}</h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-3">{action.description}</p>

                <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-white/60">
                        <Calendar className="w-4 h-4 text-club-gold" />
                        {new Date(action.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                        <MapPin className="w-4 h-4 text-club-gold" />
                        {action.location}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                        <Users className="w-4 h-4 text-club-gold" />
                        {action.volunteersRegistered} / {action.volunteersNeeded} inscritos
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500",
                            progress >= 100 ? "bg-green-500" : "bg-club-gold"
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            <div className="p-5 pt-0 mt-auto">
                <Button
                    className={cn("w-full transition-all gap-2",
                        action.status === 'aberto' ? "bg-club-red hover:bg-red-700 text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
                    )}
                    disabled={action.status !== 'aberto'}
                    onClick={() => onJoin(action)}
                >
                    {action.status === 'aberto' ? (
                        <>Quero Ajudar <CheckCircle2 className="w-4 h-4" /></>
                    ) : (
                        Status.label
                    )}
                </Button>
            </div>
        </AnimatedCard>
    );
}
