
'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { technicalInventory } from '@/lib/data/inventory-data';
import {
    Package,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Plus,
    Filter,
    Search,
    Clock,
    History,
    MoreVertical,
    LifeBuoy,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { getInventoryItems } from '@/lib/actions/inventory';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | 'maintenance' | 'ok'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getInventoryItems();
            setItems(data);
            setLoading(false);
        };
        fetchItems();
    }, []);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        // Map status from operational/maintenance to ok/maintenance used in UI
        const uiStatus = item.status === 'OPERATIONAL' ? 'ok' : 'maintenance';
        return uiStatus === filter;
    });

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Gestão Técnica"
                subtitle="Inventário & Manutenção"
                description="Controle de equipamentos, remos e acessórios náuticos."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/40 text-[8px] uppercase font-black tracking-widest">Total Itens</p>
                            <span className="text-2xl font-black text-white">{technicalInventory.length}</span>
                        </div>
                        <Package className="w-8 h-8 text-white/10" />
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-club-red/20 bg-club-red/5">
                        <div>
                            <p className="text-club-red/70 text-[8px] uppercase font-black tracking-widest">Manutenção</p>
                            <span className="text-2xl font-black text-club-red">
                                {technicalInventory.filter(i => i.status === 'maintenance').length}
                            </span>
                        </div>
                        <Wrench className="w-8 h-8 text-club-red/20" />
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
                        <div>
                            <p className="text-emerald-400 text-[8px] uppercase font-black tracking-widest">Operacionais</p>
                            <span className="text-2xl font-black text-emerald-400">
                                {technicalInventory.filter(i => i.status === 'ok').length}
                            </span>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
                        <div>
                            <p className="text-amber-400 text-[8px] uppercase font-black tracking-widest">Vida Útil (Média)</p>
                            <span className="text-2xl font-black text-amber-400">420h</span>
                        </div>
                        <Activity className="w-8 h-8 text-amber-500/20" />
                    </AnimatedCard>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input type="text" placeholder="Buscar equipamento por ID ou nome..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-club-red/50" />
                        </div>
                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none h-12 bg-club-red hover:bg-club-red-700 text-[10px] font-black uppercase tracking-widest gap-2">
                            <Plus className="w-4 h-4" /> Novo Registro
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none h-12 border-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                            <History className="w-4 h-4" /> Relatórios
                        </Button>
                    </div>
                </div>

                {/* Inventory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <AnimatedCard key={item.id} variant="carbon" hover="lift" className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                    item.category === 'Remo' ? "bg-club-gold/10 text-club-gold" :
                                        item.category === 'Ergômetro' ? "bg-club-red/10 text-club-red" :
                                            item.category === 'Colete' ? "bg-blue-500/10 text-blue-400" :
                                                "bg-white/10 text-white"
                                )}>
                                    {item.category === 'Remo' ? <LifeBuoy className="w-6 h-6 rotate-45" /> :
                                        item.category === 'Ergômetro' ? <Activity className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={cn(
                                        "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                        item.status === 'ok' ? "bg-emerald-500/10 text-emerald-500" :
                                            item.status === 'maintenance' ? "bg-amber-500/10 text-amber-400" : "bg-club-red/10 text-club-red"
                                    )}>
                                        {item.status === 'ok' ? 'Operacional' : 'Manutenção'}
                                    </span>
                                    <span className="text-white/20 text-[6px] font-bold uppercase mt-1 tracking-widest">{item.id}</span>
                                </div>
                            </div>

                            <h4 className="text-white font-black text-sm uppercase tracking-tight mb-4 line-clamp-1">{item.name}</h4>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-white/30 uppercase font-bold">Uso Acumulado</span>
                                    <span className="text-white font-black">{item.usageHours}h / 2000h</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            (item.usageHours / 2000) > 0.8 ? "bg-club-red" :
                                                (item.usageHours / 2000) > 0.5 ? "bg-amber-500" : "bg-emerald-500"
                                        )}
                                        style={{ width: `${(item.usageHours / 2000) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mb-6">
                                <div>
                                    <p className="text-white/20 text-[6px] uppercase font-bold tracking-widest mb-1">Última Ref.</p>
                                    <div className="flex items-center gap-1 text-white/60 font-medium text-[10px]">
                                        <Clock className="w-3 h-3" /> {item.lastInspection}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/20 text-[6px] uppercase font-bold tracking-widest mb-1">Próxima Prev.</p>
                                    <div className="flex items-center gap-1 text-club-gold font-medium text-[10px]">
                                        <Wrench className="w-3 h-3" /> {item.nextMaintenance}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase text-white/60 hover:text-white h-10">
                                    Detalhes
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5">
                                    <MoreVertical className="w-4 h-4 text-white/30" />
                                </Button>
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
