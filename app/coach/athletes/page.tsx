'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Search,
    Filter,
    Users,
    User,
    ArrowRight,
    Trophy,
    Activity,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dados simulados de atletas
const mockAthletes = [
    { id: '1', name: 'Ana Silva', category: 'Feminino', performance: 98, status: 'active', avatar: 'AS', level: 12, xp: 2450 },
    { id: '2', name: 'Bruno Santos', category: 'Adulto', performance: 85, status: 'warning', avatar: 'BS', level: 8, xp: 1820 },
    { id: '3', name: 'Carla Melo', category: 'Master', performance: 92, status: 'active', avatar: 'CM', level: 15, xp: 3200 },
    { id: '4', name: 'Diego Ferreira', category: 'Júnior', performance: 70, status: 'maintenance', avatar: 'DF', level: 5, xp: 950 },
    { id: '5', name: 'Elena Costa', category: 'Feminino', performance: 88, status: 'active', avatar: 'EC', level: 10, xp: 2100 },
    { id: '6', name: 'Fernando Lima', category: 'Adulto', performance: 76, status: 'active', avatar: 'FL', level: 7, xp: 1540 },
    { id: '7', name: 'Gabriela Rocha', category: 'Júnior', performance: 82, status: 'active', avatar: 'GR', level: 6, xp: 1280 },
    { id: '8', name: 'Henrique Alves', category: 'Master', performance: 90, status: 'warning', avatar: 'HA', level: 14, xp: 2980 },
];

const categories = ['Todos', 'Júnior', 'Adulto', 'Master', 'Feminino', 'Misto'];

export default function AthletesListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredAthletes = mockAthletes.filter(athlete => {
        const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || athlete.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Users className="w-8 h-8 text-club-red" />
                                Gestão de Atletas
                            </h1>
                            <p className="text-white/50 text-sm">{filteredAthletes.length} atletas encontrados</p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-club-red/50"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                className={selectedCategory === cat
                                    ? 'bg-club-red text-white'
                                    : 'border-white/10 text-white/60 hover:text-white'}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Lista de Atletas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAthletes.map((athlete, i) => (
                        <motion.div
                            key={athlete.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={`/coach/athletes/${athlete.id}`}>
                                <AnimatedCard variant="glass" hover className="p-5 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-club-red/10 border border-club-red/20 flex items-center justify-center font-black text-club-red">
                                                {athlete.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-club-red transition-colors">{athlete.name}</h3>
                                                <Badge className="text-[10px] bg-white/10 text-white/60 border-0">
                                                    {athlete.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-club-red transition-colors" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-white/5 rounded-lg p-2">
                                            <div className="text-lg font-black text-club-gold">{athlete.level}</div>
                                            <div className="text-[8px] text-white/40 uppercase tracking-widest">Nível</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2">
                                            <div className="text-lg font-black text-white">{athlete.xp}</div>
                                            <div className="text-[8px] text-white/40 uppercase tracking-widest">XP</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2">
                                            <div className={`text-lg font-black ${athlete.performance >= 90 ? 'text-emerald-400' : athlete.performance >= 75 ? 'text-club-gold' : 'text-orange-400'}`}>
                                                {athlete.performance}%
                                            </div>
                                            <div className="text-[8px] text-white/40 uppercase tracking-widest">Perf.</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${athlete.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                athlete.status === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-club-red/10 text-club-red'
                                            }`}>
                                            {athlete.status === 'active' ? 'Em Dia' : athlete.status === 'warning' ? 'Atenção' : 'Afastado'}
                                        </span>
                                    </div>
                                </AnimatedCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredAthletes.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50">Nenhum atleta encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
