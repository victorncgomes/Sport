'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Mail,
    User,
    Clock,
    Star,
    Trash2,
    Reply,
    Archive,
    Filter,
    RefreshCw,
    UserPlus,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    type: 'contato' | 'proposta' | 'interno';
    from: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
    read: boolean;
    starred: boolean;
    target?: string; // sócio, treinador, diretoria
}

// Mensagens mockadas
const mockMessages: Message[] = [
    {
        id: '1',
        type: 'proposta',
        from: 'João Silva',
        email: 'joao@email.com',
        subject: 'Proposta de Associação',
        message: 'Olá, gostaria de me associar ao clube. Tenho experiência com remo há 3 anos e moro próximo ao clube.',
        timestamp: '2026-01-02T18:30:00',
        read: false,
        starred: true
    },
    {
        id: '2',
        type: 'contato',
        from: 'Maria Santos',
        email: 'maria@email.com',
        subject: 'Dúvida sobre aulas experimentais',
        message: 'Boa tarde, gostaria de saber como funciona as aulas experimentais e quanto custa.',
        timestamp: '2026-01-02T15:45:00',
        read: false,
        starred: false
    },
    {
        id: '3',
        type: 'interno',
        from: 'Carlos Membro (Sócio)',
        email: 'carlos@socio.com',
        subject: 'Sugestão de evento',
        message: 'Sugiro organizarmos um torneio interno no próximo mês. Podemos usar os barcos 4x.',
        timestamp: '2026-01-01T10:00:00',
        read: true,
        starred: false,
        target: 'diretoria'
    },
    {
        id: '4',
        type: 'proposta',
        from: 'Pedro Oliveira',
        email: 'pedro@email.com',
        subject: 'Interesse em associação',
        message: 'Olá! Vi o clube pela internet e me interessei muito. Sou atleta de canoagem e gostaria de praticar remo também.',
        timestamp: '2025-12-30T14:20:00',
        read: true,
        starred: false
    }
];

export default function MensagensPage() {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'proposta' | 'contato' | 'interno'>('all');

    const unreadCount = messages.filter(m => !m.read).length;
    const proposalCount = messages.filter(m => m.type === 'proposta' && !m.read).length;

    const filteredMessages = messages.filter(m => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !m.read;
        return m.type === filter;
    });

    const markAsRead = (id: string) => {
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, read: true } : m
        ));
    };

    const toggleStar = (id: string) => {
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, starred: !m.starred } : m
        ));
    };

    const deleteMessage = (id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
    };

    const openMessage = (msg: Message) => {
        markAsRead(msg.id);
        setSelectedMessage(msg);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'proposta': return 'bg-emerald-500';
            case 'contato': return 'bg-blue-500';
            case 'interno': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'proposta': return 'Proposta de Sócio';
            case 'contato': return 'Fale Conosco';
            case 'interno': return 'Interno';
            default: return type;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Agora';
        if (hours < 24) return `${hours}h atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Central de Mensagens"
                subtitle="Comunicações e Propostas"
                description={`${unreadCount} mensagens não lidas${proposalCount > 0 ? ` • ${proposalCount} propostas de sócio` : ''}`}
                compact
            />

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Lista de Mensagens */}
                    <div className="lg:w-1/2">
                        {/* Filtros */}
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                            {[
                                { id: 'all', label: 'Todas' },
                                { id: 'unread', label: `Não Lidas (${unreadCount})` },
                                { id: 'proposta', label: 'Propostas' },
                                { id: 'contato', label: 'Contato' },
                                { id: 'interno', label: 'Interno' }
                            ].map(f => (
                                <Button
                                    key={f.id}
                                    variant={filter === f.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter(f.id as any)}
                                    className="whitespace-nowrap"
                                >
                                    {f.label}
                                </Button>
                            ))}
                        </div>

                        {/* Lista */}
                        <div className="space-y-2">
                            {filteredMessages.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    Nenhuma mensagem encontrada
                                </div>
                            ) : (
                                filteredMessages.map(msg => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <AnimatedCard
                                            variant="glass"
                                            className={`p-4 cursor-pointer transition-all ${!msg.read ? 'border-l-4 border-l-club-red' : ''
                                                } ${selectedMessage?.id === msg.id ? 'ring-2 ring-club-red' : ''}`}
                                            onClick={() => openMessage(msg)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(msg.type)}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-semibold text-white ${!msg.read ? '' : 'opacity-70'}`}>
                                                            {msg.from}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px]">
                                                            {getTypeLabel(msg.type)}
                                                        </Badge>
                                                        {msg.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                                    </div>
                                                    <p className={`text-sm truncate ${!msg.read ? 'text-white' : 'text-white/60'}`}>
                                                        {msg.subject}
                                                    </p>
                                                    <p className="text-xs text-white/40 mt-1">{formatDate(msg.timestamp)}</p>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Visualização da Mensagem */}
                    <div className="lg:w-1/2">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <AnimatedCard variant="glass" className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge className={getTypeColor(selectedMessage.type)}>
                                                {getTypeLabel(selectedMessage.type)}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleStar(selectedMessage.id)}
                                                >
                                                    <Star className={`w-4 h-4 ${selectedMessage.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteMessage(selectedMessage.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedMessage(null)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-2">
                                            {selectedMessage.subject}
                                        </h2>

                                        <div className="flex items-center gap-4 mb-6 text-sm text-white/60">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {selectedMessage.from}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {selectedMessage.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(selectedMessage.timestamp).toLocaleString('pt-BR')}
                                            </span>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 mb-6">
                                            <p className="text-white whitespace-pre-wrap">
                                                {selectedMessage.message}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button className="flex-1 gap-2">
                                                <Reply className="w-4 h-4" />
                                                Responder por Email
                                            </Button>
                                            {selectedMessage.type === 'proposta' && (
                                                <Button variant="outline" className="gap-2 text-emerald-400 border-emerald-400">
                                                    <UserPlus className="w-4 h-4" />
                                                    Cadastrar Sócio
                                                </Button>
                                            )}
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center h-64 text-white/40"
                                >
                                    <div className="text-center">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Selecione uma mensagem para visualizar</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
