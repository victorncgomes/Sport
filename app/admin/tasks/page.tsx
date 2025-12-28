'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Plus,
    MoreHorizontal,
    Calendar,
    User,
    AlertCircle,
    CheckCircle2,
    Clock,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

interface AdminTask {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    dueDate: string;
    status: TaskStatus;
}

const mockTasks: AdminTask[] = [
    { id: '1', title: 'Renovação do Seguro da Garagem', description: 'Assinar contrato de renovação com a seguradora para o biênio 2025/2026.', priority: 'high', assignee: 'Carlos Melo', dueDate: '2024-12-30', status: 'todo' },
    { id: '2', title: 'Conserto do Pier Oeste', description: 'Troca das tábuas avariadas no píer de embarque das canoas.', priority: 'medium', assignee: 'Roberto Lima', dueDate: '2024-12-23', status: 'in-progress' },
    { id: '3', title: 'Prestação de Contas Trimestral', description: 'Consolidar notas fiscais para a reunião de conselho.', priority: 'high', assignee: 'Marcos Oliveira', dueDate: '2024-12-28', status: 'todo' },
    { id: '4', title: 'Organizar Fotos Históricas', description: 'Digitalização das fotos da regata de 1952 para a galeria.', priority: 'low', assignee: 'Juliana Medeiros', dueDate: '2025-01-15', status: 'review' },
    { id: '5', title: 'Limpeza dos Carrinhos de Barco', description: 'Manutenção preventiva nas rodas e suportes.', priority: 'medium', assignee: 'Funcionário SCN', dueDate: '2024-12-20', status: 'done' },
];

export default function AdminTasksPage() {
    const columns: { id: TaskStatus, label: string, icon: any }[] = [
        { id: 'todo', label: 'A Fazer', icon: AlertCircle },
        { id: 'in-progress', label: 'Fazendo', icon: Clock },
        { id: 'review', label: 'Revisão', icon: Filter },
        { id: 'done', label: 'Concluído', icon: CheckCircle2 },
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Gestão de Atividades"
                subtitle="Kanban Administrativo"
                description="Delegue tarefas e acompanhe o progresso das ações de manutenção e gestão do clube."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Fluxo de Trabalho</h2>
                            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Board da Diretoria</p>
                        </div>
                    </div>
                    <Button className="bg-club-red hover:bg-club-red-700 font-black uppercase tracking-widest text-xs gap-2 py-6 px-8 shadow-glow-red">
                        <Plus className="w-5 h-5" /> Nova Tarefa
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {columns.map((col) => (
                        <div key={col.id} className="space-y-4">
                            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <col.icon className={cn("w-4 h-4",
                                        col.id === 'todo' ? 'text-white/40' :
                                            col.id === 'in-progress' ? 'text-blue-400' :
                                                col.id === 'review' ? 'text-club-gold' : 'text-emerald-500'
                                    )} />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">{col.label}</span>
                                </div>
                                <span className="text-[10px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                                    {mockTasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {mockTasks.filter(t => t.status === col.id).map((task) => (
                                    <AnimatedCard key={task.id} variant="glass" className="p-4 hover:border-white/20 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={cn("px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest",
                                                task.priority === 'high' ? 'bg-club-red/20 text-club-red' :
                                                    task.priority === 'medium' ? 'bg-club-gold/20 text-club-gold' : 'bg-white/5 text-white/40'
                                            )}>
                                                {task.priority}
                                            </span>
                                            <Button variant="ghost" size="icon" className="w-6 h-6 text-white/10 group-hover:text-white">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-club-red transition-colors">{task.title}</h4>
                                        <p className="text-[10px] text-white/40 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                    <User className="w-3 h-3 text-white/30" />
                                                </div>
                                                <span className="text-[8px] font-bold text-white/30 uppercase">{task.assignee}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/20 uppercase">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                ))}

                                <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-2 text-white/10 hover:text-white/30 hover:border-white/10 transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-black tracking-widest">Add Cartão</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
