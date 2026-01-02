'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    Clock,
    Camera,
    Wrench,
    ShoppingBag,
    Smartphone,
    Briefcase,
    Dumbbell,
    MessageCircle,
    Sparkles,
    CheckCircle,
    Save,
    Loader2,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const AREAS_VOLUNTARIADO = [
    { id: 'MIDIA', label: 'Mídia e Comunicação', icon: Camera, color: 'text-purple-400' },
    { id: 'STORE', label: 'Store', icon: ShoppingBag, color: 'text-amber-400' },
    { id: 'MANUTENCAO_BARCOS', label: 'Manutenção de Barcos', icon: Wrench, color: 'text-red-400' },
    { id: 'LIMPEZA_CLUBE', label: 'Limpeza do Clube', icon: Sparkles, color: 'text-emerald-400' },
    { id: 'BETA_TESTERS', label: 'Beta Testers do Aplicativo', icon: Smartphone, color: 'text-cyan-400' },
    { id: 'ADMINISTRATIVO', label: 'Área Administrativa', icon: Briefcase, color: 'text-indigo-400' },
    { id: 'AUXILIARES_TREINADORES', label: 'Auxiliares dos Treinadores', icon: Dumbbell, color: 'text-blue-400' },
    { id: 'ATENDIMENTO', label: 'Atendimento', icon: MessageCircle, color: 'text-pink-400' },
];

// Segunda como primeiro dia da semana
const DIAS_SEMANA = [
    { id: 1, label: 'Seg' },
    { id: 2, label: 'Ter' },
    { id: 3, label: 'Qua' },
    { id: 4, label: 'Qui' },
    { id: 5, label: 'Sex' },
    { id: 6, label: 'Sáb' },
    { id: 0, label: 'Dom', disabled: true },
];

// Habilidades expandidas e organizadas por categoria
const HABILIDADES = [
    // Comunicação
    'Fotografia',
    'Edição de Vídeo',
    'Gestão de Redes Sociais',
    'Redação e Textos',
    'Criação de Conteúdo',
    // Técnico
    'Manutenção de Barcos',
    'Trabalho com Fibra/Resina',
    'Marcenaria Básica',
    'Elétrica Básica',
    'Hidráulica Básica',
    'Pintura',
    // Remo
    'Remo Avançado',
    'Timoneiro Experiente',
    'Segurança Náutica',
    'Primeiros Socorros',
    'Salvamento Aquático',
    // Administrativo
    'Atendimento ao Público',
    'Organização e Arquivos',
    'Informática Básica',
    'Excel/Planilhas',
    'Vendas',
    // Tecnologia
    'Teste de Software',
    'Reporte de Bugs',
    'Feedback de UX',
    'Programação',
    // Eventos e Limpeza
    'Organização de Eventos',
    'Limpeza e Organização',
    'Cozinha/Alimentação',
    'Idiomas (Inglês/Espanhol)',
];

