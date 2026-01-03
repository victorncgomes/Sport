'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ClipboardCheck,
    Users,
    Check,
    X,
    Clock,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Athlete {
    id: string;
    name: string;
    category: string;
    avatar: string;
    status: 'present' | 'absent' | 'late' | 'pending';
}

// Mock data
const mockTraining = {
    id: '1',
    title: 'Treino de Resistência - Equipe Adulta',
    date: new Date(),
    time: '06:00',
    location: 'Rio Potengi - Base SCN'
};

const mockAthletes: Athlete[] = [
    { id: '1', name: 'Ana Silva', category: 'Feminino', avatar: 'AS', status: 'pending' },
    { id: '2', name: 'Bruno Santos', category: 'Adulto', avatar: 'BS', status: 'pending' },
    { id: '3', name: 'Carla Melo', category: 'Master', avatar: 'CM', status: 'pending' },
    { id: '4', name: 'Diego Ferreira', category: 'Júnior', avatar: 'DF', status: 'pending' },
    { id: '5', name: 'Elena Costa', category: 'Feminino', avatar: 'EC', status: 'pending' },
    { id: '6', name: 'Felipe Oliveira', category: 'Adulto', avatar: 'FO', status: 'pending' },
    { id: '7', name: 'Gabriela Rocha', category: 'Feminino', avatar: 'GR', status: 'pending' },
    { id: '8', name: 'Henrique Lima', category: 'Master', avatar: 'HL', status: 'pending' },
];

const statusConfig = {
    present: { label: 'Presente', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    absent: { label: 'Ausente', color: 'bg-red-500/20 text-red-400', icon: X },
    late: { label: 'Atrasado', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
    pending: { label: 'Pendente', color: 'bg-white/10 text-white/40', icon: AlertCircle },
};

export default function ChamadaPage() {
    const [athletes, setAthletes] = useState<Athlete[]>(mockAthletes);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
        setAthletes(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        setSaved(false);
    };

    const handleMarkAllPresent = () => {
        setAthletes(prev => prev.map(a => ({ ...a, status: 'present' })));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        // Simular salvamento
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
    };

    const stats = {
        present: athletes.filter(a => a.status === 'present').length,
        absent: athletes.filter(a => a.status === 'absent').length,
        late: athletes.filter(a => a.status === 'late').length,
        pending: athletes.filter(a => a.status === 'pending').length,
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <ClipboardCheck className="w-8 h-8 text-club-red" />
                                Chamada
                            </h1>
                            <p className="text-white/50">{mockTraining.title}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 border-white/20"
                                onClick={handleMarkAllPresent}
                            >
                                <Check className="w-4 h-4" />
                                Marcar Todos Presente
                            </Button>
                            <Button
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <Clock className="w-4 h-4" />
                                    </motion.div>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Chamada'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Training Info */}
                <AnimatedCard variant="glass" className="p-4 mb-6">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{mockTraining.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Users className="w-4 h-4" />
                            <span>{athletes.length} atletas</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <span>{mockTraining.location}</span>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-400">{stats.present}</div>
                        <div className="text-xs text-white/40">Presentes</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">{stats.absent}</div>
                        <div className="text-xs text-white/40">Ausentes</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-amber-400">{stats.late}</div>
                        <div className="text-xs text-white/40">Atrasados</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-white/40">{stats.pending}</div>
                        <div className="text-xs text-white/40">Pendentes</div>
                    </AnimatedCard>
                </div>

                {/* Athletes List */}
                <div className="space-y-3">
                    {athletes.map((athlete, i) => {
                        const StatusIcon = statusConfig[athlete.status].icon;
                        return (
                            <motion.div
                                key={athlete.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold">
                                                {athlete.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{athlete.name}</p>
                                                <p className="text-xs text-white/40">{athlete.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge className={`${statusConfig[athlete.status].color} border-0 gap-1`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig[athlete.status].label}
                                            </Badge>

                                            <div className="flex gap-1 ml-4">
                                                <button
                                                    onClick={() => handleStatusChange(athlete.id, 'present')}
                                                    className={`p-2 rounded-lg transition-colors ${athlete.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40 hover:bg-emerald-500/20 hover:text-emerald-400'}`}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(athlete.id, 'late')}
                                                    className={`p-2 rounded-lg transition-colors ${athlete.status === 'late' ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/40 hover:bg-amber-500/20 hover:text-amber-400'}`}
                                                >
                                                    <Clock className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(athlete.id, 'absent')}
                                                    className={`p-2 rounded-lg transition-colors ${athlete.status === 'absent' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40 hover:bg-red-500/20 hover:text-red-400'}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
