'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
    createdAt: string;
    link?: string;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            loadNotifications();
        }
    }, [isOpen]);

    async function loadNotifications() {
        setLoading(true);
        try {
            // Dados simulados - em produção viria de /api/notifications
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    title: 'Nova Votação',
                    message: 'Votação sobre reforma da academia foi iniciada',
                    type: 'info',
                    read: false,
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    link: '/diretoria/eleicoes'
                },
                {
                    id: '2',
                    title: 'Pagamento Pendente',
                    message: 'Mensalidade de Janeiro vence em 5 dias',
                    type: 'warning',
                    read: false,
                    createdAt: new Date(Date.now() - 7200000).toISOString(),
                    link: '/payments'
                },
                {
                    id: '3',
                    title: 'Treino Concluído',
                    message: 'Parabéns! Você ganhou 25 pontos',
                    type: 'success',
                    read: true,
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-club-red rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 w-80 z-50"
                        >
                            <AnimatedCard variant="glass" className="p-4 max-h-96 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-white">Notificações</h3>
                                    {unreadCount > 0 && (
                                        <Badge className="bg-club-red text-white">
                                            {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="text-center text-white/60 py-8">
                                        Carregando...
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="text-center text-white/60 py-8">
                                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Nenhuma notificação</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 rounded-lg border transition-colors ${notification.read
                                                        ? 'bg-white/5 border-white/10'
                                                        : 'bg-white/10 border-white/20'
                                                    }`}
                                            >
                                                {notification.link ? (
                                                    <Link
                                                        href={notification.link}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <NotificationContent notification={notification} getTypeColor={getTypeColor} />
                                                    </Link>
                                                ) : (
                                                    <NotificationContent notification={notification} getTypeColor={getTypeColor} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href="/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center text-club-red hover:text-club-red/80 text-sm mt-4 font-medium"
                                >
                                    Ver todas
                                </Link>
                            </AnimatedCard>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationContent({ notification, getTypeColor }: { notification: Notification; getTypeColor: (type: string) => string }) {
    return (
        <>
            <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-white text-sm">{notification.title}</p>
                <Badge className={`text-[10px] ${getTypeColor(notification.type)}`}>
                    {notification.type}
                </Badge>
            </div>
            <p className="text-white/70 text-xs mb-2">{notification.message}</p>
            <p className="text-white/40 text-[10px]">
                {new Date(notification.createdAt).toLocaleString('pt-BR')}
            </p>
        </>
    );
}
