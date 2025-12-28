'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, User, Calendar } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TasksPage() {
    const [tasks, setTasks] = useState<any>({
        todo: [],
        inProgress: [],
        review: [],
        done: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();

            // Organizar por status
            const organized: any = {
                todo: [],
                inProgress: [],
                review: [],
                done: []
            };

            data.tasks?.forEach((task: any) => {
                const status = task.status.toLowerCase().replace('_', '');
                if (organized[status]) {
                    organized[status].push(task);
                }
            });

            setTasks(organized);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        // Atualizar estado local
        const newTasks = { ...tasks };
        const [movedTask] = newTasks[source.droppableId].splice(source.index, 1);
        newTasks[destination.droppableId].splice(destination.index, 0, movedTask);
        setTasks(newTasks);

        // Atualizar no backend
        try {
            await fetch(`/api/tasks/${draggableId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: destination.droppableId.toUpperCase()
                })
            });
        } catch (error) {
            console.error('Error updating task:', error);
            // Reverter em caso de erro
            loadTasks();
        }
    };

    const columns = [
        { id: 'todo', title: 'A Fazer', color: 'bg-gray-500' },
        { id: 'inProgress', title: 'Em Andamento', color: 'bg-blue-500' },
        { id: 'review', title: 'Revisão', color: 'bg-yellow-500' },
        { id: 'done', title: 'Concluído', color: 'bg-green-500' }
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Tarefas da Diretoria"
                subtitle="Kanban Board"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button className="bg-club-red hover:bg-club-red/90 gap-2">
                        <Plus className="w-5 h-5" />
                        Nova Tarefa
                    </Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {columns.map((column) => (
                            <div key={column.id} className="flex flex-col">
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                        <h3 className="text-white font-bold">{column.title}</h3>
                                        <Badge className="bg-white/10 text-white/60 border-white/20">
                                            {tasks[column.id]?.length || 0}
                                        </Badge>
                                    </div>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''
                                                }`}
                                            style={{ minHeight: '200px' }}
                                        >
                                            {tasks[column.id]?.map((task: any, index: number) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <AnimatedCard
                                                                variant="glass"
                                                                className={`p-4 cursor-move ${snapshot.isDragging ? 'opacity-50' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <h4 className="text-white font-medium text-sm flex-1">
                                                                        {task.title}
                                                                    </h4>
                                                                    <button className="text-white/40 hover:text-white">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                {task.description && (
                                                                    <p className="text-white/60 text-xs mb-3 line-clamp-2">
                                                                        {task.description}
                                                                    </p>
                                                                )}

                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Badge className={getPriorityColor(task.priority)}>
                                                                        {task.priority}
                                                                    </Badge>
                                                                    {task.dueDate && (
                                                                        <div className="flex items-center gap-1 text-white/40 text-xs">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {task.assignedTo && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                                            <User className="w-3 h-3 text-white" />
                                                                        </div>
                                                                        <span className="text-white/60 text-xs">
                                                                            {task.assignedTo.name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </AnimatedCard>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>

                {loading && (
                    <div className="text-center text-white/60 py-12">
                        Carregando tarefas...
                    </div>
                )}
            </div>
        </div>
    );
}
