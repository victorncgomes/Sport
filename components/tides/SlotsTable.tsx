'use client';

import { SlotAnalysis } from '@/types/rowing-conditions';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, AlertOctagon, Skull } from 'lucide-react';

interface SlotsTableProps {
    morning: SlotAnalysis[];
    afternoon: SlotAnalysis[];
}

export function SlotsTable({ morning, afternoon }: SlotsTableProps) {
    const getClassificationIcon = (classification: string) => {
        switch (classification) {
            case 'EXCELENTE':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'BOA':
                return <CheckCircle className="w-4 h-4 text-blue-400" />;
            case 'MODERADA':
                return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'DIFÍCIL':
                return <XCircle className="w-4 h-4 text-orange-400" />;
            case 'PERIGOSA':
                return <Skull className="w-4 h-4 text-red-400" />;
            default:
                return <AlertOctagon className="w-4 h-4 text-gray-400" />;
        }
    };

    const getClassificationColor = (classification: string) => {
        switch (classification) {
            case 'EXCELENTE':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'BOA':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'MODERADA':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'DIFÍCIL':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'PERIGOSA':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const renderSlotRow = (slot: SlotAnalysis, index: number) => (
        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-3 py-2 text-sm font-mono text-white">
                {slot.startTime}-{slot.endTime.split(':')[0]}h
            </td>
            <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                    {getClassificationIcon(slot.classification)}
                    <span className={cn(
                        "text-xs font-bold uppercase px-2 py-1 rounded border",
                        getClassificationColor(slot.classification)
                    )}>
                        {slot.classification}
                    </span>
                </div>
            </td>
            <td className="px-3 py-2 text-center">
                <span className={cn(
                    "text-sm font-bold",
                    slot.score <= 15 ? "text-green-400" :
                        slot.score <= 30 ? "text-blue-400" :
                            slot.score <= 50 ? "text-yellow-400" :
                                slot.score <= 70 ? "text-orange-400" :
                                    "text-red-400"
                )}>
                    {slot.score}
                </span>
            </td>
            <td className="px-3 py-2 text-xs text-white/60">
                <div className="space-y-1">
                    <div>
                        Saída: {slot.tideFactors.departurePhase}
                    </div>
                    <div>
                        Corrente: {slot.tideFactors.departureCurrentType === 'flood' ? '⬆️ Enchente' :
                            slot.tideFactors.departureCurrentType === 'ebb' ? '⬇️ Vazante' : '〰️ Estofa'}
                        {' '}({(slot.tideFactors.departureCurrentSpeed).toFixed(2)}m/s)
                    </div>
                    <div>
                        Vento: {slot.environmentFactors.windSpeed}km/h
                    </div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-4 mt-4">
            {/* Tabela Manhã */}
            <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-400/20 overflow-hidden">
                <div className="bg-orange-500/20 px-4 py-2 border-b border-orange-400/30">
                    <h4 className="text-sm font-bold text-orange-300 uppercase tracking-wider flex items-center gap-2">
                        🌅 Horários Disponíveis - Manhã
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/20">
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Horário
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Classificação
                                </th>
                                <th className="px-3 py-2 text-center text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Principais Fatores
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {morning.map((slot, idx) => renderSlotRow(slot, idx))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabela Tarde */}
            <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 overflow-hidden">
                <div className="bg-blue-500/20 px-4 py-2 border-b border-blue-400/30">
                    <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                        🌇 Horários Disponíveis - Tarde
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/20">
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Horário
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Classificação
                                </th>
                                <th className="px-3 py-2 text-center text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-white/70 uppercase tracking-wider">
                                    Principais Fatores
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {afternoon.map((slot, idx) => renderSlotRow(slot, idx))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Nota de rodapé */}
            <div className="text-[10px] text-white/40 text-center px-4 py-2 bg-black/20 rounded-lg border border-white/5">
                💡 Em caso de scores similares, preferimos sempre o período da manhã (vento mais estável e temperatura amena).
            </div>
        </div>
    );
}
