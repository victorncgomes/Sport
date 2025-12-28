'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { socialActions, SocialAction, SocialActionType } from '@/lib/data/social-actions';
import { SocialActionCard } from '@/components/social/social-action-card';
import { Filter, Heart, Trophy, Target, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialActionsPage() {
    const [selectedType, setSelectedType] = useState<SocialActionType | 'all'>('all');
    const [isSuggesting, setIsSuggesting] = useState(false);

    const filteredActions = selectedType === 'all'
        ? socialActions
        : socialActions.filter(a => a.type === selectedType);

    const types: { id: SocialActionType | 'all', label: string }[] = [
        { id: 'all', label: 'Todas as Ações' },
        { id: 'voluntariado', label: 'Voluntariado' },
        { id: 'tarefa', label: 'Tarefas' },
        { id: 'campanha', label: 'Campanhas' },
    ];

    const handleJoin = (action: SocialAction) => {
        alert(`Inscrição realizada para: ${action.title}! Ganhe +${action.points} pontos após conclusão.`);
    };

    return (
        <div className="min-h-screen bg-club-black">
            <HeroSection
                title="Ações Sociais"
                subtitle="Juntos Remamos Mais Longe"
                description="O Sport Club de Natal é feito por sua comunidade. Participe, ajude a manter nossa tradição e suba no ranking do clube!"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Gamification Banner */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <AnimatedCard variant="gradient" className="col-span-1 md:col-span-2 relative overflow-hidden h-40 flex items-center">
                        <div className="relative z-10 p-6 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-club-gold flex items-center justify-center shadow-glow-gold rotate-3">
                                <Trophy className="w-10 h-10 text-black" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic">Ranking Amigos do SCN</h2>
                                <p className="text-white/70 text-sm">Acumule pontos em ações sociais e ganhe descontos na Store e mensalidade!</p>
                            </div>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                            <Heart className="w-48 h-48 text-white" />
                        </div>
                    </AnimatedCard>

                    <AnimatedCard variant="carbon" className="h-40 flex flex-col justify-center items-center text-center p-6 border border-white/5">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Seus Pontos</span>
                        <span className="text-5xl font-black text-club-gold tracking-tighter">1.250</span>
                        <span className="text-[10px] text-club-gold/60 font-black mt-1 uppercase">Elite Prata</span>
                    </AnimatedCard>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
                        <Filter className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                        {types.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                    selectedType === type.id
                                        ? "bg-white/10 border-club-gold text-club-gold"
                                        : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                                )}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setIsSuggesting(true)}
                        variant="outline"
                        className="gap-2 border-white/10 text-white/60 hover:text-white shrink-0"
                    >
                        <MessageSquare className="w-4 h-4" /> Sugerir Ação
                    </Button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActions.map(action => (
                        <SocialActionCard
                            key={action.id}
                            action={action}
                            onJoin={handleJoin}
                        />
                    ))}
                </div>

                {filteredActions.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p>Nenhuma ação disponível para esta categoria.</p>
                    </div>
                )}
            </div>

            {/* Feedback Section */}
            <section className="container mx-auto px-4 py-16">
                <AnimatedCard variant="metal" className="bg-club-gold/5 border-club-gold/20 p-8 text-center max-w-4xl mx-auto">
                    <Sparkles className="w-10 h-10 text-club-gold mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Por que ser um Voluntário SCN?</h2>
                    <p className="text-white/60 text-sm max-w-2xl mx-auto mb-8">
                        Nosso clube nasceu da união de sócios apaixonados. Ao participar das ações sociais, você ajuda a manter viva a chama rubro-negra e garante que as futuras gerações tenham o melhor ambiente para remar.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <span className="text-club-gold font-bold block text-lg">Tradição</span>
                            <p className="text-[10px] text-white/40">Preserve 110 anos de história náutica.</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-club-gold font-bold block text-lg">Comunidade</span>
                            <p className="text-[10px] text-white/40">Conheça novos membros e faça amigos.</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-club-gold font-bold block text-lg">Vantagens</span>
                            <p className="text-[10px] text-white/40">Pontos trocáveis por benefícios reais.</p>
                        </div>
                    </div>
                </AnimatedCard>
            </section>

            {/* Suggestion Modal */}
            <AnimatePresence>
                {isSuggesting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-club-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-club-black border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Sugerir Nova Ação</h2>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">Contribua com o clube</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsSuggesting(false)} className="text-white/20 hover:text-white">
                                    <Sparkles className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Título da Ideia</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-club-gold transition-all" placeholder="Ex: Mutirão de Limpeza do Rio" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Como funcionaria?</label>
                                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-club-gold transition-all min-h-[120px]" placeholder="Descreva sua sugestão..." />
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => setIsSuggesting(false)} variant="ghost" className="flex-1 text-white/40 font-bold uppercase text-xs h-12">Cancelar</Button>
                                    <Button onClick={() => setIsSuggesting(false)} className="flex-1 bg-club-gold hover:bg-club-gold-700 text-black font-bold uppercase text-xs h-12 shadow-glow-gold">Enviar Sugestão</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
