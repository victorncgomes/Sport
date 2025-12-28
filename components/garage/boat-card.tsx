'use client';

import React from 'react';
import { Boat } from '@/lib/data/garage-boats';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Ship, Users, Wrench, Clock, Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoatCardProps {
    boat: Boat;
    onBook: (boat: Boat) => void;
}

export function BoatCard({ boat, onBook }: BoatCardProps) {
    const statusConfig = {
        available: { color: 'text-green-500', bg: 'bg-green-500/20', label: 'Disponível', icon: Anchor },
        'in-use': { color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'Na Água', icon: Ship },
        maintenance: { color: 'text-amber-500', bg: 'bg-amber-500/20', label: 'Manutenção', icon: Wrench },
        reserved: { color: 'text-purple-500', bg: 'bg-purple-500/20', label: 'Reservado', icon: Clock },
    };

    const config = statusConfig[boat.status];
    const StatusIcon = config.icon;

    return (
        <AnimatedCard variant="metal" hover="lift" className="flex flex-col h-full group overflow-hidden">
            {/* Header Image/Placeholder */}
            <div className="relative h-40 bg-gradient-to-br from-gray-800 to-black overflow-hidden border-b border-white/5">
                <div className="absolute top-3 right-3 z-10">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md border border-white/10",
                        config.color,
                        config.bg
                    )}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                    </span>
                </div>

                {/* Boat Silhouette Placeholder */}
                <div className="w-full h-full flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700">
                    <Ship className="w-20 h-20 text-white" />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-club-gold transition-colors">{boat.name}</h3>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-bold">{boat.category}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/30 font-bold">Fabricante</span>
                    <span className="text-white/80">{boat.manufacturer} ({boat.year})</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/30 font-bold">Capacidade</span>
                    <div className="flex items-center gap-1 text-white/80">
                        <Users className="w-3 h-3" />
                        {boat.capacity} Remador(es)
                    </div>
                </div>
                <div className="flex flex-col col-span-2">
                    <span className="text-[10px] uppercase text-white/30 font-bold">Nível Exigido</span>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full",
                                    boat.skillLevel === 'beginner' ? 'w-1/4 bg-green-500' :
                                        boat.skillLevel === 'intermediate' ? 'w-2/4 bg-blue-500' :
                                            boat.skillLevel === 'advanced' ? 'w-3/4 bg-purple-500' :
                                                'w-full bg-club-red'
                                )}
                            />
                        </div>
                        <span className="text-xs text-white/60 capitalize">{boat.skillLevel}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto p-4 pt-0">
                <Button
                    className={cn(
                        "w-full font-bold transition-all",
                        boat.status === 'available'
                            ? "bg-club-gold hover:bg-club-gold-light text-black shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            : "bg-white/5 hover:bg-white/10 text-white/30 cursor-not-allowed border border-white/5"
                    )}
                    disabled={boat.status !== 'available'}
                    onClick={() => onBook(boat)}
                >
                    {boat.status === 'available' ? 'Reservar Saída' : 'Indisponível'}
                </Button>

                {boat.status === 'maintenance' && (
                    <p className="text-[10px] text-amber-500/70 text-center mt-2 flex items-center justify-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Previsão: {boat.lastMaintenance ? 'Em reparo' : 'Indefinida'}
                    </p>
                )}
            </div>
        </AnimatedCard>
    );
}
