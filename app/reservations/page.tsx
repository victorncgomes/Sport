'use client';

import React, { useState, useMemo } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Ship,
    Calendar,
    Clock,
    Users,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertCircle,
    QrCode,
    MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock boats data
const boats = [
    { id: '1', name: 'Potengi I', type: 'Single', capacity: 1, status: 'available' },
    { id: '2', name: 'Potengi II', type: 'Double', capacity: 2, status: 'available' },
    { id: '3', name: 'Natal', type: 'Quad', capacity: 4, status: 'maintenance' },
    { id: '4', name: 'Rio Grande', type: 'Eight', capacity: 8, status: 'available' },
];

// Mock reservations
const existingReservations = [
    { date: '2025-01-20', time: '06:00', boatId: '1' },
    { date: '2025-01-20', time: '07:00', boatId: '1' },
    { date: '2025-01-21', time: '06:00', boatId: '2' },
];

const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00'];

export default function ReservationsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState<'date' | 'boat' | 'time' | 'confirm'>('date');

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();

        const result = [];
        for (let i = 0; i < firstDay; i++) {
            result.push(null);
        }
        for (let i = 1; i <= days; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const today = new Date();
            const isPast = new Date(dateStr) < new Date(today.toDateString());
            result.push({ day: i, date: dateStr, isPast });
        }
        return result;
    }, [currentMonth]);

    const availableBoats = boats.filter(b => b.status === 'available');

    const isTimeSlotTaken = (time: string) => {
        if (!selectedDate || !selectedBoat) return false;
        return existingReservations.some(
            r => r.date === selectedDate && r.time === time && r.boatId === selectedBoat
        );
    };

    const handleConfirm = () => {
        // In production, this would call a server action
        alert(`Reserva confirmada!\n\nBarco: ${boats.find(b => b.id === selectedBoat)?.name}\nData: ${selectedDate}\nHorário: ${selectedTime}`);
        setStep('date');
        setSelectedDate(null);
        setSelectedBoat(null);
        setSelectedTime(null);
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Reservar Embarcação"
                subtitle="Garagem Náutica"
                description="Escolha a data, barco e horário para sua sessão de remo."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[
                        { id: 'date', label: 'Data', icon: Calendar },
                        { id: 'boat', label: 'Barco', icon: Ship },
                        { id: 'time', label: 'Horário', icon: Clock },
                        { id: 'confirm', label: 'Confirmar', icon: Check },
                    ].map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => {
                                    if (s.id === 'date') setStep('date');
                                    if (s.id === 'boat' && selectedDate) setStep('boat');
                                    if (s.id === 'time' && selectedBoat) setStep('time');
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                                    step === s.id
                                        ? "bg-club-red text-white shadow-glow-red"
                                        : (s.id === 'date' && selectedDate) || (s.id === 'boat' && selectedBoat) || (s.id === 'time' && selectedTime)
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-white/5 text-white/30"
                                )}
                            >
                                <s.icon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{s.label}</span>
                            </button>
                            {i < 3 && <div className="w-8 h-[2px] bg-white/10" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Step 1: Date Selection */}
                    {step === 'date' && (
                        <AnimatedCard variant="carbon" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-black text-white/30 uppercase tracking-widest py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {daysInMonth.map((day, i) => (
                                    <button
                                        key={i}
                                        disabled={!day || day.isPast}
                                        onClick={() => day && !day.isPast && setSelectedDate(day.date)}
                                        className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                                            !day ? "invisible" :
                                                day.isPast ? "text-white/10 cursor-not-allowed" :
                                                    selectedDate === day.date
                                                        ? "bg-club-red text-white shadow-glow-red"
                                                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        {day?.day}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button
                                    onClick={() => selectedDate && setStep('boat')}
                                    disabled={!selectedDate}
                                    className="bg-club-red hover:bg-club-red-700 disabled:opacity-50"
                                >
                                    Próximo: Escolher Barco
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Step 2: Boat Selection */}
                    {step === 'boat' && (
                        <AnimatedCard variant="carbon" className="p-8">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Escolha o Barco</h3>
                            <p className="text-white/40 text-sm mb-8">Data selecionada: {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                {boats.map((boat) => (
                                    <button
                                        key={boat.id}
                                        disabled={boat.status !== 'available'}
                                        onClick={() => setSelectedBoat(boat.id)}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 text-left transition-all",
                                            boat.status !== 'available'
                                                ? "opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]"
                                                : selectedBoat === boat.id
                                                    ? "border-club-gold bg-club-gold/10"
                                                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                selectedBoat === boat.id ? "bg-club-gold/20 text-club-gold" : "bg-white/10 text-white/40"
                                            )}>
                                                <Ship className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black">{boat.name}</h4>
                                                <p className="text-[10px] uppercase font-bold text-white/30">{boat.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-white/40 text-xs">
                                                <Users className="w-4 h-4" /> {boat.capacity} {boat.capacity === 1 ? 'remador' : 'remadores'}
                                            </div>
                                            {boat.status === 'maintenance' && (
                                                <span className="text-[8px] font-black uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-400">
                                                    Manutenção
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep('date')} className="border-white/10">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                                </Button>
                                <Button
                                    onClick={() => selectedBoat && setStep('time')}
                                    disabled={!selectedBoat}
                                    className="bg-club-red hover:bg-club-red-700 disabled:opacity-50"
                                >
                                    Próximo: Horário
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Step 3: Time Selection */}
                    {step === 'time' && (
                        <AnimatedCard variant="carbon" className="p-8">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Escolha o Horário</h3>
                            <p className="text-white/40 text-sm mb-8">
                                {boats.find(b => b.id === selectedBoat)?.name} • {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </p>

                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {timeSlots.map((time) => {
                                    const taken = isTimeSlotTaken(time);
                                    return (
                                        <button
                                            key={time}
                                            disabled={taken}
                                            onClick={() => setSelectedTime(time)}
                                            className={cn(
                                                "py-4 rounded-xl font-bold transition-all flex flex-col items-center gap-1",
                                                taken
                                                    ? "bg-club-red/10 text-club-red/40 cursor-not-allowed line-through"
                                                    : selectedTime === time
                                                        ? "bg-club-gold text-black shadow-glow-gold"
                                                        : "bg-white/5 text-white hover:bg-white/10"
                                            )}
                                        >
                                            <Clock className="w-4 h-4" />
                                            <span>{time}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-4 text-[10px] text-white/30 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-white/5" /> Disponível
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-club-gold" /> Selecionado
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-club-red/30" /> Ocupado
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep('boat')} className="border-white/10">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                                </Button>
                                <Button
                                    onClick={() => selectedTime && setStep('confirm')}
                                    disabled={!selectedTime}
                                    className="bg-club-red hover:bg-club-red-700 disabled:opacity-50"
                                >
                                    Revisar Reserva
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 'confirm' && (
                        <AnimatedCard variant="metal" className="p-8">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-club-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-club-gold" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Confirmar Reserva</h3>
                                <p className="text-white/40">Revise os detalhes antes de finalizar</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 flex items-center gap-2"><Ship className="w-4 h-4" /> Embarcação</span>
                                    <span className="text-white font-bold">{boats.find(b => b.id === selectedBoat)?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 flex items-center gap-2"><Calendar className="w-4 h-4" /> Data</span>
                                    <span className="text-white font-bold">{selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 flex items-center gap-2"><Clock className="w-4 h-4" /> Horário</span>
                                    <span className="text-white font-bold">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 flex items-center gap-2"><MapPin className="w-4 h-4" /> Local</span>
                                    <span className="text-white font-bold">Garagem Principal</span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 mb-8">
                                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-amber-400 font-bold mb-1">Importante</p>
                                    <p className="text-white/60">Chegue 10 minutos antes para check-in. Cancelamentos devem ser feitos com 2h de antecedência.</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep('time')} className="border-white/10">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="bg-club-gold hover:bg-club-gold-600 text-black font-black px-8"
                                >
                                    Confirmar Reserva
                                    <QrCode className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}
                </div>
            </div>
        </div>
    );
}
