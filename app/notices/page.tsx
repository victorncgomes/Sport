'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Megaphone,
    AlertTriangle,
    Info,
    Calendar,
    CheckCircle2,
    X
} from 'lucide-react';

interface Notice {
    id: string;
    title: string;
    content: string;
    type: 'INFO' | 'WARNING' | 'URGENT' | 'EVENT';
    createdAt: string;
    expiresAt: string | null;
    read: boolean;
    author: string;
}

const MOCK_NOTICES: Notice[] = [
    {
        id: '1',
        title: 'Manutenção da Garagem',
        content: 'A garagem estará fechada para manutenção no dia 05/01/2025 das 08h às 12h. Planeje suas reservas com antecedência.',
        type: 'WARNING',
        createdAt: '2024-12-27T10:00:00',
        expiresAt: '2025-01-06T00:00:00',
        read: false,
        author: 'Diretoria'
    },
    {
        id: '2',
        title: 'Inauguração da Nova Sede',
        content: 'Estamos felizes em anunciar a inauguração da nova sede social! Todos os sócios estão convidados para a cerimônia no dia 15/01/2025 às 19h.',
        type: 'EVENT',
        createdAt: '2024-12-26T14:00:00',
        expiresAt: '2025-01-16T00:00:00',
        read: false,
        author: 'Presidente'
    },
    {
        id: '3',
        title: 'Atualização no Sistema de Reservas',
        content: 'Implementamos melhorias no sistema de reservas. Agora você pode ver a disponibilidade em tempo real e receber notificações automáticas.',
        type: 'INFO',
        createdAt: '2024-12-25T09:00:00',
        expiresAt: null,
        read: true,
        author: 'TI'
    },
    {
        id: '4',
        title: 'URGENTE: Condições Climáticas',
        content: 'Devido às condições climáticas adversas previstas para hoje, TODOS os treinos na água estão CANCELADOS. Priorizem a segurança!',
        type: 'URGENT',
        createdAt: '2024-12-27T06:00:00',
        expiresAt: '2024-12-28T00:00:00',
        read: false,
        author: 'Coordenação Náutica'
    }
];

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    const unreadCount = notices.filter(n => !n.read).length;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'URGENT': return <AlertTriangle className="w-5 h-5" />;
            case 'WARNING': return <Bell className="w-5 h-5" />;
            case 'EVENT': return <Calendar className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'URGENT': return 'text-red-400 bg-red-400/10 border-red-400/30';
            case 'WARNING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'EVENT': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
        }
    };

    const markAsRead = (id: string) => {
        setNotices(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotices(prev => prev.map(n => ({ ...n, read: true })));
    };

    const filteredNotices = filter === 'UNREAD'
        ? notices.filter(n => !n.read)
        : notices;

    // Ordenar: urgentes primeiro, depois por data
    const sortedNotices = [...filteredNotices].sort((a, b) => {
        if (a.type === 'URGENT' && b.type !== 'URGENT') return -1;
        if (b.type === 'URGENT' && a.type !== 'URGENT') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Avisos</h1>
                    <p className="text-white/60 text-sm mt-1">
                        {unreadCount} não lido(s)
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-blue-400 text-sm hover:text-blue-300"
                    >
                        Marcar todos como lidos
                    </button>
                )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'ALL'
                            ? 'bg-white text-gray-900'
                            : 'bg-white/10 text-white'
                        }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setFilter('UNREAD')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${filter === 'UNREAD'
                            ? 'bg-white text-gray-900'
                            : 'bg-white/10 text-white'
                        }`}
                >
                    Não lidos
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Lista de Avisos */}
            <div className="space-y-4">
                {sortedNotices.length === 0 ? (
                    <div className="text-center text-white/50 py-12">
                        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Nenhum aviso para exibir</p>
                    </div>
                ) : (
                    sortedNotices.map((notice, index) => (
                        <motion.div
                            key={notice.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                                setSelectedNotice(notice);
                                markAsRead(notice.id);
                            }}
                            className={`
                                bg-white/10 backdrop-blur-lg rounded-xl p-4 cursor-pointer
                                border transition-all hover:bg-white/15
                                ${notice.read ? 'border-transparent' : 'border-l-4 ' + getTypeColor(notice.type).split(' ')[2]}
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${getTypeColor(notice.type)}`}>
                                    {getTypeIcon(notice.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h3 className={`font-semibold ${notice.read ? 'text-white/70' : 'text-white'}`}>
                                            {notice.title}
                                        </h3>
                                        {!notice.read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </div>
                                    <p className="text-white/50 text-sm mt-1 line-clamp-2">
                                        {notice.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                                        <span>{notice.author}</span>
                                        <span>
                                            {new Date(notice.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal de Detalhe */}
            {selectedNotice && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4"
                    onClick={() => setSelectedNotice(null)}
                >
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-800 rounded-t-3xl w-full max-w-lg p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-lg ${getTypeColor(selectedNotice.type)}`}>
                                {getTypeIcon(selectedNotice.type)}
                            </div>
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                            {selectedNotice.title}
                        </h2>

                        <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                            <span>Por {selectedNotice.author}</span>
                            <span>•</span>
                            <span>
                                {new Date(selectedNotice.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        <p className="text-white/80 leading-relaxed">
                            {selectedNotice.content}
                        </p>

                        {selectedNotice.expiresAt && (
                            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                <p className="text-yellow-200 text-sm">
                                    Válido até: {new Date(selectedNotice.expiresAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