export default function VoluntariadoPage() {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const [areas, setAreas] = useState<string[]>([]);
    const [dias, setDias] = useState<number[]>([]);
    const [habilidades, setHabilidades] = useState<string[]>([]);
    const [horarioInicio, setHorarioInicio] = useState('05:45');
    const [horarioFim, setHorarioFim] = useState('06:45');
    const [horarioInicioTarde, setHorarioInicioTarde] = useState('16:15');
    const [horarioFimTarde, setHorarioFimTarde] = useState('17:30');
    const [novaHabilidade, setNovaHabilidade] = useState('');

    const toggleArea = (areaId: string) => {
        setAreas(prev =>
            prev.includes(areaId)
                ? prev.filter(a => a !== areaId)
                : [...prev, areaId]
        );
    };

    const toggleDia = (diaId: number) => {
        setDias(prev =>
            prev.includes(diaId)
                ? prev.filter(d => d !== diaId)
                : [...prev, diaId]
        );
    };

    const toggleHabilidade = (hab: string) => {
        setHabilidades(prev =>
            prev.includes(hab)
                ? prev.filter(h => h !== hab)
                : [...prev, hab]
        );
    };

    const addCustomHabilidade = () => {
        if (novaHabilidade.trim() && !habilidades.includes(novaHabilidade.trim())) {
            setHabilidades(prev => [...prev, novaHabilidade.trim()]);
            setNovaHabilidade('');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Aqui será a chamada para API real
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-club-red/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <Heart className="w-10 h-10 text-club-red" />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Seja um Voluntário
                    </h1>
                    <p className="text-white/50 max-w-md mx-auto">
                        Contribua com o clube compartilhando suas habilidades e disponibilidade
                    </p>
                </div>

                {/* Áreas de Interesse */}
                <AnimatedCard variant="glass" className="p-6 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-club-gold" />
                        Áreas de Interesse
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AREAS_VOLUNTARIADO.map(area => {
                            const Icon = area.icon;
                            const isSelected = areas.includes(area.id);
                            return (
                                <button
                                    key={area.id}
                                    onClick={() => toggleArea(area.id)}
                                    className={`p-4 rounded-xl border transition-all text-left ${isSelected
                                        ? 'bg-club-red/20 border-club-red'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-club-red' : area.color}`} />
                                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                        {area.label}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </AnimatedCard>

                {/* Disponibilidade */}
                <AnimatedCard variant="glass" className="p-6 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Disponibilidade Semanal
                    </h2>

                    <div className="mb-4">
                        <p className="text-sm text-white/50 mb-3">Dias disponíveis (Segunda a Sábado):</p>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map(dia => {
                                const isSelected = dias.includes(dia.id);
                                const isDisabled = 'disabled' in dia && dia.disabled;
                                return (
                                    <button
                                        key={dia.id}
                                        onClick={() => !isDisabled && toggleDia(dia.id)}
                                        disabled={isDisabled}
                                        className={`w-12 h-12 rounded-full border font-bold text-sm transition-all ${isDisabled
                                                ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-club-red border-club-red text-white'
                                                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                                            }`}
                                    >
                                        {dia.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Turnos: Manhã e Tarde */}
                    <div className="space-y-4">
                        {/* Turno Manhã */}
                        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">☀️</span>
                                <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">Turno Manhã</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Início</label>
                                    <input
                                        type="time"
                                        value={horarioInicio}
                                        onChange={e => setHorarioInicio(e.target.value)}
                                        step="900"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Fim</label>
                                    <input
                                        type="time"
                                        value={horarioFim}
                                        onChange={e => setHorarioFim(e.target.value)}
                                        step="900"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 mt-2">Ex: 05:45 às 06:45 (1 hora)</p>
                        </div>

                        {/* Turno Tarde */}
                        <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-400/30">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">🌅</span>
                                <span className="text-sm font-bold text-orange-300 uppercase tracking-wider">Turno Tarde</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Início</label>
                                    <input
                                        type="time"
                                        value={horarioInicioTarde}
                                        onChange={e => setHorarioInicioTarde(e.target.value)}
                                        step="900"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Fim</label>
                                    <input
                                        type="time"
                                        value={horarioFimTarde}
                                        onChange={e => setHorarioFimTarde(e.target.value)}
                                        step="900"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 mt-2">Ex: 16:15 às 17:30 (1h15min)</p>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Habilidades */}
                <AnimatedCard variant="glass" className="p-6 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-emerald-400" />
                        Suas Habilidades
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {HABILIDADES.map(hab => {
                            const isSelected = habilidades.includes(hab);
                            return (
                                <button
                                    key={hab}
                                    onClick={() => toggleHabilidade(hab)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                        : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
                                        }`}
                                >
                                    {isSelected && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                    {hab}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Adicionar outra habilidade..."
                            value={novaHabilidade}
                            onChange={e => setNovaHabilidade(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomHabilidade()}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                        />
                        <Button
                            variant="outline"
                            onClick={addCustomHabilidade}
                            className="border-white/10"
                        >
                            Adicionar
                        </Button>
                    </div>
                </AnimatedCard>

                {/* Resumo e Salvar */}
                <AnimatedCard variant="gradient" className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-white mb-1">Seu Perfil de Voluntário</h3>
                            <p className="text-sm text-white/50">
                                {areas.length} área(s) • {dias.length} dia(s) • {habilidades.length} habilidade(s)
                            </p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={loading || areas.length === 0}
                            className="gap-2 bg-club-red hover:bg-club-red/90 min-w-[140px]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : saved ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Salvo!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Salvar Perfil
                                </>
                            )}
                        </Button>
                    </div>
                </AnimatedCard>

                {/* Badges de Voluntário (Preview) */}
                {habilidades.length >= 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center"
                    >
                        <Badge className="bg-club-gold/20 text-club-gold border-club-gold/50 px-4 py-2">
                            🌟 Voluntário Multitalento - 5+ habilidades!
                        </Badge>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
