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
    XCircle,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-context';
import Link from 'next/link';
import {
    getNotificationsByProfile,
    markAsRead,
    markAllAsRead,
    NotificationData
} from '@/lib/services/notifications-service';

const typeIcons = {
    INFO: Info,
    SUCCESS: CheckCircle2,
    WARNING: AlertTriangle,
    ERROR: XCircle,
};

const typeColors = {
    INFO: 'border-l-club-red text-club-red bg-club-red/10',
    SUCCESS: 'border-l-emerald-500 text-emerald-500 bg-emerald-500/10',
    WARNING: 'border-l-club-gold text-club-gold bg-club-gold/10',
    ERROR: 'border-l-red-500 text-red-500 bg-red-500/10',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    const { role } = useAuth();

    useEffect(() => {
        const fetchNotifs = async () => {
            setLoading(true);
            // Buscar notificações baseadas no perfil
            const data = await getNotificationsByProfile(role);
            setNotifications(data);
            setLoading(false);
        };
        fetchNotifs();
    }, [role]);

    const handleRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllAsRead = async () => {
        // Marcar todas como lidas localmente
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const displayNotifications = filter === 'ALL'
        ? notifications
        : notifications.filter(n => !n.read);

    const unreadCount = notifications.filter(n => !n.read).length;

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
                            <button
                                onClick={() => setFilter('ALL')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === 'ALL'
                                        ? "bg-club-red text-white shadow-glow-red"
                                        : "text-white/40 hover:text-white"
                                )}
                            >
                                Todas ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('UNREAD')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === 'UNREAD'
                                        ? "bg-club-red text-white shadow-glow-red"
                                        : "text-white/40 hover:text-white"
                                )}
                            >
                                Não lidas ({unreadCount})
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                                className="h-11 border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-50"
                            >
                                Marcar todas como lidas
                            </Button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-club-red border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Notifications List */}
                    {!loading && (
                        <div className="space-y-4">
                            {displayNotifications.map((notif) => {
                                const IconComponent = typeIcons[notif.type];
                                const colorClasses = typeColors[notif.type];

                                return (
                                    <AnimatedCard
                                        key={notif.id}
                                        variant="glass"
                                        className={cn(
                                            "p-6 relative group border-l-4 transition-all",
                                            notif.read ? "border-l-white/10 opacity-60" : colorClasses.split(' ')[0],
                                            !notif.read && "shadow-lg"
                                        )}
                                    >
                                        <div className="flex gap-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                                notif.read ? "bg-white/5 text-white/30" : colorClasses.split(' ').slice(1).join(' ')
                                            )}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className={cn(
                                                        "font-black uppercase tracking-tight",
                                                        notif.read ? "text-white/60" : "text-white"
                                                    )}>
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] text-white/20 font-bold flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notif.createdAt).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-white/40 text-sm mb-4 leading-relaxed">
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
                                                        {notif.link && (
                                                            <Link href={notif.link}>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/5 px-0 ml-4 gap-1"
                                                                >
                                                                    Ver mais
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!notif.read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-club-red rounded-full shadow-glow-red animate-pulse" />
                                        )}
                                    </AnimatedCard>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && displayNotifications.length === 0 && (
                        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-2">
                                {filter === 'UNREAD' ? 'Tudo em dia!' : 'Nenhuma notificação'}
                            </h3>
                            <p className="text-white/40 text-xs">
                                {filter === 'UNREAD'
                                    ? 'Você leu todas as notificações.'
                                    : 'Você não tem notificações no momento.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
