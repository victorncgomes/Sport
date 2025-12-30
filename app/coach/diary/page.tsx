'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    BookOpen,
    Plus,
    Calendar,
    User,
    Edit3,
    Trash2,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DiaryEntry {
    id: string;
    date: Date;
    title: string;
    content: string;
    athletes: string[];
    tags: string[];
}

// Dados simulados
const mockEntries: DiaryEntry[] = [
    {
        id: '1',
        date: new Date(),
        title: 'Treino de resistência - Equipe Feminina',
        content: 'Excelente sessão de 10km. Maria e Ana demonstraram boa evolução no pace. Carla precisa trabalhar mais a técnica de pegada.',
        athletes: ['Maria Santos', 'Ana Beatriz', 'Carla Melo'],
        tags: ['resistência', 'feminino', 'técnica']
    },
    {
        id: '2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        title: 'Treino intervalado - Júnior',
        content: 'Série 8x500m com 2min descanso. Resultados dentro do esperado. João precisa melhorar saída.',
        athletes: ['João Silva', 'Pedro Henrique', 'Lucas Ferreira'],
        tags: ['intervalado', 'júnior', 'velocidade']
    },
    {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        title: 'Avaliação física - Grupo Master',
        content: 'Testes de VO2max e força. Grupo apresentou melhoras de 8% em média desde última avaliação.',
        athletes: ['Carlos Melo', 'Roberto Costa'],
        tags: ['avaliação', 'master', 'VO2max']
    }
];

export default function DiaryPage() {
    const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', content: '', athletes: '', tags: '' });

    const handleAddEntry = () => {
        if (!newEntry.title || !newEntry.content) return;

        const entry: DiaryEntry = {
            id: Date.now().toString(),
            date: new Date(),
            title: newEntry.title,
            content: newEntry.content,
            athletes: newEntry.athletes.split(',').map(a => a.trim()).filter(Boolean),
            tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        setEntries(prev => [entry, ...prev]);
        setNewEntry({ title: '', content: '', athletes: '', tags: '' });
        setShowNewEntry(false);
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-club-gold" />
                                Diário do Treinador
                            </h1>
                            <p className="text-white/50">Anotações e observações de treinos</p>
                        </div>
                        <Button
                            className="bg-club-red hover:bg-club-red/90"
                            onClick={() => setShowNewEntry(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Anotação
                        </Button>
                    </div>
                </div>

                {/* Nova Anotação */}
                {showNewEntry && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnimatedCard variant="gradient" className="p-6 mb-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Edit3 className="w-5 h-5" />
                                Nova Anotação
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Título da anotação"
                                    value={newEntry.title}
                                    onChange={e => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                                />
                                <textarea
                                    placeholder="Observações, feedback, pontos de atenção..."
                                    value={newEntry.content}
                                    onChange={e => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Atletas (separados por vírgula)"
                                        value={newEntry.athletes}
                                        onChange={e => setNewEntry(prev => ({ ...prev, athletes: e.target.value }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tags (separadas por vírgula)"
                                        value={newEntry.tags}
                                        onChange={e => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                                        Cancelar
                                    </Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddEntry}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar Anotação
                                    </Button>
                                </div>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* Lista de Anotações */}
                <div className="space-y-4">
                    {entries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <AnimatedCard variant="glass" className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{entry.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {entry.date.toLocaleDateString('pt-BR', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/70 mb-4">{entry.content}</p>

                                {entry.athletes.length > 0 && (
                                    <div className="mb-3">
                                        <div className="text-xs text-white/40 mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Atletas
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {entry.athletes.map((athlete, j) => (
                                                <span key={j} className="px-2 py-0.5 bg-club-red/20 text-club-red text-xs rounded">
                                                    {athlete}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {entry.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {entry.tags.map((tag, j) => (
                                            <span key={j} className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
