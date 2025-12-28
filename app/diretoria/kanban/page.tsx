'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    GripVertical,
    MoreVertical,
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignee?: string;
    dueDate?: string;
}

const initialTasks: Task[] = [
    { id: '1', title: 'Organizar assembleia de março', description: 'Preparar pauta e enviar convocações', status: 'TODO', priority: 'HIGH', assignee: 'Carlos', dueDate: '2025-02-15' },
    { id: '2', title: 'Manutenção do quad', description: 'Verificar banco deslizante', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: 'Roberto' },
    { id: '3', title: 'Atualizar site institucional', status: 'TODO', priority: 'LOW', assignee: 'Juliana' },
    { id: '4', title: 'Campanha de filiação janeiro', status: 'DONE', priority: 'HIGH', assignee: 'Ana Paula' },
    { id: '5', title: 'Contratar treinador', description: 'Entrevistas em andamento', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'Fernanda', dueDate: '2025-01-30' },
    { id: '6', title: 'Renovar alvará', status: 'DONE', priority: 'MEDIUM', assignee: 'Marcos' },
];

const columns = [
    { id: 'TODO' as TaskStatus, title: 'A Fazer', icon: Clock, color: 'text-amber-400' },
    { id: 'IN_PROGRESS' as TaskStatus, title: 'Em Progresso', icon: AlertCircle, color: 'text-blue-400' },
    { id: 'DONE' as TaskStatus, title: 'Concluído', icon: CheckCircle2, color: 'text-emerald-400' },
];

const priorityColors = {
    LOW: 'bg-gray-500/20 text-gray-400',
    MEDIUM: 'bg-amber-500/20 text-amber-400',
    HIGH: 'bg-red-500/20 text-red-400',
};

const priorityLabels = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
};

export default function KanbanPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(task => task.status === status);

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Diretoria
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Kanban</h1>
                            <p className="text-white/50">Gestão de tarefas e projetos</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nova Tarefa
                        </Button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                    {columns.map((column) => {
                        const columnTasks = getTasksByStatus(column.id);
                        const ColumnIcon = column.icon;

                        return (
                            <motion.div
                                key={column.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col"
                            >
                                {/* Column Header */}
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <ColumnIcon className={`w-5 h-5 ${column.color}`} />
                                    <h2 className="font-bold text-white">{column.title}</h2>
                                    <Badge className="bg-white/10 text-white/60 border-0 ml-auto">
                                        {columnTasks.length}
                                    </Badge>
                                </div>

                                {/* Tasks */}
                                <div className="flex-1 space-y-3 min-h-[200px] p-2 rounded-xl bg-white/5 border border-white/10">
                                    {columnTasks.map((task, i) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <AnimatedCard variant="glass" hover className="cursor-grab active:cursor-grabbing">
                                                <div className="flex items-start gap-2">
                                                    <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0 mt-1" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <h3 className="font-medium text-white text-sm line-clamp-2">
                                                                {task.title}
                                                            </h3>
                                                            <button className="text-white/30 hover:text-white/60 flex-shrink-0">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {task.description && (
                                                            <p className="text-xs text-white/40 mb-3 line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge className={`${priorityColors[task.priority]} border-0 text-xs`}>
                                                                {priorityLabels[task.priority]}
                                                            </Badge>

                                                            {task.dueDate && (
                                                                <span className="flex items-center gap-1 text-xs text-white/40">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                    })}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {task.assignee && (
                                                            <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/10">
                                                                <div className="w-5 h-5 rounded-full bg-club-red/30 flex items-center justify-center">
                                                                    <User className="w-3 h-3 text-club-red" />
                                                                </div>
                                                                <span className="text-xs text-white/50">{task.assignee}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </AnimatedCard>
                                        </motion.div>
                                    ))}

                                    {columnTasks.length === 0 && (
                                        <div className="flex items-center justify-center h-24 text-white/30 text-sm">
                                            Nenhuma tarefa
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
