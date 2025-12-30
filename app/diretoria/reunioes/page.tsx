'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    ChevronRight,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const typeConfig: Record<string, { label: string, color: string }> = {
    ORDINARY: { label: 'Ordinária', color: 'bg-blue-500/20 text-blue-400' },
    EXTRAORDINARY: { label: 'Extraordinária', color: 'bg-amber-500/20 text-amber-400' },
    BOARD: { label: 'Diretoria', color: 'bg-purple-500/20 text-purple-400' },
};

const statusConfig: Record<string, { label: string, color: string }> = {
    SCHEDULED: { label: 'Agendada', color: 'bg-emerald-500/20 text-emerald-400' },
    COMPLETED: { label: 'Realizada', color: 'bg-white/10 text-white/60' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400' },
};

export default function ReunioesPage() {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        date: '',
        time: '',
        location: 'Sede do Clube',
        type: 'BOARD',
        agenda: '',
        participants: [] as string[]
    });

    useEffect(() => {
        Promise.all([fetchMeetings(), fetchVolunteers()]);
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await fetch('/api/diretoria/reunioes');
            if (response.ok) {
                const data = await response.json();
                setMeetings(data);
            }
        } catch (error) {
            console.error("Erro ao buscar reuniões:", error);
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
            console.error("Erro ao buscar participantes:", error);
        }
    };

    const handleCreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/diretoria/reunioes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newMeeting,
                    date: `${newMeeting.date}T${newMeeting.time}:00`
                })
            });

            if (response.ok) {
                setIsModalOpen(false);
                setNewMeeting({
                    title: '',
                    date: '',
                    time: '',
                    location: 'Sede do Clube',
                    type: 'BOARD',
                    agenda: '',
                    participants: []
                });
                fetchMeetings();
            }
        } catch (error) {
            console.error("Erro ao criar reunião:", error);
        }
    };

    const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
    const [isMinutesModalOpen, setIsMinutesModalOpen] = useState(false);
    const [minutesData, setMinutesData] = useState({
        minutes: '',
        attendeesCount: 0
    });

    const handleSaveMinutes = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/diretoria/reunioes/${selectedMeeting.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minutes: minutesData.minutes,
                    attendeesCount: Number(minutesData.attendeesCount),
                    status: 'COMPLETED'
                })
            });

            if (response.ok) {
                setIsMinutesModalOpen(false);
                setSelectedMeeting(null);
                fetchMeetings();
            }
        } catch (error) {
            console.error("Erro ao salvar ata:", error);
        }
    };

    const handleOpenMinutes = (meeting: any) => {
        setSelectedMeeting(meeting);
        setMinutesData({
            minutes: meeting.minutes || '',
            attendeesCount: meeting.attendeesCount || meeting.participants?.length || 0
        });
        setIsMinutesModalOpen(true);
    };

    const upcomingMeetings = meetings.filter(m => m.status === 'SCHEDULED');
    const pastMeetings = meetings.filter(m => m.status === 'COMPLETED');

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Reuniões</h1>
                            <p className="text-white/50">Assembleias, atas e convocações</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-club-red hover:bg-club-red/90 font-bold italic">
                            <Plus className="w-4 h-4" />
                            Nova Reunião
                        </Button>
                    </div>
                </div>

                {/* Próximas Reuniões */}
                <section className="mb-12">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-club-gold" />
                        Próximas Reuniões
                    </h2>

                    {upcomingMeetings.length === 0 ? (
                        <p className="text-white/30 text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02] italic font-medium">
                            Nenhuma reunião agendada no momento.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingMeetings.map((meeting, i) => (
                                <motion.div
                                    key={meeting.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AnimatedCard variant="gradient" hover className="border border-club-gold/20">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Date box */}
                                            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-club-red flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => handleOpenMinutes(meeting)}>
                                                <span className="text-2xl font-bold">
                                                    {new Date(meeting.date).getDate()}
                                                </span>
                                                <span className="text-xs uppercase font-medium">
                                                    {new Date(meeting.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge className={`${typeConfig[meeting.type]?.color || 'bg-white/10 text-white/60'} border-0 font-bold italic`}>
                                                        {typeConfig[meeting.type]?.label || meeting.type}
                                                    </Badge>
                                                    <Badge className={`${statusConfig[meeting.status]?.color || 'bg-white/10 text-white/60'} border-0 font-bold italic`}>
                                                        {statusConfig[meeting.status]?.label || meeting.status}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-bold text-white mb-2 text-lg">{meeting.title}</h3>

                                                <div className="flex flex-wrap gap-4 text-sm text-white/50">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(meeting.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {meeting.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {meeting.participants?.length || 0} convidados
                                                    </span>
                                                </div>

                                                {meeting.agenda && (
                                                    <p className="mt-3 text-sm text-white/40 line-clamp-2 italic">
                                                        <span className="text-white/60 font-bold not-italic font-medium">Pauta:</span> {meeting.agenda}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-club-gold/50 text-club-gold hover:bg-club-gold/10 font-bold italic"
                                                    onClick={() => handleOpenMinutes(meeting)}
                                                >
                                                    Concluir / Ata
                                                </Button>
                                                <ChevronRight className="w-5 h-5 text-white/30 hidden sm:block" />
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reuniões Anteriores */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-white/50" />
                        Reuniões Anteriores
                    </h2>

                    <div className="space-y-3">
                        {pastMeetings.map((meeting, i) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-white/50">
                                            <span className="text-sm font-bold">
                                                {new Date(meeting.date).getDate()}
                                            </span>
                                            <span className="text-[10px] uppercase">
                                                {new Date(meeting.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white truncate">{meeting.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <Badge className={`${typeConfig[meeting.type]?.color || 'bg-white/10'} border-0 text-[10px] px-1.5`}>
                                                    {typeConfig[meeting.type]?.label || meeting.type}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {meeting.attendeesCount || 0} participantes
                                                </span>
                                            </div>
                                        </div>

                                        {meeting.minutes && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-club-gold hover:text-club-gold hover:bg-club-gold/10 font-bold italic uppercase"
                                                onClick={() => handleOpenMinutes(meeting)}
                                            >
                                                <FileText className="w-4 h-4" />
                                                Ver Ata
                                            </Button>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                        {pastMeetings.length === 0 && (
                            <p className="text-white/20 text-center py-6 text-sm italic font-medium">Nenhuma reunião anterior com ata registrada.</p>
                        )}
                    </div>
                </section>

                {/* New Meeting Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative z-10 overflow-y-auto max-h-[90vh]"
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <Calendar className="w-6 h-6 text-club-red" />
                                    Nova Reunião
                                </h2>
                                <form onSubmit={handleCreateMeeting} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1 font-medium italic">Título da Reunião</label>
                                        <input
                                            required
                                            type="text"
                                            value={newMeeting.title}
                                            onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all"
                                            placeholder="Ex: Reunião de Diretoria Mensal"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-medium italic">Data</label>
                                            <input
                                                required
                                                type="date"
                                                value={newMeeting.date}
                                                onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all color-scheme-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-medium italic">Hora</label>
                                            <input
                                                required
                                                type="time"
                                                value={newMeeting.time}
                                                onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all color-scheme-dark"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-medium italic">Local</label>
                                            <input
                                                required
                                                type="text"
                                                value={newMeeting.location}
                                                onChange={e => setNewMeeting({ ...newMeeting, location: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-medium italic">Tipo</label>
                                            <select
                                                value={newMeeting.type}
                                                onChange={e => setNewMeeting({ ...newMeeting, type: e.target.value })}
                                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all"
                                            >
                                                <option value="BOARD">Diretoria</option>
                                                <option value="ORDINARY">Assembleia Ordinária</option>
                                                <option value="EXTRAORDINARY">Assembleia Extraordinária</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-1 font-medium italic">Pauta / Assuntos</label>
                                        <textarea
                                            value={newMeeting.agenda}
                                            onChange={e => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-club-red/50 transition-all"
                                            placeholder="Liste os principais tópicos da reunião..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-2 font-medium italic">Convocar Participantes</label>
                                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10 custom-scrollbar">
                                            {volunteers.map(v => (
                                                <label key={v.id} className="flex items-center gap-2 text-xs text-white/70 hover:text-white cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={newMeeting.participants.includes(v.id)}
                                                        onChange={e => {
                                                            const checked = e.target.checked;
                                                            setNewMeeting(prev => ({
                                                                ...prev,
                                                                participants: checked
                                                                    ? [...prev.participants, v.id]
                                                                    : prev.participants.filter(id => id !== v.id)
                                                            }));
                                                        }}
                                                        className="rounded border-white/20 bg-white/5 text-club-red focus:ring-club-red/50 w-3.5 h-3.5"
                                                    />
                                                    <span className="truncate group-hover:translate-x-1 transition-transform">{v.name}</span>
                                                </label>
                                            ))}
                                            {volunteers.length === 0 && (
                                                <div className="col-span-2 text-center text-[10px] text-white/30 italic py-2">Nenhum voluntário/diretor disponível.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 hover:bg-white/5 text-sm font-bold uppercase tracking-widest text-white/40"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-club-red hover:bg-club-red/90 text-sm font-bold uppercase tracking-widest shadow-lg shadow-club-red/20"
                                        >
                                            Agendar Reunião
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Minutes Modal */}
                <AnimatePresence>
                    {isMinutesModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setIsMinutesModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative z-10 overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Ata da Reunião</h2>
                                        <p className="text-sm text-white/40 italic">{selectedMeeting?.title}</p>
                                    </div>
                                    <Badge className={`${statusConfig[selectedMeeting?.status]?.color || 'bg-white/10'} border-0 font-bold italic`}>
                                        {statusConfig[selectedMeeting?.status]?.label || selectedMeeting?.status}
                                    </Badge>
                                </div>

                                <form onSubmit={handleSaveMinutes} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-medium italic">Data da Reunião</label>
                                            <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/50">
                                                {new Date(selectedMeeting?.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1 font-bold italic">Número de Presentes</label>
                                            <input
                                                required
                                                type="number"
                                                value={minutesData.attendeesCount}
                                                onChange={e => setMinutesData({ ...minutesData, attendeesCount: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-club-red/50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-1 font-bold italic">Registro da Ata</label>
                                        <textarea
                                            required
                                            value={minutesData.minutes}
                                            onChange={e => setMinutesData({ ...minutesData, minutes: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white h-64 resize-none focus:outline-none focus:ring-2 focus:ring-club-red/50 font-serif leading-relaxed"
                                            placeholder="Descreva o que foi discutido, decisões tomadas e próximos passos..."
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 font-bold italic text-white/40 uppercase tracking-widest text-sm"
                                            onClick={() => setIsMinutesModalOpen(false)}
                                        >
                                            {selectedMeeting?.status === 'COMPLETED' ? 'Fechar' : 'Cancelar'}
                                        </Button>
                                        {selectedMeeting?.status !== 'COMPLETED' && (
                                            <Button
                                                type="submit"
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold italic uppercase tracking-widest shadow-lg shadow-emerald-500/20 text-sm"
                                            >
                                                Finalizar Reunião e Salvar Ata
                                            </Button>
                                        )}
                                        {selectedMeeting?.status === 'COMPLETED' && (
                                            <Button
                                                type="submit"
                                                className="flex-1 bg-club-red hover:bg-club-red/90 text-white font-bold italic uppercase tracking-widest shadow-lg shadow-club-red/20 text-sm"
                                            >
                                                Atualizar Ata
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .color-scheme-dark {
                    color-scheme: dark;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
