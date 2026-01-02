'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Ship,
    Anchor,
    AlertCircle,
    Wrench,
    Clock,
    BarChart3,
    Calendar,
    TrendingUp,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { garageBoats } from '@/lib/data/garage-boats';
import { cn } from '@/lib/utils';

// Dados simulados de estatísticas
const boatStats = [
    { name: 'Potengi I', type: '1x', hoursUsed: 156, reservations: 48, performance: 92, lastMaintenance: '2025-01-15' },
    { name: 'Natal', type: '4-', hoursUsed: 234, reservations: 72, performance: 88, lastMaintenance: '2025-01-10' },
    { name: 'Potengi II', type: '2x', hoursUsed: 189, reservations: 56, performance: 95, lastMaintenance: '2025-01-20' },
    { name: 'SCN Master', type: '8+', hoursUsed: 312, reservations: 95, performance: 78, lastMaintenance: '2024-12-28' },
    { name: 'Alecrim', type: '1x', hoursUsed: 98, reservations: 32, performance: 97, lastMaintenance: '2025-01-18' },
];

const maintenanceLog = [
    { boat: 'SCN Master', issue: 'Banco deslizante com folga', status: 'pending', date: '2025-01-22', priority: 'HIGH' },
    { boat: 'Natal', issue: 'Verificar casco (raspado)', status: 'in_progress', date: '2025-01-21', priority: 'MEDIUM' },
    { boat: 'Potengi I', issue: 'Troca de stretcher', status: 'completed', date: '2025-01-18', priority: 'LOW' },
    { boat: 'Alecrim', issue: 'Revisão geral trimestral', status: 'scheduled', date: '2025-02-01', priority: 'MEDIUM' },
];

const upcomingReservations = [
    { boat: 'Potengi I', user: 'João Silva', date: '2025-01-24', time: '06:00 - 07:30', category: 'Single' },
    { boat: 'Natal', user: 'Equipe Júnior', date: '2025-01-24', time: '08:00 - 10:00', category: 'Quad' },
    { boat: 'Potengi II', user: 'Ana & Bia', date: '2025-01-24', time: '16:00 - 17:30', category: 'Double' },
    { boat: 'SCN Master', user: 'Equipe Master', date: '2025-01-25', time: '07:00 - 09:00', category: 'Oito' },
];

