'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar as CalendarIcon, Clock, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Gerar horários com intervalos de 15 minutos
function generateTimeSlots(startHour: number, startMin: number, endHour: number, endMin: number): string[] {
    const slots: string[] = [];
    let hour = startHour;
    let min = startMin;

    while (hour < endHour || (hour === endHour && min <= endMin)) {
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        min += 15;
        if (min >= 60) {
            min = 0;
            hour++;
        }
    }
    return slots;
}

// Horários por dia da semana
const getAvailableSlots = (dayOfWeek: number): { manha: string[], tarde: string[] } => {
    if (dayOfWeek === 6) { // Sábado
        return {
            manha: generateTimeSlots(5, 30, 10, 45),
            tarde: []
        };
    } else if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
        return {
            manha: generateTimeSlots(5, 30, 9, 15),
            tarde: generateTimeSlots(15, 30, 17, 45)
        };
    }
    return { manha: [], tarde: [] }; // Domingo
};

export default function TrialBookingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        modalidade: '',
        periodo: 'manha' as 'manha' | 'tarde',
    });
    const [availableSlots, setAvailableSlots] = useState<{ manha: string[], tarde: string[] }>({ manha: [], tarde: [] });

    const modalidades = [
        { id: 'iniciante', label: 'Iniciante (Nunca remei)', description: 'Aula introdutória com barco acompanhado', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { id: 'intermediario', label: 'Intermediário', description: 'Já tenho experiência básica', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
        { id: 'avancado', label: 'Avançado', description: 'Quero treino competitivo', color: 'text-club-red', bgColor: 'bg-club-red/10' },
    ];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // State para horários ocupados (vindos da API)
    const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Atualizar horários disponíveis quando a data muda
    useEffect(() => {
        if (formData.date) {
            const selectedDate = new Date(formData.date + 'T12:00:00');
            const dayOfWeek = selectedDate.getDay();
            const slots = getAvailableSlots(dayOfWeek);
            setAvailableSlots(slots);

            // Reset time when date changes
            setFormData(prev => ({ ...prev, time: '' }));

            // Se for sábado, força período manhã
            if (dayOfWeek === 6) {
                setFormData(prev => ({ ...prev, periodo: 'manha' }));
            }

            // Buscar horários ocupados da API
            const fetchOccupiedTimes = async () => {
                try {
                    const response = await fetch(`/api/experimental-class?date=${formData.date}`);
                    if (response.ok) {
                        const data = await response.json();
                        setOccupiedTimes(data.occupiedTimes || []);
                    }
                } catch (err) {
                    console.error('Erro ao buscar horários ocupados:', err);
                    setOccupiedTimes([]);
                }
            };
            fetchOccupiedTimes();
        }
    }, [formData.date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/experimental-class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    modalidade: formData.modalidade
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao agendar');
            }

            setStep(4); // Success screen
        } catch (err: any) {
            setError(err.message || 'Erro ao criar agendamento');
            console.error('Erro ao agendar:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedDate = formData.date ? new Date(formData.date + 'T12:00:00') : null;
    const isSaturday = selectedDate?.getDay() === 6;
    const isSunday = selectedDate?.getDay() === 0;
    const currentSlots = formData.periodo === 'manha' ? availableSlots.manha : availableSlots.tarde;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Aula Experimental Gratuita"
                subtitle="Vem pro Rio"
                description="Agende sua primeira experiência no Rio Potengi e sinta o poder do remo rubro-negro."
                compact
            />

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all border-2",
                                        step >= s
                                            ? "bg-club-red border-club-red text-white shadow-glow-red"
                                            : "bg-white/5 border-white/10 text-white/30"
                                    )}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={cn(
                                            "w-12 h-0.5 mx-2 transition-all rounded-full",
                                            step > s ? "bg-club-red shadow-glow-red" : "bg-white/10"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <AnimatedCard variant="glass" className="p-8">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Identificação</h2>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Como podemos te chamar?"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-club-red/50 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                placeholder="seu@contato.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-club-red/50 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                placeholder="(84) 99999-9999"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-club-red/50 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-14 bg-club-red text-xs font-black uppercase tracking-widest rounded-2xl shadow-glow-red">
                                    Escolher Modalidade <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </AnimatedCard>
                    )}

                    {step === 2 && (
                        <AnimatedCard variant="glass" className="p-8">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Nível de Experiência</h2>
                            <div className="space-y-4 mb-8">
                                {modalidades.map((mod) => (
                                    <button
                                        key={mod.id}
                                        type="button"
                                        onClick={() => handleChange('modalidade', mod.id)}
                                        className={cn(
                                            "w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group",
                                            formData.modalidade === mod.id
                                                ? "bg-white/10 border-club-red shadow-glow-red"
                                                : "bg-white/5 border-white/10 hover:border-white/30"
                                        )}
                                    >
                                        <div className={cn("text-xs font-black uppercase tracking-widest mb-1", mod.color)}>
                                            {mod.label}
                                        </div>
                                        <div className="text-sm text-white/50">{mod.description}</div>
                                        {formData.modalidade === mod.id && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                <CheckCircle className="w-6 h-6 text-club-red" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 h-14 text-white/40 uppercase font-black text-[10px] tracking-widest">
                                    Voltar
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="flex-[2] h-14 bg-club-red text-xs font-black uppercase tracking-widest rounded-2xl shadow-glow-red"
                                    disabled={!formData.modalidade}
                                >
                                    Selecionar Horário <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}

                    {step === 3 && (
                        <AnimatedCard variant="glass" className="p-8">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Data e Horário</h2>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Seleção de Data */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Data Desejada</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-club-red/50 transition-all outline-none"
                                        />
                                    </div>
                                    {formData.date && (
                                        <p className="text-xs text-white/40 ml-1">
                                            {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            {isSunday && <span className="text-club-red ml-2">• Não há aulas aos domingos</span>}
                                            {isSaturday && <span className="text-club-gold ml-2">• Sábado: apenas manhã</span>}
                                        </p>
                                    )}
                                </div>

                                {formData.date && !isSunday && (
                                    <>
                                        {/* Seleção de Período (só se não for sábado) */}
                                        {!isSaturday && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Período</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('periodo', 'manha')}
                                                        className={cn(
                                                            "py-4 rounded-2xl border text-sm font-bold transition-all",
                                                            formData.periodo === 'manha'
                                                                ? "bg-club-gold/20 border-club-gold text-club-gold"
                                                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                                        )}
                                                    >
                                                        ☀️ Manhã
                                                        <span className="block text-[10px] mt-1 opacity-60">05:30 - 09:15</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('periodo', 'tarde')}
                                                        className={cn(
                                                            "py-4 rounded-2xl border text-sm font-bold transition-all",
                                                            formData.periodo === 'tarde'
                                                                ? "bg-orange-500/20 border-orange-500 text-orange-400"
                                                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                                        )}
                                                    >
                                                        🌅 Tarde
                                                        <span className="block text-[10px] mt-1 opacity-60">15:30 - 17:45</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Grade de Horários */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1 block">
                                                Horários Disponíveis
                                            </label>
                                            {currentSlots.length === 0 ? (
                                                <div className="text-center py-8 text-white/40">
                                                    Nenhum horário disponível para esta data
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                    {currentSlots
                                                        .filter(hora => !occupiedTimes.includes(hora))
                                                        .map((hora) => (
                                                            <button
                                                                key={hora}
                                                                type="button"
                                                                onClick={() => handleChange('time', hora)}
                                                                className={cn(
                                                                    "py-3 rounded-xl border text-xs font-bold transition-all",
                                                                    formData.time === hora
                                                                        ? "bg-club-red border-club-red text-white shadow-glow-red"
                                                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                                                                )}
                                                            >
                                                                {hora}
                                                            </button>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4">
                                    <Button variant="ghost" type="button" onClick={() => setStep(2)} className="flex-1 h-14 text-white/40 uppercase font-black text-[10px] tracking-widest">
                                        Voltar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-14 bg-club-red text-xs font-black uppercase tracking-widest rounded-2xl shadow-glow-red"
                                        disabled={!formData.date || !formData.time || isSunday}
                                    >
                                        Finalizar Agendamento
                                    </Button>
                                </div>
                            </form>
                        </AnimatedCard>
                    )}

                    {step === 4 && (
                        <AnimatedCard variant="metal" className="text-center p-12 border-club-gold/30">
                            <div className="w-20 h-20 rounded-full bg-club-gold/20 flex items-center justify-center mx-auto mb-8 border-2 border-club-gold shadow-glow-gold">
                                <CheckCircle className="w-10 h-10 text-club-gold" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                                Quase pronto, remador!
                            </h2>
                            <div className="space-y-4 text-white/70 mb-10">
                                <p className="text-lg">
                                    Agendamento pré-confirmado para o dia:
                                </p>
                                <div className="inline-flex flex-col items-center bg-white/5 border border-white/10 px-8 py-6 rounded-3xl">
                                    <span className="text-club-gold font-black text-3xl uppercase tracking-tighter">
                                        {formData.time}
                                    </span>
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">
                                        {new Date(formData.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-white/40 mb-10 max-w-md mx-auto italic">
                                "Enviamos um SMS e E-mail com as instruções de vestimenta e o que levar para sua primeira vez no Potengi."
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => window.location.href = '/'} className="h-14 bg-white text-black font-black uppercase tracking-widest px-8 hover:bg-gray-200">
                                    Voltar ao Início
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}
                </div>
            </div>
        </div>
    );
}
