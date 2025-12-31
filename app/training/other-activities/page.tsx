'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    PersonStanding,
    Bike,
    Footprints,
    Waves as Surf,
    CircleDot,
    Mountain,
    Volleyball,
    Play,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Outras atividades disponíveis
const activities = [
    {
        id: 'RUNNING',
        title: 'Corrida',
        description: 'Corrida outdoor ou esteira',
        icon: PersonStanding,
        color: 'from-green-600 to-emerald-600'
    },
    {
        id: 'CYCLING',
        title: 'Bicicleta',
        description: 'Pedal outdoor ou spinning',
        icon: Bike,
        color: 'from-orange-600 to-amber-600'
    },
    {
        id: 'WALKING',
        title: 'Caminhada',
        description: 'Caminhada leve ou moderada',
        icon: Footprints,
        color: 'from-teal-600 to-cyan-600'
    },
    {
        id: 'FOOTBALL',
        title: 'Futebol',
        description: 'Pelada, treino ou partida oficial',
        icon: CircleDot,
        color: 'from-lime-600 to-green-600'
    },
    {
        id: 'SURF',
        title: 'Surfe',
        description: 'Surfe, stand-up paddle ou bodyboard',
        icon: Surf,
        color: 'from-blue-600 to-indigo-600'
    },
    {
        id: 'HIKING',
        title: 'Trilha',
        description: 'Trilha, trekking ou caminhada em montanha',
        icon: Mountain,
        color: 'from-amber-700 to-stone-600'
    },
    {
        id: 'VOLLEYBALL',
        title: 'Vôlei',
        description: 'Vôlei de praia ou quadra',
        icon: Volleyball,
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'OTHER',
        title: 'Outra',
        description: 'Registre qualquer outra atividade',
        icon: Play,
        color: 'from-gray-600 to-slate-600'
    }
];

export default function OtherActivitiesPage() {
    const router = useRouter();

    const handleActivitySelect = (activityId: string) => {
        router.push(`/training/start?sport=${activityId}`);
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Outras Atividades"
                subtitle="Sport Club de Natal"
                description="Escolha uma atividade para registrar seu treino"
                compact
            />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Botão Voltar */}
                <Link href="/training">
                    <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Voltar para Treinos
                    </Button>
                </Link>

                {/* Grid de Atividades */}
                <div className="grid grid-cols-2 gap-4">
                    {activities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                            <motion.button
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleActivitySelect(activity.id)}
                                className="w-full"
                            >
                                <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-all h-full">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className="font-bold text-white mb-1">{activity.title}</h3>
                                            <p className="text-xs text-white/50">{activity.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30 mt-3" />
                                    </div>
                                </AnimatedCard>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Info Card */}
                <AnimatedCard variant="gradient" className="p-4">
                    <h3 className="text-white font-bold mb-2">💡 Dica</h3>
                    <p className="text-white/70 text-sm">
                        Todas as atividades registradas contam para sua evolução no clube!
                        Ganhe pontos, mantenha seu streak e acompanhe seu progresso.
                    </p>
                </AnimatedCard>
            </div>
        </div>
    );
}
