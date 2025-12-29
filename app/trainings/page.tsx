'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { athleteData } from '@/lib/data/athlete-performance';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Trophy, Activity, Heart, Calendar, ArrowRight, Table, FileText, User, ChevronRight, Zap, Ship, Anchor, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { garageBoats, Boat, BoatType } from '@/lib/data/garage-boats';
import { BoatCard } from '@/components/garage/boat-card';
import { ReservationModal } from '@/components/garage/reservation-modal';

export default function TrainingsPage() {
    const [activeTab, setActiveTab] = useState<'plan' | 'performance' | 'anamnesis' | 'garage'>('plan');
    const [selectedBoatType, setSelectedBoatType] = useState<BoatType | 'all'>('all');
    const [bookingBoat, setBookingBoat] = useState<Boat | null>(null);

    const filteredBoats = selectedBoatType === 'all'
        ? garageBoats
        : garageBoats.filter(boat => boat.type === selectedBoatType);

    const boatTypes: { id: BoatType | 'all', label: string }[] = [
        { id: 'all', label: 'Toda a Frota' },
        { id: '1x', label: 'Single (1x)' },
        { id: '2-', label: 'Dois Sem (2-)' },
        { id: '2x', label: 'Double (2x)' },
        { id: '4-', label: 'Quatro Sem (4-)' },
        { id: '8+', label: 'Oito Com (8+)' },
    ];

    const availableBoats = garageBoats.filter(b => b.status === 'available').length;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            {/* Spacer for fixed header */}
            <div className="h-8 md:h-10" />

            <HeroSection
                title="Painel do Atleta"
                subtitle="Performance & Evolução"
                description="Acompanhe sua planilha de treinos, índices físicos e histórico de saúde em um só lugar."
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Athlete Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-club-red to-red-800 p-1">
                            <div className="w-full h-full rounded-full bg-club-black flex items-center justify-center overflow-hidden">
                                <User className="w-12 h-12 text-white/20" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-club-gold rounded-full flex items-center justify-center text-black border-2 border-club-black">
                            <Trophy className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-1">{athleteData.name}</h1>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                                Categoria: <strong className="text-club-red">{athleteData.category}</strong>
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                                Técnico: <strong className="text-white">{athleteData.coach}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="md:ml-auto flex gap-4">
                        <Button variant="outline" className="border-white/10 text-white/60 hover:text-white">
                            Relatório PDF
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'plan' ? "border-club-red text-white" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        Planilha de Treino
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'performance' ? "border-club-red text-white" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        Performance & Índices
                    </button>
                    <button
                        onClick={() => setActiveTab('anamnesis')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'anamnesis' ? "border-club-red text-white" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        Ficha (Anamnese)
                    </button>
                    <button
                        onClick={() => setActiveTab('garage')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
                            activeTab === 'garage' ? "border-club-gold text-club-gold" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        <Ship className="w-4 h-4" /> Garagem Náutica
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'plan' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-club-red" />
                                    Semana {athleteData.currentPlan.weekNumber}
                                </h2>
                                <span className="text-xs text-white/40 italic">Ciclo: Base / Intensidade 2</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {athleteData.currentPlan.sessions.map((session, idx) => (
                                    <AnimatedCard key={idx} variant="metal" className="p-5 border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-black text-club-gold uppercase">{session.day}</span>
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                session.intensity === 'Baixa' ? "bg-green-500/20 text-green-500" :
                                                    session.intensity === 'Moderada' ? "bg-blue-500/20 text-blue-500" :
                                                        session.intensity === 'Alta' ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-red-500"
                                            )}>
                                                {session.intensity}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{session.target}</h3>
                                        <p className="text-sm text-white/60 mb-6">{session.description}</p>
                                        <Button size="sm" variant="ghost" className="w-full text-xs text-white/40 hover:text-white gap-2">
                                            Lançar Feedback <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </AnimatedCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Chart 2000m */}
                                <AnimatedCard variant="carbon" className="p-6 h-[350px]">
                                    <h3 className="text-sm font-bold text-white/40 uppercase mb-6">Evolução Ergômetro (2000m)</h3>
                                    <div className="w-full h-full">
                                        <ResponsiveContainer width="100%" height="80%" minWidth={300}>
                                            <LineChart data={athleteData.performance}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', color: '#fff' }}
                                                    itemStyle={{ color: '#DC2626' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="erg2000m"
                                                    stroke="#DC2626"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#DC2626', strokeWidth: 2 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-[10px] text-white/30 text-center mt-2">Dados coletados nos testes mensais oficiais.</p>
                                </AnimatedCard>

                                {/* Physical Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <AnimatedCard variant="metal" className="p-6 flex flex-col justify-center items-center">
                                        <Activity className="w-6 h-6 text-club-gold mb-2" />
                                        <span className="text-xs text-white/40 font-bold uppercase">Último 500m</span>
                                        <span className="text-3xl font-black text-white">{athleteData.performance[2].erg500m}</span>
                                    </AnimatedCard>
                                    <AnimatedCard variant="metal" className="p-6 flex flex-col justify-center items-center">
                                        <Zap className="w-6 h-6 text-club-gold mb-2" />
                                        <span className="text-xs text-white/40 font-bold uppercase">F.C. Repouso</span>
                                        <span className="text-3xl font-black text-white">{athleteData.performance[2].heartRateRest} bpm</span>
                                    </AnimatedCard>
                                    <AnimatedCard variant="metal" className="p-6 flex flex-col justify-center items-center">
                                        <User className="w-6 h-6 text-club-red mb-2" />
                                        <span className="text-xs text-white/40 font-bold uppercase">Peso Atual</span>
                                        <span className="text-3xl font-black text-white">{athleteData.performance[2].weight} kg</span>
                                    </AnimatedCard>
                                    <AnimatedCard variant="metal" className="p-6 flex flex-col justify-center items-center">
                                        <Trophy className="w-6 h-6 text-club-red mb-2" />
                                        <span className="text-xs text-white/40 font-bold uppercase">Recorde 2k</span>
                                        <span className="text-3xl font-black text-white">{athleteData.performance[2].erg2000m}</span>
                                    </AnimatedCard>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'anamnesis' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-club-gold" />
                                    Ficha Clínica do Associado
                                </h2>
                                <span className="text-xs text-white/40 italic">Última atualização: {athleteData.anamnesis.lastUpdate}</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <AnimatedCard variant="carbon" className="p-6 space-y-4">
                                    <h3 className="text-sm font-black text-club-red uppercase border-b border-white/5 pb-2">Informações Gerais</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase">Tipo Sanguíneo</p>
                                            <p className="text-lg font-bold text-white">{athleteData.anamnesis.bloodType}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase">Pressão Média</p>
                                            <p className="text-lg font-bold text-white">12/8 mmHg</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase">Alergias</p>
                                        <div className="flex gap-2 flex-wrap mt-1">
                                            {athleteData.anamnesis.allergies.map((a, i) => (
                                                <span key={i} className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedCard>

                                <AnimatedCard variant="carbon" className="p-6 space-y-4">
                                    <h3 className="text-sm font-black text-club-red uppercase border-b border-white/5 pb-2">Contatos de Emergência</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <Heart className="w-5 h-5 text-club-red" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/40">{athleteData.anamnesis.emergencyContact.relation}</p>
                                                <p className="font-bold text-white">{athleteData.anamnesis.emergencyContact.name}</p>
                                                <p className="text-sm text-club-gold">{athleteData.anamnesis.emergencyContact.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>

                                <AnimatedCard variant="metal" className="md:col-span-2 p-6">
                                    <h3 className="text-sm font-black text-club-red uppercase border-b border-white/5 pb-2 mb-4">Histórico Médico & Lesões</h3>
                                    <ul className="space-y-3">
                                        {athleteData.anamnesis.previousInjuries.map((injury, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                                                <div className="w-1.5 h-1.5 rounded-full bg-club-gold mt-1.5 shrink-0" />
                                                {injury}
                                            </li>
                                        ))}
                                    </ul>
                                </AnimatedCard>
                            </div>

                            <Button className="w-full bg-club-red hover:bg-red-700 text-white font-bold h-12">
                                Solicitar Atualização de Ficha
                            </Button>
                        </div>
                    )}

                    {/* Garagem Tab */}
                    {activeTab === 'garage' && (
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <AnimatedCard variant="glass" className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-white/50 text-xs uppercase font-bold">Total Frota</p>
                                        <span className="text-2xl font-bold text-white">{garageBoats.length}</span>
                                    </div>
                                    <Ship className="w-8 h-8 text-white/20" />
                                </AnimatedCard>
                                <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-green-500/20 bg-green-500/5">
                                    <div>
                                        <p className="text-green-400/70 text-xs uppercase font-bold">Disponíveis</p>
                                        <span className="text-2xl font-bold text-green-400">{availableBoats}</span>
                                    </div>
                                    <Anchor className="w-8 h-8 text-green-500/20" />
                                </AnimatedCard>
                                <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-blue-500/20 bg-blue-500/5">
                                    <div>
                                        <p className="text-blue-400/70 text-xs uppercase font-bold">Na Água</p>
                                        <span className="text-2xl font-bold text-blue-400">{garageBoats.filter(b => b.status === 'in-use').length}</span>
                                    </div>
                                    <Ship className="w-8 h-8 text-blue-500/20" />
                                </AnimatedCard>
                                <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
                                    <div>
                                        <p className="text-amber-400/70 text-xs uppercase font-bold">Manutenção</p>
                                        <span className="text-2xl font-bold text-amber-400">{garageBoats.filter(b => b.status === 'maintenance').length}</span>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-amber-500/20" />
                                </AnimatedCard>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
                                {boatTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedBoatType(type.id)}
                                        className={cn(
                                            "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                            selectedBoatType === type.id
                                                ? "bg-white/10 border-club-gold text-club-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                                                : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Grid de Barcos */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredBoats.map(boat => (
                                    <BoatCard
                                        key={boat.id}
                                        boat={boat}
                                        onBook={setBookingBoat}
                                    />
                                ))}
                            </div>

                            {filteredBoats.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-white/50">Nenhum barco encontrado nesta categoria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Reserva */}
            <ReservationModal
                boat={bookingBoat}
                onClose={() => setBookingBoat(null)}
            />
        </div>
    );
}
