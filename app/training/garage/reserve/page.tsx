'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Timer, AlertCircle } from 'lucide-react';

export default function ReserveResourcePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resourceId = searchParams.get('resourceId');

    const [resource, setResource] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState(60); // minutos
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resourceId) {
            loadResource();
        }
    }, [resourceId]);

    async function loadResource() {
        try {
            const response = await fetch(`/api/resources/${resourceId}`);
            const data = await response.json();
            setResource(data.resource);
        } catch (error) {
            console.error('Error loading resource:', error);
        }
    }

    // Gerar horários com intervalos de 15 minutos
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 6; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeStr);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const durations = [
        { value: 30, label: '30 minutos' },
        { value: 60, label: '1 hora' },
        { value: 90, label: '1h 30min' },
        { value: 120, label: '2 horas' },
        { value: 150, label: '2h 30min' },
        { value: 180, label: '3 horas' },
    ];

    const handleReserve = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Por favor, selecione data e horário');
            return;
        }

        setLoading(true);
        try {
            const startAt = new Date(`${selectedDate}T${selectedTime}`);
            const expectedEndAt = new Date(startAt.getTime() + duration * 60000);

            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceId,
                    startAt: startAt.toISOString(),
                    expectedEndAt: expectedEndAt.toISOString(),
                    notes
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Reserva realizada com sucesso!');
                router.push('/training/garage/my-reservations');
            } else {
                alert(data.error || 'Erro ao criar reserva');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Erro ao criar reserva');
        } finally {
            setLoading(false);
        }
    };

    if (!resource) {
        return (
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <p className="text-white/60">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Reservar Recurso"
                subtitle={resource.name}
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Info do Recurso */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-2">{resource.name}</h3>
                    <p className="text-white/60 text-sm">{resource.description}</p>
                    {resource.category && (
                        <p className="text-white/40 text-xs mt-2">{resource.category}</p>
                    )}
                </AnimatedCard>

                {/* Data */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Data</h3>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                </AnimatedCard>

                {/* Horário */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Horário de Início</h3>
                    </div>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    >
                        <option value="">Selecione o horário</option>
                        {timeSlots.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </AnimatedCard>

                {/* Duração */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Timer className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Duração</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {durations.map((d) => (
                            <button
                                key={d.value}
                                onClick={() => setDuration(d.value)}
                                className={`p-3 rounded-lg text-sm font-medium transition-all ${duration === d.value
                                        ? 'bg-club-red text-white'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </AnimatedCard>

                {/* Resumo */}
                {selectedDate && selectedTime && (
                    <AnimatedCard variant="gradient" className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-white mt-1" />
                            <div className="flex-1">
                                <h3 className="text-white font-bold mb-2">Resumo da Reserva</h3>
                                <div className="space-y-1 text-sm text-white/80">
                                    <p>📅 Data: {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                                    <p>🕐 Início: {selectedTime}</p>
                                    <p>⏱️ Duração: {durations.find(d => d.value === duration)?.label}</p>
                                    <p>🏁 Término: {(() => {
                                        const start = new Date(`${selectedDate}T${selectedTime}`);
                                        const end = new Date(start.getTime() + duration * 60000);
                                        return end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    })()}</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Observações */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Observações (opcional)</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alguma observação sobre a reserva?"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 min-h-[100px]"
                    />
                </AnimatedCard>

                {/* Botão Reservar */}
                <Button
                    onClick={handleReserve}
                    disabled={loading || !selectedDate || !selectedTime}
                    className="w-full h-14 bg-club-red hover:bg-club-red/90"
                >
                    {loading ? 'Reservando...' : 'Confirmar Reserva'}
                </Button>
            </div>
        </div>
    );
}
