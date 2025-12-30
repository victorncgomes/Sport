'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus, Calendar, Users, Clock, Target, ChevronRight,
    Play, Edit, Trash2, Copy, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrainingProgram {
    id: string;
    name: string;
    description: string;
    level: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
    durationWeeks: number;
    sessionsPerWeek: number;
    createdBy: 'SYSTEM' | 'COACH';
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    assignedCount: number;
    sessions: ProgramSession[];
}

interface ProgramSession {
    id: string;
    dayOfWeek: number;
    type: 'REMO' | 'CORRIDA' | 'BIKE' | 'MUSCULACAO' | 'RECUPERACAO';
    title: string;
    duration: number;
    intensity: 'LEVE' | 'MODERADO' | 'INTENSO';
}

// Programas mockados do sistema
const systemPrograms: TrainingProgram[] = [
    {
        id: 'system-1',
        name: 'Iniciação ao Remo',
        description: 'Programa de 8 semanas para iniciantes aprenderem técnica básica de remo',
        level: 'INICIANTE',
        durationWeeks: 8,
        sessionsPerWeek: 3,
        createdBy: 'SYSTEM',
        status: 'ACTIVE',
        assignedCount: 12,
        sessions: [
            { id: '1', dayOfWeek: 1, type: 'REMO', title: 'Técnica Base', duration: 45, intensity: 'LEVE' },
            { id: '2', dayOfWeek: 3, type: 'REMO', title: 'Resistência', duration: 60, intensity: 'MODERADO' },
            { id: '3', dayOfWeek: 5, type: 'MUSCULACAO', title: 'Força Complementar', duration: 45, intensity: 'MODERADO' }
        ]
    },
    {
        id: 'system-2',
        name: 'Preparação para Regata',
        description: 'Programa intensivo de 12 semanas para competição',
        level: 'AVANCADO',
        durationWeeks: 12,
        sessionsPerWeek: 5,
        createdBy: 'SYSTEM',
        status: 'ACTIVE',
        assignedCount: 8,
        sessions: [
            { id: '1', dayOfWeek: 1, type: 'REMO', title: 'Intervalos', duration: 60, intensity: 'INTENSO' },
            { id: '2', dayOfWeek: 2, type: 'MUSCULACAO', title: 'Força', duration: 60, intensity: 'INTENSO' },
            { id: '3', dayOfWeek: 3, type: 'REMO', title: 'Técnica', duration: 90, intensity: 'MODERADO' },
            { id: '4', dayOfWeek: 4, type: 'RECUPERACAO', title: 'Recuperação Ativa', duration: 30, intensity: 'LEVE' },
            { id: '5', dayOfWeek: 5, type: 'REMO', title: 'Prova Simulada', duration: 90, intensity: 'INTENSO' }
        ]
    },
    {
        id: 'system-3',
        name: 'Condicionamento Geral',
        description: 'Programa multi-esporte para manutenção de forma física',
        level: 'INTERMEDIARIO',
        durationWeeks: 4,
        sessionsPerWeek: 4,
        createdBy: 'SYSTEM',
        status: 'ACTIVE',
        assignedCount: 15,
        sessions: [
            { id: '1', dayOfWeek: 1, type: 'REMO', title: 'Base Aeróbica', duration: 60, intensity: 'MODERADO' },
            { id: '2', dayOfWeek: 2, type: 'CORRIDA', title: 'Corrida Leve', duration: 30, intensity: 'LEVE' },
            { id: '3', dayOfWeek: 4, type: 'MUSCULACAO', title: 'Força Funcional', duration: 45, intensity: 'MODERADO' },
            { id: '4', dayOfWeek: 6, type: 'BIKE', title: 'Ciclismo', duration: 60, intensity: 'MODERADO' }
        ]
    }
];

