
'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    Trash2,
    Clock,
    Search,
    Filter,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNotifications, markAsRead } from '@/lib/actions/notifications';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifs = async () => {
            // Using a dummy userId for demo
            const data = await getNotifications('user-id');
            setNotifications(data);
            setLoading(false);
        };
        fetchNotifs();
    }, []);

    const handleRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const mockNotifications = [
        { id: '1', title: 'Treino de Remo Confirmado', message: 'Seu treino para amanhã às 06:00 foi confirmado pelo treinador.', type: 'SUCCESS', read: false, createdAt: new Date() },
        { id: '2', title: 'Mensalidade Pendente', message: 'Sua mensalidade de Janeiro vence em 5 dias.', type: 'WARNING', read: false, createdAt: new Date(Date.now() - 86400000) },
        { id: '3', title: 'Manutenção de Barco', message: 'O barco "Sereia do Mar" entrou em manutenção preventiva.', type: 'INFO', read: true, createdAt: new Date(Date.now() - 172800000) },
    ];

    const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Centro de Notificações"
                subtitle="Fique Atualizado"
                description="Acompanhe todas as atualizações, avisos e alertas do Sport Club de Natal."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="max-w-4xl mx-auto">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-full md:w-auto">
                            <button className="px-6 py-2.5 rounded-xl text-[10px] font-black bg-club-red text-white uppercase tracking-widest shadow-glow-red">Todas</button>
                            <button className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-all">Não lidas</button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-11 border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Marcar todas como lidas</Button>
                            <Button variant="outline" size="icon" className="h-11 w-11 border-white/10 text-white/40 hover:text-white"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {displayNotifications.map((notif) => (
                            <AnimatedCard
                                key={notif.id}
                                variant="glass"
                                className={cn(
                                    "p-6 relative group border-l-4",
                                    notif.read ? "border-l-white/10 opacity-70" :
                                        notif.type === 'SUCCESS' ? "border-l-emerald-500 shadow-glow-emerald/10" :
                                            notif.type === 'WARNING' ? "border-l-club-gold shadow-glow-gold/10" :
                                                "border-l-club-red shadow-glow-red/10"
                                )}
                            >
                                <div className="flex gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                        notif.type === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500" :
                                            notif.type === 'WARNING' ? "bg-club-gold/10 text-club-gold" :
                                                "bg-club-red/10 text-club-red"
                                    )}>
                                        {notif.type === 'SUCCESS' ? <CheckCircle2 className="w-6 h-6" /> :
                                            notif.type === 'WARNING' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={cn("font-black uppercase tracking-tight", notif.read ? "text-white/60" : "text-white")}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] text-white/20 font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-sm mb-4 leading-relaxed line-clamp-2">
                                            {notif.message}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {!notif.read && (
                                                    <Button
                                                        onClick={() => handleRead(notif.id)}
                                                        variant="ghost"
                                                        className="h-8 text-[10px] font-black text-club-gold uppercase tracking-widest hover:bg-club-gold/10 px-0"
                                                    >
                                                        Marcar como lida
                                                    </Button>
                                                )}
                                                <Button variant="ghost" className="h-8 text-[10px] font-black text-white/30 uppercase tracking-widest hover:bg-white/5 px-0 ml-4">Detalhes</Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {!notif.read && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-club-red rounded-full shadow-glow-red" />
                                )}
                            </AnimatedCard>
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayNotifications.length === 0 && (
                        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-2">Tudo limpo por aqui!</h3>
                            <p className="text-white/40 text-xs">Você não tem novas notificações no momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
