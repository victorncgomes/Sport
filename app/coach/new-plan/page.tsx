'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    Users,
    Target,
    Dumbbell,
    Waves,
    Activity,
    Save
} from 'lucide-react';

const WORKOUT_TYPES = [
    { id: 'resistance', label: 'Resistência', icon: Activity, color: 'bg-blue-500/20 text-blue-400' },
    { id: 'interval', label: 'Intervalado', icon: Target, color: 'bg-red-500/20 text-red-400' },
    { id: 'technique', label: 'Técnica', icon: Waves, color: 'bg-purple-500/20 text-purple-400' },
    { id: 'strength', label: 'Força', icon: Dumbbell, color: 'bg-orange-500/20 text-orange-400' },
];

const CATEGORIES = ['Júnior', 'Adulto', 'Master', 'Feminino', 'Misto'];

export default function NewPlanPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        category: '',
        date: '',
        startTime: '',
        duration: 60,
        description: '',
        goals: '',
        notes: ''
    });

    const handleSubmit = async () => {
        // Aqui seria a chamada para API
        console.log('Novo plano:', formData);
        router.push('/coach/painel');
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <Plus className="w-8 h-8 text-club-red" />
                        Novo Plano de Treino
                    </h1>
                    <p className="text-white/50">Crie um novo plano para sua equipe</p>
                </div>

                <AnimatedCard variant="glass" className="p-6">
                    <div className="space-y-6">
                        {/* Título */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Título do Treino</label>
                            <input
                                type="text"
                                placeholder="Ex: Treino de Resistência Aeróbica"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        {/* Tipo de Treino */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Tipo de Treino</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {WORKOUT_TYPES.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                                            className={`p-3 rounded-lg border transition-all ${formData.type === type.id
                                                    ? 'bg-club-red/20 border-club-red'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mx-auto mb-1 ${formData.type === type.id ? 'text-club-red' : 'text-white/60'}`} />
                                            <span className="text-xs text-white">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Categoria</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${formData.category === cat
                                                ? 'bg-club-red text-white'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Data e Hora */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Data
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Horário
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>

                        {/* Duração */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Duração (minutos)</label>
                            <input
                                type="number"
                                min={15}
                                max={180}
                                step={15}
                                value={formData.duration}
                                onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Descrição do Treino</label>
                            <textarea
                                placeholder="Descreva as séries, distâncias, intensidade..."
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                            />
                        </div>

                        {/* Objetivos */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2 flex items-center gap-1">
                                <Target className="w-4 h-4" /> Objetivos
                            </label>
                            <input
                                type="text"
                                placeholder="Metas para este treino..."
                                value={formData.goals}
                                onChange={e => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1 bg-club-red hover:bg-club-red/90"
                                onClick={handleSubmit}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Criar Plano
                            </Button>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
}
