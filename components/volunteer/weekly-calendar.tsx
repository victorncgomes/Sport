'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { VOLUNTEER_AREAS, VOLUNTEER_DAYS, generateTimeSlots, getAreaById } from '@/lib/config/volunteer-areas';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Check, X } from 'lucide-react';

interface VolunteerSlot {
    areaId: string;
    dayOfWeek: number;
    hour: number;
}

interface WeeklyCalendarProps {
    // Para usuário: slots selecionados por ele
    userSlots?: VolunteerSlot[];
    onSlotToggle?: (slot: VolunteerSlot) => void;
    selectedArea?: string;   // Área selecionada para adicionar (modo usuário)

    // Para diretoria: todos os slots de todos os voluntários
    allSlots?: {
        slot: VolunteerSlot;
        userName: string;
        userId: string;
    }[];

    // Modo de visualização
    mode: 'user' | 'admin';
    readOnly?: boolean;
}

export function WeeklyCalendar({
    userSlots = [],
    onSlotToggle,
    selectedArea,
    allSlots = [],
    mode,
    readOnly = false
}: WeeklyCalendarProps) {
    const timeSlots = generateTimeSlots();
    const availableDays = VOLUNTEER_DAYS.filter(d => d.available);

    const isSlotSelected = (dayOfWeek: number, hour: number): boolean => {
        return userSlots.some(
            s => s.dayOfWeek === dayOfWeek && s.hour === hour && (!selectedArea || s.areaId === selectedArea)
        );
    };

    const getUserSlotForCell = (dayOfWeek: number, hour: number) => {
        return userSlots.find(s => s.dayOfWeek === dayOfWeek && s.hour === hour);
    };

    const getAdminSlotsForCell = (dayOfWeek: number, hour: number) => {
        return allSlots.filter(s => s.slot.dayOfWeek === dayOfWeek && s.slot.hour === hour);
    };

    const handleCellClick = (dayOfWeek: number, hour: number) => {
        if (readOnly || !onSlotToggle || !selectedArea) return;

        onSlotToggle({
            areaId: selectedArea,
            dayOfWeek,
            hour
        });
    };

    return (
        <AnimatedCard variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
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
                        {timeSlots.map((time, hourIndex) => {
                            const hour = parseInt(time.split(':')[0]);
                            return (
                                <tr key={time} className="border-t border-white/5">
                                    <td className="p-2 text-sm font-mono text-white/40">
                                        {time}
                                    </td>
                                    {availableDays.map(day => {
                                        const userSlot = getUserSlotForCell(day.id, hour);
                                        const adminSlots = getAdminSlotsForCell(day.id, hour);
                                        const isSelected = isSlotSelected(day.id, hour);
                                        const area = userSlot ? getAreaById(userSlot.areaId) : null;

                                        if (mode === 'admin') {
                                            // Modo diretoria: mostrar todos os voluntários
                                            return (
                                                <td
                                                    key={day.id}
                                                    className="p-1 text-center"
                                                >
                                                    <div className="min-h-[40px] flex flex-wrap gap-1 justify-center items-center">
                                                        {adminSlots.length === 0 ? (
                                                            <span className="text-white/10">-</span>
                                                        ) : (
                                                            adminSlots.map((s, i) => {
                                                                const slotArea = getAreaById(s.slot.areaId);
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        className={cn(
                                                                            "px-2 py-1 rounded text-[10px] font-bold text-white truncate max-w-[80px]",
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
                                        }

                                        // Modo usuário: toggle de slots
                                        return (
                                            <td
                                                key={day.id}
                                                className="p-1 text-center"
                                            >
                                                <button
                                                    onClick={() => handleCellClick(day.id, hour)}
                                                    disabled={readOnly || !selectedArea}
                                                    className={cn(
                                                        "w-full min-h-[40px] rounded-lg transition-all flex items-center justify-center",
                                                        isSelected && area
                                                            ? `${area.colorClass} text-white`
                                                            : "bg-white/5 hover:bg-white/10",
                                                        !selectedArea && "cursor-not-allowed opacity-50",
                                                        readOnly && "cursor-default"
                                                    )}
                                                >
                                                    {isSelected ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-white/20">-</span>
                                                    )}
                                                </button>
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
            <div className="p-4 border-t border-white/5 bg-white/5">
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
    );
}
