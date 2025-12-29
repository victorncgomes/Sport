'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, Smile, Meh, Frown } from 'lucide-react';

function FeedbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [intensity, setIntensity] = useState(5);
    const [feeling, setFeeling] = useState<'great' | 'good' | 'bad' | null>(null);
    const [notes, setNotes] = useState('');
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const feelings = [
        { id: 'great' as const, icon: Smile, label: 'Ótimo', color: 'text-green-500' },
        { id: 'good' as const, icon: Meh, label: 'Normal', color: 'text-yellow-500' },
        { id: 'bad' as const, icon: Frown, label: 'Ruim', color: 'text-red-500' },
    ];

    const muscles = [
        'Pernas', 'Costas', 'Braços', 'Core', 'Ombros', 'Cardio'
    ];

    const handleSubmit = async () => {
        if (!feeling) {
            alert('Por favor, selecione como você se sentiu');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/workouts/${sessionId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intensity,
                    feeling,
                    notes,
                    muscleGroups
                })
            });

            if (response.ok) {
                router.push(`/training/history`);
            } else {
                alert('Erro ao salvar feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Erro ao salvar feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMuscle = (muscle: string) => {
        setMuscleGroups(prev =>
            prev.includes(muscle)
                ? prev.filter(m => m !== muscle)
                : [...prev, muscle]
        );
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Feedback do Treino"
                subtitle="Como foi seu treino?"
                description="Suas informações ajudam a melhorar seu desempenho"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Intensidade */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Intensidade do Treino</h3>
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                            <button
                                key={level}
                                onClick={() => setIntensity(level)}
                                className={`flex-1 h-12 rounded-lg transition-all ${level <= intensity
                                    ? 'bg-club-red text-white'
                                    : 'bg-white/10 text-white/40'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/60 mt-2">
                        <span>Muito Leve</span>
                        <span>Muito Intenso</span>
                    </div>
                </AnimatedCard>

                {/* Sensação */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Como você se sentiu?</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {feelings.map((f) => {
                            const Icon = f.icon;
                            const isSelected = feeling === f.id;

                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setFeeling(f.id)}
                                    className={`p-6 rounded-xl transition-all ${isSelected
                                        ? 'bg-club-red/20 ring-2 ring-club-red'
                                        : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className={`w-12 h-12 mx-auto mb-2 ${f.color}`} />
                                    <div className="text-white text-sm font-medium">
                                        {f.label}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </AnimatedCard>

                {/* Grupos Musculares */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Grupos Musculares Trabalhados</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {muscles.map((muscle) => {
                            const isSelected = muscleGroups.includes(muscle);

                            return (
                                <button
                                    key={muscle}
                                    onClick={() => toggleMuscle(muscle)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all ${isSelected
                                        ? 'bg-club-red text-white'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                        }`}
                                >
                                    {muscle}
                                </button>
                            );
                        })}
                    </div>
                </AnimatedCard>

                {/* Notas */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Observações</h3>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Como foi o treino? Alguma dificuldade? Objetivos alcançados?"
                        className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                </AnimatedCard>

                {/* Botão Enviar */}
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !feeling}
                    className="w-full h-14 bg-club-red hover:bg-club-red/90 gap-2"
                >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </Button>
            </div>
        </div>
    );
}

export default function FeedbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <p className="text-white/60">Carregando...</p>
            </div>
        }>
            <FeedbackContent />
        </Suspense>
    );
}
