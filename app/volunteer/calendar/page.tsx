'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Loader2, Info, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { WeeklyCalendar } from '@/components/volunteer/weekly-calendar';
import { AreaSelector, AreaBadge } from '@/components/volunteer/area-selector';
import { VOLUNTEER_AREAS, getAreaById } from '@/lib/config/volunteer-areas';
import { XP_ACTIONS } from '@/lib/config/gamification-rules';

interface VolunteerSlot {
    areaId: string;
    dayOfWeek: number;
    hour: number;
}

interface AreaNotification {
    id: string;
    areaId: string;
    message: string;
    createdAt: string;
    senderName: string;
}

export default function VolunteerCalendarPage() {
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [slots, setSlots] = useState<VolunteerSlot[]>([]);
    const [notifications, setNotifications] = useState<AreaNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            // Carregar disponibilidade salva
            const availResponse = await fetch('/api/volunteer/availability');
            if (availResponse.ok) {
                const data = await availResponse.json();
                setSlots(data.slots || []);
            }

            // Carregar notificações das áreas do usuário
            const notifResponse = await fetch('/api/volunteer/messages');
            if (notifResponse.ok) {
                const data = await notifResponse.json();
                setNotifications(data.messages || []);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleSlotToggle(slot: VolunteerSlot) {
        setHasChanges(true);
        setSlots(prev => {
            const existingIndex = prev.findIndex(
                s => s.dayOfWeek === slot.dayOfWeek && s.hour === slot.hour
            );

            if (existingIndex >= 0) {
                // Remove o slot existente
                return prev.filter((_, i) => i !== existingIndex);
            } else {
                // Adiciona novo slot
                return [...prev, slot];
            }
        });
    }

    async function saveAvailability() {
        setSaving(true);
        try {
            const response = await fetch('/api/volunteer/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slots })
            });

            if (response.ok) {
                setHasChanges(false);
                // Feedback visual de sucesso
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setSaving(false);
        }
    }

    // Calcular XP que o usuário ganhará
    const totalXP = slots.length * XP_ACTIONS.CADASTRAR_DISPONIBILIDADE_HORA;

    // Agrupar slots por área
    const slotsByArea = slots.reduce((acc, slot) => {
        if (!acc[slot.areaId]) acc[slot.areaId] = [];
        acc[slot.areaId].push(slot);
        return acc;
    }, {} as Record<string, VolunteerSlot[]>);

    // Filtrar notificações para áreas do usuário
    const userAreas = [...new Set(slots.map(s => s.areaId))];
    const relevantNotifications = notifications.filter(n => userAreas.includes(n.areaId));

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-club-red animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <div className="h-8 md:h-10" />

            <HeroSection
                title="Minha Disponibilidade"
                subtitle="Voluntariado"
                description="Defina os horários e áreas em que você pode ajudar"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                <Link href="/volunteer" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar ao Voluntariado
                </Link>

                {/* Notificações das Áreas */}
                {relevantNotifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnimatedCard variant="glass" className="p-4 border-l-4 border-blue-500">
                            <div className="flex items-start gap-3">
                                <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-white font-medium mb-2">Mensagens da Diretoria</h3>
                                    <div className="space-y-3">
                                        {relevantNotifications.slice(0, 3).map(notif => {
                                            const area = getAreaById(notif.areaId);
                                            return (
                                                <div key={notif.id} className="text-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <AreaBadge areaId={notif.areaId} size="sm" />
                                                        <span className="text-white/40 text-xs">
                                                            {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/70">{notif.message}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* Instruções */}
                <AnimatedCard variant="glass" className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-club-gold flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-white/70">
                            <p className="font-medium text-white mb-1">Como funciona:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Selecione uma <strong>área</strong> em que deseja atuar</li>
                                <li>Clique nos <strong>horários</strong> disponíveis no calendário</li>
                                <li>Salve suas alterações para confirmar</li>
                            </ol>
                            <p className="mt-2 text-club-gold">
                                +{XP_ACTIONS.CADASTRAR_DISPONIBILIDADE_HORA} XP por hora cadastrada
                            </p>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Seletor de Área */}
                <div>
                    <h3 className="text-white font-bold mb-3">1. Escolha a Área</h3>
                    <AreaSelector
                        selectedArea={selectedArea}
                        onAreaSelect={setSelectedArea}
                        compact
                    />
                </div>

                {/* Calendário Semanal */}
                <div>
                    <h3 className="text-white font-bold mb-3">2. Selecione os Horários</h3>
                    {!selectedArea ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/50">
                                Selecione uma área acima para marcar seus horários
                            </p>
                        </AnimatedCard>
                    ) : (
                        <WeeklyCalendar
                            mode="user"
                            userSlots={slots}
                            selectedArea={selectedArea}
                            onSlotToggle={handleSlotToggle}
                        />
                    )}
                </div>

                {/* Resumo */}
                {slots.length > 0 && (
                    <AnimatedCard variant="carbon" className="p-4">
                        <h3 className="text-white font-bold mb-3">Resumo da Disponibilidade</h3>
                        <div className="space-y-2">
                            {Object.entries(slotsByArea).map(([areaId, areaSlots]) => {
                                const area = getAreaById(areaId);
                                return (
                                    <div key={areaId} className="flex items-center justify-between">
                                        <AreaBadge areaId={areaId} size="sm" />
                                        <span className="text-white/60 text-sm">
                                            {areaSlots.length} hora(s)/semana
                                        </span>
                                    </div>
                                );
                            })}
                            <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between">
                                <span className="text-white font-medium">Total:</span>
                                <span className="text-club-gold font-bold">
                                    {slots.length} hora(s) = {totalXP} XP
                                </span>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Botão Salvar */}
                <Button
                    onClick={saveAvailability}
                    disabled={!hasChanges || saving}
                    className="w-full bg-club-red hover:bg-club-red/90 h-12 text-lg font-bold"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            {hasChanges ? 'Salvar Alterações' : 'Nenhuma alteração'}
                        </>
                    )}
                </Button>

                {/* Guia da Área Selecionada */}
                {selectedArea && (
                    <AnimatedCard variant="glass" className="p-4">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <AreaBadge areaId={selectedArea} size="sm" />
                            Guia da Área
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div
                                className="text-white/70 text-sm whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                    __html: getAreaById(selectedArea)?.guide?.replace(/^## /gm, '<h4>').replace(/^- /gm, '• ') || 'Guia não disponível'
                                }}
                            />
                        </div>
                    </AnimatedCard>
                )}
            </div>
        </div>
    );
}
