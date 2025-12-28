'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    CheckCircle2,
    Plus,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Star
} from 'lucide-react';

interface VolunteerTask {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    volunteers: number;
    maxVolunteers: number;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function VolunteerCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<VolunteerTask[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock tasks para demonstração
    useEffect(() => {
        const mockTasks: VolunteerTask[] = [
            {
                id: '1',
                title: 'Limpeza da Garagem',
                description: 'Organização e limpeza geral dos equipamentos',
                date: new Date().toISOString().split('T')[0],
                time: '08:00 - 12:00',
                priority: 'HIGH',
                status: 'OPEN',
                volunteers: 2,
                maxVolunteers: 5
            },
            {
                id: '2',
                title: 'Manutenção dos Barcos',
                description: 'Verificar e reparar pequenos danos',
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                time: '14:00 - 18:00',
                priority: 'MEDIUM',
                status: 'OPEN',
                volunteers: 1,
                maxVolunteers: 3
            },
            {
                id: '3',
                title: 'Evento de Boas-Vindas',
                description: 'Recepção de novos sócios',
                date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                time: '10:00 - 13:00',
                priority: 'URGENT',
                status: 'OPEN',
                volunteers: 3,
                maxVolunteers: 8
            }
        ];
        setTasks(mockTasks);
        setLoading(false);
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // Dias vazios antes do primeiro dia
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Dias do mês
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getTasksForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(t => t.date === dateStr);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-500';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-yellow-500';
            default: return 'bg-green-500';
        }
    };

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const days = getDaysInMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Calendário de Voluntariado</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Navegação do Mês */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 text-white/70 hover:text-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-white">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 text-white/70 hover:text-white"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Calendário */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6"
            >
                {/* Dias da Semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-white/50 text-sm py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Dias do Mês */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const isToday = day.getTime() === today.getTime();
                        const isSelected = selectedDate?.getTime() === day.getTime();
                        const dayTasks = getTasksForDate(day);
                        const hasUrgent = dayTasks.some(t => t.priority === 'URGENT');

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    aspect-square rounded-lg flex flex-col items-center justify-center relative
                                    transition-all duration-200
                                    ${isToday ? 'bg-blue-600 text-white' : ''}
                                    ${isSelected && !isToday ? 'bg-white/20 text-white' : ''}
                                    ${!isToday && !isSelected ? 'text-white/70 hover:bg-white/10' : ''}
                                `}
                            >
                                <span className="text-sm">{day.getDate()}</span>
                                {dayTasks.length > 0 && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayTasks.slice(0, 3).map((t, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(t.priority)}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                {hasUrgent && (
                                    <AlertCircle className="w-3 h-3 text-red-400 absolute top-0 right-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Legenda */}
            <div className="flex items-center gap-4 mb-6 text-sm text-white/60">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Baixa
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" /> Média
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" /> Alta
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Urgente
                </div>
            </div>

            {/* Tarefas do Dia Selecionado */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                    {selectedDate
                        ? `Tarefas de ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`
                        : 'Próximas Tarefas'
                    }
                </h3>

                {loading ? (
                    <div className="text-white/50 text-center py-8">Carregando...</div>
                ) : (
                    <div className="space-y-3">
                        {(selectedDate ? getTasksForDate(selectedDate) : tasks).map(task => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                            <h4 className="font-semibold text-white">{task.title}</h4>
                                        </div>
                                        <p className="text-white/60 text-sm mt-1">{task.description}</p>
                                    </div>
                                    {task.priority === 'URGENT' && (
                                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                                            URGENTE
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-white/50 mt-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {task.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {task.volunteers}/{task.maxVolunteers}
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                                    Participar
                                </button>
                            </motion.div>
                        ))}

                        {(selectedDate ? getTasksForDate(selectedDate) : tasks).length === 0 && (
                            <div className="text-center text-white/50 py-8">
                                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhuma tarefa para este dia</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