export default function GaragemDiretoriaPage() {
    const [activeTab, setActiveTab] = useState<'stats' | 'maintenance' | 'reservations'>('stats');
    const [showNewMaintenanceModal, setShowNewMaintenanceModal] = useState(false);
    const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
    const [maintenanceForm, setMaintenanceForm] = useState({
        boat: '',
        issue: '',
        priority: 'MEDIUM',
        scheduledDate: ''
    });

    const totalBoats = garageBoats.length;
    const availableBoats = garageBoats.filter(b => b.status === 'available').length;
    const maintenanceBoats = garageBoats.filter(b => b.status === 'maintenance').length;
    const inUseBoats = garageBoats.filter(b => b.status === 'in-use').length;

    const totalHours = boatStats.reduce((sum, b) => sum + b.hoursUsed, 0);
    const avgPerformance = Math.round(boatStats.reduce((sum, b) => sum + b.performance, 0) / boatStats.length);

    const handleNewMaintenance = () => {
        // Simulação de salvar (em produção, faria API call)
        console.log('Nova manutenção:', maintenanceForm);
        setShowNewMaintenanceModal(false);
        setMaintenanceForm({ boat: '', issue: '', priority: 'MEDIUM', scheduledDate: '' });
    };

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Ship className="w-8 h-8 text-sky-500" />
                                Controle da Garagem
                            </h1>
                            <p className="text-white/50">Manutenção, agendamentos e estatísticas de barcos</p>
                        </div>
                        <Button onClick={() => setShowNewMaintenanceModal(true)} className="gap-2 bg-sky-600 hover:bg-sky-700">
                            <Wrench className="w-4 h-4" />
                            Nova Manutenção
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Ship className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{totalBoats}</div>
                        <p className="text-xs text-white/50">Total Frota</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-green-500/20 bg-green-500/5">
                        <Anchor className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-400">{availableBoats}</div>
                        <p className="text-xs text-green-400/70">Disponíveis</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-blue-500/20 bg-blue-500/5">
                        <Ship className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400">{inUseBoats}</div>
                        <p className="text-xs text-blue-400/70">Na Água</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20 bg-amber-500/5">
                        <Wrench className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{maintenanceBoats}</div>
                        <p className="text-xs text-amber-400/70">Manutenção</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-purple-500/20 bg-purple-500/5">
                        <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-400">{totalHours}h</div>
                        <p className="text-xs text-purple-400/70">Total Horas</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20 bg-emerald-500/5">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{avgPerformance}%</div>
                        <p className="text-xs text-emerald-400/70">Performance</p>
                    </AnimatedCard>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'stats' ? "border-sky-500 text-sky-400" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Estatísticas
                    </button>
                    <button
                        onClick={() => setActiveTab('maintenance')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'maintenance' ? "border-sky-500 text-sky-400" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        <Wrench className="w-4 h-4 inline mr-2" />
                        Manutenção
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={cn("px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'reservations' ? "border-sky-500 text-sky-400" : "border-transparent text-white/40 hover:text-white"
                        )}
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Agendamentos
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'stats' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">Uso e Performance dos Barcos</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 text-white/50 font-bold">Barco</th>
                                            <th className="text-left py-3 text-white/50 font-bold">Tipo</th>
                                            <th className="text-center py-3 text-white/50 font-bold">Horas Uso</th>
                                            <th className="text-center py-3 text-white/50 font-bold">Reservas</th>
                                            <th className="text-center py-3 text-white/50 font-bold">Performance</th>
                                            <th className="text-left py-3 text-white/50 font-bold">Última Manutenção</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boatStats.map((boat, i) => (
                                            <motion.tr
                                                key={boat.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/5"
                                            >
                                                <td className="py-4 text-white font-bold">{boat.name}</td>
                                                <td className="py-4">
                                                    <Badge className="bg-sky-500/20 text-sky-400 border-0">{boat.type}</Badge>
                                                </td>
                                                <td className="py-4 text-center text-white">{boat.hoursUsed}h</td>
                                                <td className="py-4 text-center text-white">{boat.reservations}</td>
                                                <td className="py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn("h-full rounded-full",
                                                                    boat.performance >= 90 ? "bg-emerald-500" :
                                                                        boat.performance >= 80 ? "bg-amber-500" : "bg-red-500"
                                                                )}
                                                                style={{ width: `${boat.performance}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-white/70">{boat.performance}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-white/50">
                                                    {new Date(boat.lastMaintenance).toLocaleDateString('pt-BR')}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">Log de Manutenções</h3>
                            <div className="grid gap-4">
                                {maintenanceLog.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <AnimatedCard variant="glass" className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                                                        item.status === 'completed' ? "bg-emerald-500/20" :
                                                            item.status === 'in_progress' ? "bg-blue-500/20" :
                                                                item.status === 'pending' ? "bg-red-500/20" : "bg-amber-500/20"
                                                    )}>
                                                        {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                                                            item.status === 'in_progress' ? <Clock className="w-5 h-5 text-blue-400" /> :
                                                                item.status === 'pending' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
                                                                    <Calendar className="w-5 h-5 text-amber-400" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{item.boat}</h4>
                                                        <p className="text-sm text-white/60">{item.issue}</p>
                                                        <p className="text-xs text-white/30 mt-1">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn("border-0",
                                                        item.priority === 'HIGH' ? "bg-red-500/20 text-red-400" :
                                                            item.priority === 'MEDIUM' ? "bg-amber-500/20 text-amber-400" : "bg-gray-500/20 text-gray-400"
                                                    )}>
                                                        {item.priority === 'HIGH' ? 'Alta' : item.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                                                    </Badge>
                                                    <Badge className={cn("border-0",
                                                        item.status === 'completed' ? "bg-emerald-500/20 text-emerald-400" :
                                                            item.status === 'in_progress' ? "bg-blue-500/20 text-blue-400" :
                                                                item.status === 'pending' ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                                                    )}>
                                                        {item.status === 'completed' ? 'Concluído' :
                                                            item.status === 'in_progress' ? 'Em Andamento' :
                                                                item.status === 'pending' ? 'Pendente' : 'Agendado'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">Próximas Reservas</h3>
                            <div className="grid gap-4">
                                {upcomingReservations.map((res, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <AnimatedCard variant="glass" className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                                                        <Ship className="w-5 h-5 text-sky-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{res.boat}</h4>
                                                        <p className="text-sm text-white/60">{res.user}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-white/50">
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {new Date(res.date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className="text-club-gold">
                                                        <Clock className="w-4 h-4 inline mr-1" />
                                                        {res.time}
                                                    </span>
                                                    <Badge className="bg-sky-500/20 text-sky-400 border-0">{res.category}</Badge>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