const levelColors = {
    INICIANTE: 'bg-green-500/20 text-green-400 border-green-500/30',
    INTERMEDIARIO: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    AVANCADO: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const typeIcons: Record<string, string> = {
    REMO: '🚣',
    CORRIDA: '🏃',
    BIKE: '🚴',
    MUSCULACAO: '🏋️',
    RECUPERACAO: '🧘'
};

const dayNames = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function CoachProgramsPage() {
    const [programs, setPrograms] = useState<TrainingProgram[]>(systemPrograms);
    const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'SYSTEM' | 'COACH'>('all');

    const filteredPrograms = programs.filter(p =>
        filter === 'all' || p.createdBy === filter
    );

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Programas de Treinamento"
                subtitle="Gerencie e atribua programas aos atletas"
                backgroundImage="/images/rowing-pattern.jpg"
            />

            <div className="px-4 py-6 space-y-6">
                {/* Filtros e Ações */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </Button>
                        <Button
                            variant={filter === 'SYSTEM' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('SYSTEM')}
                        >
                            Sistema
                        </Button>
                        <Button
                            variant={filter === 'COACH' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('COACH')}
                        >
                            Meus
                        </Button>
                    </div>
                    <Link href="/coach/programs/new">
                        <Button size="sm" className="bg-club-red hover:bg-club-red/90">
                            <Plus className="w-4 h-4 mr-1" />
                            Novo
                        </Button>
                    </Link>
                </div>

                {/* Lista de Programas */}
                <div className="space-y-4">
                    {filteredPrograms.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <AnimatedCard
                                variant="glass"
                                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                                onClick={() => setSelectedProgram(selectedProgram?.id === program.id ? null : program)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white">{program.name}</h3>
                                            {program.createdBy === 'SYSTEM' && (
                                                <Badge className="text-[10px] bg-blue-500/20 text-blue-400">
                                                    Sistema
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/50 line-clamp-2">{program.description}</p>
                                    </div>
                                    <Badge className={`${levelColors[program.level]} text-xs`}>
                                        {program.level}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-white/40">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {program.durationWeeks} semanas
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {program.sessionsPerWeek}x/semana
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {program.assignedCount} atletas
                                    </span>
                                </div>

                                {/* Detalhes expandidos */}
                                <AnimatePresence>
                                    {selectedProgram?.id === program.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-white/10">
                                                <h4 className="text-sm font-bold text-white mb-3">Sessões da Semana</h4>
                                                <div className="grid grid-cols-7 gap-1 mb-4">
                                                    {[1, 2, 3, 4, 5, 6, 7].map(day => {
                                                        const session = program.sessions.find(s => s.dayOfWeek === day);
                                                        return (
                                                            <div
                                                                key={day}
                                                                className={`text-center p-2 rounded-lg ${session ? 'bg-white/10' : 'bg-white/5'}`}
                                                            >
                                                                <div className="text-[10px] text-white/40">{dayNames[day]}</div>
                                                                {session ? (
                                                                    <>
                                                                        <div className="text-lg">{typeIcons[session.type]}</div>
                                                                        <div className="text-[10px] text-white/60 truncate">{session.title}</div>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-lg text-white/20">-</div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-club-red hover:bg-club-red/90"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowAssignModal(true);
                                                        }}
                                                    >
                                                        <Users className="w-4 h-4 mr-1" />
                                                        Atribuir
                                                    </Button>
                                                    {program.createdBy === 'COACH' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>

                {/* Estatísticas */}
                <AnimatedCard variant="gradient" className="p-4">
                    <h3 className="font-bold text-white mb-3">Resumo</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{programs.length}</div>
                            <div className="text-xs text-white/50">Programas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">
                                {programs.reduce((acc, p) => acc + p.assignedCount, 0)}
                            </div>
                            <div className="text-xs text-white/50">Atletas Ativos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                                {programs.filter(p => p.createdBy === 'COACH').length}
                            </div>
                            <div className="text-xs text-white/50">Personalizados</div>
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Modal Atribuir Atletas */}
            <AnimatePresence>
                {showAssignModal && selectedProgram && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAssignModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                Atribuir Programa
                            </h3>
                            <p className="text-sm text-white/50 mb-4">
                                {selectedProgram.name}
                            </p>

                            {/* Lista de atletas mockados */}
                            <div className="space-y-2 mb-4">
                                {['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Lucas Ferreira'].map((name, i) => (
                                    <label
                                        key={i}
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
                                    >
                                        <input type="checkbox" className="rounded" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                            {name.charAt(0)}
                                        </div>
                                        <span className="text-white">{name}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-club-red hover:bg-club-red/90"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    Confirmar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
