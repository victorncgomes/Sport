'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Heart,
    Users,
    Calendar,
    Award,
    Clock,
    Target,
    Send,
    FileText,
    Bell,
    Eye,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VOLUNTEER_AREAS,
    VOLUNTEER_DAYS,
    generateTimeSlots,
    getAreaById,
    getAreaColorClass
} from '@/lib/config/volunteer-areas';
import { AreaBadge } from '@/components/volunteer/area-selector';
import { cn } from '@/lib/utils';

// Tipo para slot com voluntários
interface VolunteerSlotWithUser {
    slot: {
        areaId: string;
        dayOfWeek: number;
        hour: number;
    };
    userName: string;
    userId: string;
}

// Dados mockados para demonstração (substitua por dados reais da API)
const mockVolunteersData: VolunteerSlotWithUser[] = [
    { slot: { areaId: 'MIDIA', dayOfWeek: 1, hour: 9 }, userName: 'Maria Helena', userId: '1' },
    { slot: { areaId: 'MIDIA', dayOfWeek: 1, hour: 10 }, userName: 'Maria Helena', userId: '1' },
    { slot: { areaId: 'STORE', dayOfWeek: 2, hour: 14 }, userName: 'Pedro Santos', userId: '2' },
    { slot: { areaId: 'LIMPEZA', dayOfWeek: 6, hour: 8 }, userName: 'Ana Beatriz', userId: '3' },
    { slot: { areaId: 'LIMPEZA', dayOfWeek: 6, hour: 9 }, userName: 'Ana Beatriz', userId: '3' },
    { slot: { areaId: 'LIMPEZA', dayOfWeek: 6, hour: 8 }, userName: 'Carlos Eduardo', userId: '4' },
    { slot: { areaId: 'MANUTENCAO', dayOfWeek: 3, hour: 16 }, userName: 'João Silva', userId: '5' },
    { slot: { areaId: 'TREINAMENTO', dayOfWeek: 2, hour: 6 }, userName: 'Mariana Costa', userId: '6' },
    { slot: { areaId: 'TREINAMENTO', dayOfWeek: 4, hour: 6 }, userName: 'Mariana Costa', userId: '6' },
    { slot: { areaId: 'ATENDIMENTO', dayOfWeek: 5, hour: 10 }, userName: 'Lucas Ferreira', userId: '7' },
];

type TabView = 'calendar' | 'areas' | 'messages' | 'terms';

