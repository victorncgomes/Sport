'use client';

import { SlotAnalysis } from '@/types/rowing-conditions';

const MORNING_SLOTS = [
    "05:00", "05:30", "06:00", "06:30", "07:00",
    "07:30", "08:00", "08:30", "09:00"
];

const AFTERNOON_SLOTS = [
    "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
];

interface TimeSlotSelectorProps {
    selectedTime: string;
    onTimeChange: (time: string) => void;
}

export function TimeSlotSelector({ selectedTime, onTimeChange }: TimeSlotSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Selecionar Horário de Treino
            </label>
            <select
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
            >
                <optgroup label="🌅 Manhã (05:00 - 10:00)" className="bg-slate-900">
                    {MORNING_SLOTS.map(time => (
                        <option key={time} value={time} className="bg-slate-900 text-white">
                            {time} - {addHour(time)}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="🌇 Tarde (14:30 - 18:30)" className="bg-slate-900">
                    {AFTERNOON_SLOTS.map(time => (
                        <option key={time} value={time} className="bg-slate-900 text-white">
                            {time} - {addHour(time)}
                        </option>
                    ))}
                </optgroup>
            </select>
        </div>
    );
}

function addHour(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const newH = (h + 1) % 24;
    return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
