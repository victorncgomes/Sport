'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, X, AlertCircle } from 'lucide-react';

export default function SuggestPlanPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const athleteId = params.id;

    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/coach/suggest-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: athleteId })
            });

            const data = await response.json();

            if (response.ok) {
                setPlan(data.plan);
            } else {
                setError(data.error || 'Erro ao gerar planilha');
            }
        } catch (err) {
            setError('Erro ao gerar planilha');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const response = await fetch('/api/coach/approve-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: athleteId,
                    plan
                })
            });

            if (response.ok) {
                alert('Planilha aprovada e enviada ao atleta!');
                router.push(`/coach/athletes/${athleteId}`);
            } else {
                alert('Erro ao aprovar planilha');
            }
        } catch (err) {
            alert('Erro ao aprovar planilha');
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Sugerir Planilha"
                subtitle="Geração automática baseada em anamnese"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {!plan && !error && (
                    <AnimatedCard variant="glass" className="p-8 text-center">
                        <Sparkles className="w-16 h-16 text-club-red mx-auto mb-4" />
                        <h3 className="text-white font-bold text-xl mb-2">
                            Gerar Planilha Automática
                        </h3>
                        <p className="text-white/60 mb-6">
                            O sistema irá analisar a anamnese do atleta e gerar uma planilha personalizada
                        </p>
                        <Button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-club-red hover:bg-club-red/90 gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            {loading ? 'Gerando...' : 'Gerar Planilha'}
                        </Button>
                    </AnimatedCard>
                )}

                {error && (
                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            <div>
                                <h4 className="text-white font-bold mb-1">Erro</h4>
                                <p className="text-white/60 text-sm">{error}</p>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {plan && (
                    <>
                        {/* Resumo da Planilha */}
                        <AnimatedCard variant="gradient" className="p-6">
                            <h3 className="text-white font-bold text-xl mb-4">{plan.name}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-white/60 text-sm">Nível</p>
                                    <p className="text-white font-bold capitalize">{plan.level}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Foco</p>
                                    <p className="text-white font-bold capitalize">{plan.focus}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Frequência</p>
                                    <p className="text-white font-bold">{plan.weeklyFrequency}x por semana</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Duração</p>
                                    <p className="text-white font-bold">{plan.duration} semanas</p>
                                </div>
                            </div>
                            {plan.requiresTankFirst && (
                                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                    <p className="text-yellow-400 text-sm">
                                        ⚠️ Atleta precisa completar treinos no tanque antes de usar barcos
                                    </p>
                                </div>
                            )}
                        </AnimatedCard>

                        {/* Primeiras Semanas (Preview) */}
                        <div className="space-y-4">
                            <h3 className="text-white font-bold">Preview - Primeiras 2 Semanas</h3>
                            {plan.weeks?.slice(0, 2).map((week: any) => (
                                <AnimatedCard key={week.week} variant="glass" className="p-6">
                                    <h4 className="text-white font-bold mb-4">
                                        Semana {week.week}
                                        {week.notes && (
                                            <span className="text-sm text-white/60 ml-2">({week.notes})</span>
                                        )}
                                    </h4>
                                    <div className="space-y-3">
                                        {week.sessions.map((session: any) => (
                                            <div key={session.day} className="p-4 bg-white/5 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium">
                                                        Dia {session.day} - {session.type}
                                                    </span>
                                                    <span className="text-white/60 text-sm">
                                                        {session.duration}min
                                                    </span>
                                                </div>
                                                <p className="text-white/60 text-sm mb-2">
                                                    {session.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-white/40">
                                                    <span>Intensidade: {session.intensity}%</span>
                                                    <span>Aquecimento: {session.warmup}min</span>
                                                    <span>Alongamento: {session.cooldown}min</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AnimatedCard>
                            ))}
                        </div>

                        {/* Ações */}
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setPlan(null)}
                                variant="outline"
                                className="flex-1 h-12 gap-2"
                            >
                                <X className="w-5 h-5" />
                                Descartar
                            </Button>
                            <Button
                                onClick={handleApprove}
                                className="flex-1 h-12 gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <Check className="w-5 h-5" />
                                Aprovar e Enviar
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
