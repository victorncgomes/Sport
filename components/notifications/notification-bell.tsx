'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications, Notification } from '@/lib/data/notifications';
import { cn } from '@/lib/utils';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-club-red rounded-full flex items-center justify-center"
                    >
                        <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                    </motion.div>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Notification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-club-black border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Notificações</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-club-gold hover:text-club-gold-light transition-colors"
                                        >
                                            Marcar todas como lidas
                                        </button>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <p className="text-xs text-white/40">{unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}</p>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-white/40">
                                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">Nenhuma notificação</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onClick={() => markAsRead(notification.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

interface NotificationItemProps {
    notification: Notification;
    onClick: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const typeColors = {
        info: 'border-blue-500/20 bg-blue-500/5',
        event: 'border-club-gold/20 bg-club-gold/5',
        warning: 'border-club-red/20 bg-club-red/5',
    };

    const typeTextColors = {
        info: 'text-blue-400',
        event: 'text-club-gold',
        warning: 'text-club-red',
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left',
                !notification.read && 'bg-white/[0.02]'
            )}
        >
            <div className="flex gap-3">
                <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-xl',
                    typeColors[notification.type]
                )}>
                    {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn(
                            'text-sm font-bold',
                            !notification.read ? 'text-white' : 'text-white/60'
                        )}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-club-red" />
                        )}
                    </div>
                    <p className={cn(
                        'text-xs leading-relaxed line-clamp-2',
                        !notification.read ? 'text-white/70' : 'text-white/40'
                    )}>
                        {notification.message}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                        {formatDate(notification.createdAt)}
                    </p>
                </div>
            </div>
        </button>
    );
}

function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Agora';
    if (hours < 24) return `Há ${hours}h`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `Há ${days} dias`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