export default function VoluntariadoDiretoriaPage() {
    const [view, setView] = useState<TabView>('calendar');
    const [allSlots, setAllSlots] = useState<VolunteerSlotWithUser[]>(mockVolunteersData);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [expandedArea, setExpandedArea] = useState<string | null>(null);
    const [messageArea, setMessageArea] = useState<string>('ALL');
    const [messageText, setMessageText] = useState<string>('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const timeSlots = generateTimeSlots();
    const availableDays = VOLUNTEER_DAYS.filter(d => d.available);

    // Estatísticas
    const totalVolunteers = new Set(allSlots.map(s => s.userId)).size;
    const totalHours = allSlots.length;
    const areasWithVolunteers = new Set(allSlots.map(s => s.slot.areaId)).size;

    // Filtrar por área se selecionada
    const filteredSlots = selectedArea
        ? allSlots.filter(s => s.slot.areaId === selectedArea)
        : allSlots;

    // Obter slots para uma célula específica
    const getSlotsForCell = (dayOfWeek: number, hour: number) => {
        return filteredSlots.filter(s => s.slot.dayOfWeek === dayOfWeek && s.slot.hour === hour);
    };

    // Enviar mensagem para área
    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        setSendingMessage(true);
        try {
            await fetch('/api/volunteer/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ areaId: messageArea, message: messageText })
            });
            setMessageText('');
            // Mostrar feedback de sucesso
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    // Calcular voluntários por área
    const volunteersByArea = VOLUNTEER_AREAS.map(area => {
        const areaSlots = allSlots.filter(s => s.slot.areaId === area.id);
        const uniqueVolunteers = new Set(areaSlots.map(s => s.userId));
        return {
            ...area,
            volunteerCount: uniqueVolunteers.size,
            hoursCount: areaSlots.length
        };
    });

    const [terms, setTerms] = useState<any[]>([]);

    useEffect(() => {
        if (view === 'terms') {
            fetchTerms();
        }
    }, [view]);

    const fetchTerms = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/diretoria/volunteers/terms');
            if (response.ok) {
                const data = await response.json();
                setTerms(data);
            }
        } catch (error) {
            console.error('Erro ao buscar termos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* ... rest of the component remains same ... */}
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Painel da Diretoria
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Controle do Voluntariado</h1>
                            <p className="text-white/50">Gestão de escalas, áreas e voluntários</p>
                        </div>
                        <Button className="gap-2 bg-club-red hover:bg-club-red/90" onClick={() => alert('Funcionalidade de adicionar nova área será implementada. Por enquanto, edite o arquivo lib/config/volunteer-areas.ts')}>
                            <Target className="w-4 h-4" />
                            Nova Área
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Users className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{totalVolunteers}</div>
                        <div className="text-xs text-white/40">Voluntários Ativos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{areasWithVolunteers}</div>
                        <div className="text-xs text-white/40">Áreas Cobertas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Clock className="w-6 h-6 text-club-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{totalHours}h</div>
                        <div className="text-xs text-white/40">Horas/Semana</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{VOLUNTEER_AREAS.length}</div>
                        <div className="text-xs text-white/40">Áreas de Atuação</div>
                    </AnimatedCard>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8 whitespace-nowrap overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setView('calendar')}
                        className={cn(
                            "px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                            view === 'calendar' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                        )}
                    >
                        <Calendar className="w-4 h-4" />
                        Calendário Semanal
                    </button>
                    <button
                        onClick={() => setView('areas')}
                        className={cn(
                            "px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                            view === 'areas' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                        )}
                    >
                        <Target className="w-4 h-4" />
                        Gestão de Áreas
                    </button>
                    <button
                        onClick={() => setView('messages')}
                        className={cn(
                            "px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                            view === 'messages' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                        )}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Mensagens
                    </button>
                    <button
                        onClick={() => setView('terms')}
                        className={cn(
                            "px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                            view === 'terms' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        Termos Assinados
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {view === 'calendar' && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Filtro por Área */}
                            <div className="mb-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedArea(null)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        !selectedArea
                                            ? "bg-club-red text-white"
                                            : "bg-white/10 text-white/60 hover:bg-white/20"
                                    )}
                                >
                                    Todas as Áreas
                                </button>
                                {VOLUNTEER_AREAS.map(area => (
                                    <button
                                        key={area.id}
                                        onClick={() => setSelectedArea(area.id)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            selectedArea === area.id
                                                ? `${area.colorClass} text-white`
                                                : "bg-white/10 text-white/60 hover:bg-white/20"
                                        )}
                                    >
                                        {area.name}
                                    </button>
                                ))}
                            </div>

                            {/* Calendário */}
                            <AnimatedCard variant="glass" className="overflow-hidden">
                                <div className="p-4 bg-white/5 border-b border-white/10">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-club-gold" />
                                        Escala Semanal de Voluntários
                                    </h2>
                                    <p className="text-sm text-white/50">Visualize a disponibilidade de todos os voluntários</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px]">
                                        <thead>
                                            <tr className="bg-white/5">
                                                <th className="p-3 text-left text-xs font-bold text-white/40 uppercase w-20">
                                                    Horário
                                                </th>
                                                {availableDays.map(day => (
                                                    <th
                                                        key={day.id}
                                                        className="p-3 text-center text-xs font-bold text-white/60 uppercase"
                                                    >
                                                        {day.short}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timeSlots.map((time) => {
                                                const hour = parseInt(time.split(':')[0]);
                                                return (
                                                    <tr key={time} className="border-t border-white/5">
                                                        <td className="p-2 text-sm font-mono text-white/40">
                                                            {time}
                                                        </td>
                                                        {availableDays.map(day => {
                                                            const cellSlots = getSlotsForCell(day.id, hour);
                                                            const hasVolunteers = cellSlots.length > 0;

                                                            return (
                                                                <td
                                                                    key={day.id}
                                                                    className="p-1 text-center"
                                                                >
                                                                    <div className={cn(
                                                                        "min-h-[50px] rounded-lg flex flex-wrap gap-1 justify-center items-center p-1",
                                                                        hasVolunteers ? "bg-white/5" : ""
                                                                    )}>
                                                                        {cellSlots.length === 0 ? (
                                                                            <span className="text-white/10 text-xs">-</span>
                                                                        ) : (
                                                                            cellSlots.map((s, i) => {
                                                                                const slotArea = getAreaById(s.slot.areaId);
                                                                                return (
                                                                                    <div
                                                                                        key={i}
                                                                                        className={cn(
                                                                                            "px-2 py-1 rounded text-[10px] font-bold text-white truncate max-w-[90px]",
                                                                                            slotArea?.colorClass || 'bg-gray-500'
                                                                                        )}
                                                                                        title={`${s.userName} - ${slotArea?.name}`}
                                                                                    >
                                                                                        {s.userName.split(' ')[0]}
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Legenda */}
                                <div className="p-4 border-t border-white/10 bg-white/5">
                                    <p className="text-xs text-white/40 mb-2 font-bold uppercase">Legenda das Áreas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {VOLUNTEER_AREAS.map(area => (
                                            <div
                                                key={area.id}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold text-white",
                                                    area.colorClass
                                                )}
                                            >
                                                {area.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    )}

                    {view === 'areas' && (
                        <motion.div
                            key="areas"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {volunteersByArea.map(area => (
                                <AnimatedCard key={area.id} variant="glass" className="overflow-hidden">
                                    <button
                                        onClick={() => setExpandedArea(expandedArea === area.id ? null : area.id)}
                                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", area.colorClass)}>
                                                <Heart className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-bold">{area.name}</h3>
                                                <p className="text-white/50 text-sm">{area.volunteerCount} voluntários • {area.hoursCount}h/semana</p>
                                            </div>
                                        </div>
                                        {expandedArea === area.id ? (
                                            <ChevronUp className="w-5 h-5 text-white/40" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-white/40" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {expandedArea === area.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/10"
                                            >
                                                <div className="p-4 space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white/60 mb-2">Descrição</h4>
                                                        <p className="text-white/80 text-sm">{area.description}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white/60 mb-2">Guia da Área</h4>
                                                        <div className="bg-white/5 rounded-lg p-4 text-sm text-white/70 whitespace-pre-line max-h-60 overflow-y-auto">
                                                            {area.guide || 'Guia não definido'}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full gap-2"
                                                        onClick={() => {
                                                            setMessageArea(area.id);
                                                            setView('messages');
                                                        }}
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        Enviar Mensagem para {area.name}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </AnimatedCard>
                            ))}
                        </motion.div>
                    )}

                    {view === 'messages' && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <AnimatedCard variant="glass" className="p-6">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-club-gold" />
                                    Enviar Mensagem para Voluntários
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/60 mb-2">
                                            Destinatários
                                        </label>
                                        <select
                                            value={messageArea}
                                            onChange={(e) => setMessageArea(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-club-red"
                                        >
                                            <option value="ALL">📢 Todos os Voluntários</option>
                                            {VOLUNTEER_AREAS.map(area => (
                                                <option key={area.id} value={area.id}>
                                                    {area.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-white/60 mb-2">
                                            Mensagem
                                        </label>
                                        <textarea
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Digite a mensagem para os voluntários..."
                                            rows={4}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-club-red resize-none"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!messageText.trim() || sendingMessage}
                                        className="w-full bg-club-red hover:bg-club-red/90 h-12 text-lg font-bold gap-2"
                                    >
                                        {sendingMessage ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Enviar Mensagem
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    )}

                    {view === 'terms' && (
                        <motion.div
                            key="terms"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <AnimatedCard variant="glass" className="p-6">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-club-gold" />
                                    Termos de Adesão Assinados
                                </h2>

                                <p className="text-white/50 text-sm mb-4">
                                    Lista de todos os sócios que assinaram o termo de voluntariado.
                                </p>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-club-red animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {terms.map((term, i) => (
                                            <div
                                                key={term.id || i}
                                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold">
                                                        {term.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '?'}
                                                    </div>
                                                    <div>
                                                        <span className="text-white font-medium block">{term.user?.name}</span>
                                                        <span className="text-white/30 text-[10px] uppercase font-bold tracking-wider">{term.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/40 text-sm">
                                                        {new Date(term.acceptedAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-club-gold hover:text-club-gold hover:bg-club-gold/10 font-bold italic">
                                                        <Eye className="w-3 h-3" />
                                                        Ver Termo
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {terms.length === 0 && (
                                            <div className="text-center py-12 text-white/20 italic font-medium">Nenhum termo de adesão encontrado.</div>
                                        )}
                                    </div>
                                )}
                            </AnimatedCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
