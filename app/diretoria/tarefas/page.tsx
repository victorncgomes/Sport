'use client';

import { useState, useEffect } from 'react';
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
    Clock,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [volunteers, setVolunteers] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
        assigneeId: ''
    });

    useEffect(() => {
        Promise.all([fetchTasks(), fetchVolunteers()]);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await fetch('/api/diretoria/volunteers');
            if (response.ok) {
                const data = await response.json();
                setVolunteers(data);
            }
        } catch (error) {
            console.error("Erro ao buscar voluntários:", error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                setIsModalOpen(false);
                setNewTask({ title: '', description: '', priority: 'MEDIUM', assigneeId: '' });
                fetchTasks();
            }
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;

        const updatedTasks = tasks.map(task =>
            task.id === draggableId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        try {
            await fetch(`/api/tasks/${draggableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error("Erro ao atualizar status da tarefa:", error);
        }
    };

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(task => task.status === status);

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-club-red animate-spin" />
            </div>
        );
    }

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Tarefas</h1>
                            <p className="text-white/50">Gestão de tarefas e projetos</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nova Tarefa
                        </Button>
                    </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                        {columns.map((column) => (
                            <div key={column.id} className="flex flex-col">
                                {/* Column Header */}
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <column.icon className={`w-5 h-5 ${column.color}`} />
                                    <h2 className="font-bold text-white">{column.title}</h2>
                                    <Badge className="bg-white/10 text-white/60 border-0 ml-auto">
                                        {getTasksByStatus(column.id).length}
                                    </Badge>
                                </div>

                                {/* Droppable Column */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`
                                                flex-1 space-y-3 min-h-[500px] p-2 rounded-xl border transition-colors
                                                ${snapshot.isDraggingOver ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}
                                            `}
                                        >
                                            {getTasksByStatus(column.id).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={snapshot.isDragging ? 'opacity-50' : ''}
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
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {getTasksByStatus(column.id).length === 0 && !snapshot.isDraggingOver && (
                                                <div className="flex items-center justify-center h-24 text-white/30 text-sm">
                                                    Nenhuma tarefa
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>

                {/* New Task Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative z-10"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Nova Tarefa</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Título</label>
                                    <input
                                        required
                                        type="text"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Descrição</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-24 resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Prioridade</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                                            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="LOW">Baixa</option>
                                            <option value="MEDIUM">Média</option>
                                            <option value="HIGH">Alta</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Responsável</label>
                                        <select
                                            value={newTask.assigneeId}
                                            onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })}
                                            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="">Não atribuído</option>
                                            {volunteers.map(v => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-club-red hover:bg-club-red/90">
                                        Criar Tarefa
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
