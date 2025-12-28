'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Plus, Megaphone, Trash2, Edit3,
    Eye, EyeOff, Calendar, LayoutPanelTop,
    Sparkles, AlertTriangle, Info
} from 'lucide-react';

const mockNotices = [
    {
        id: '1',
        title: 'Manutenção da Garagem',
        content: 'A garagem de barcos estará fechada para pintura no próximo final de semana.',
        category: 'Aviso',
        date: '20/05/2024',
        status: 'Publicado',
        important: true
    },
    {
        id: '2',
        title: 'Regata de São João',
        content: 'Inscrições abertas para a regata interna de São João. Participe!',
        category: 'Evento',
        date: '18/05/2024',
        status: 'Agendado',
        important: false
    }
];

export default function AdminNoticesPage() {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Quadro de Avisos"
                subtitle="Comunicação Oficial"
                description="Gerencie as notícias e alertas que aparecem no mural do clube."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-club-red/20 text-club-red">
                            <LayoutPanelTop className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Mural Digital</h2>
                            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Postagens Ativas</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-club-red hover:bg-club-red-700 font-black uppercase tracking-widest text-xs gap-2 py-6 px-8 shadow-glow-red"
                    >
                        <Plus className="w-5 h-5" /> Adicionar Aviso
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* List of Notices */}
                    <div className="space-y-4">
                        {mockNotices.map((notice) => (
                            <AnimatedCard key={notice.id} variant="glass" className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-3">
                                        <div className={`p-2 rounded-lg ${notice.important ? 'bg-club-red/20 text-club-red' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {notice.important ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{notice.category}</span>
                                            <h3 className="text-lg font-bold text-white">{notice.title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="text-white/20 hover:text-club-gold"><Edit3 className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-white/20 hover:text-club-red"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed mb-6">
                                    {notice.content}
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" /> {notice.date}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${notice.status === 'Publicado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'
                                        }`}>
                                        {notice.status}
                                    </span>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>

                    {/* Preview / Instructions */}
                    <div className="space-y-6">
                        <AnimatedCard variant="gradient" className="p-8">
                            <Megaphone className="w-12 h-12 text-white mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Dicas de Comunicação</h3>
                            <ul className="space-y-4 text-sm text-white/70">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</div>
                                    Seja claro e conciso no título.
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">2</div>
                                    Use avisos importantes apenas para urgências.
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">3</div>
                                    Mantenha o mural atualizado removendo avisos antigos.
                                </li>
                            </ul>
                        </AnimatedCard>

                        {/* Recent Visual Feedback */}
                        <div className="glass-card p-6 text-center border-dashed border-white/10 border-2">
                            <Sparkles className="w-8 h-8 text-club-gold mx-auto mb-4" />
                            <p className="text-white/30 text-xs italic">O mural ajuda a manter o engajamento dos associados com as atividades do clube.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Add Overlay Prototype */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] bg-club-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                    <div className="bg-club-black border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Novo Aviso para o Mural</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Título do Aviso</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-club-red" placeholder="Ex: Aviso Importante" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Conteúdo</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-club-red min-h-[120px]" placeholder="Descreva o comunicado..." />
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1 border-white/10 font-bold uppercase text-xs h-12">Cancelar</Button>
                                <Button onClick={() => setIsAdding(false)} className="flex-1 bg-club-red hover:bg-club-red-700 font-bold uppercase text-xs h-12 shadow-glow-red">Publicar Agora</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
