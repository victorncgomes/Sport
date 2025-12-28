'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NoticesPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotices();
    }, [filter]);

    async function loadNotices() {
        try {
            const params = new URLSearchParams();
            if (filter !== 'ALL') {
                params.append('read', filter === 'READ' ? 'true' : 'false');
            }

            const response = await fetch(`/api/profile/notices?${params}`);
            const data = await response.json();
            setNotices(data.notices || []);
        } catch (error) {
            console.error('Error loading notices:', error);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(noticeId: string) {
        try {
            await fetch(`/api/profile/notices/${noticeId}/read`, {
                method: 'POST'
            });
            loadNotices();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'INFO': return Info;
            case 'WARNING': return AlertCircle;
            case 'SUCCESS': return CheckCircle;
            default: return Bell;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'INFO': return 'text-blue-400';
            case 'WARNING': return 'text-yellow-400';
            case 'SUCCESS': return 'text-green-400';
            default: return 'text-white/60';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <p className="text-white/60">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Avisos"
                subtitle="Fique por dentro das novidades"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { value: 'ALL' as const, label: 'Todos' },
                        { value: 'UNREAD' as const, label: 'Não Lidos' },
                        { value: 'READ' as const, label: 'Lidos' }
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className="flex-shrink-0"
                        >
                            <Badge
                                className={`cursor-pointer transition-all ${filter === f.value
                                        ? 'bg-club-red text-white border-club-red'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {f.label}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* Lista de Avisos */}
                <div className="space-y-4">
                    {notices.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">Nenhum aviso encontrado</p>
                        </AnimatedCard>
                    ) : (
                        notices.map((notice) => {
                            const Icon = getTypeIcon(notice.type);
                            const iconColor = getTypeColor(notice.type);

                            return (
                                <AnimatedCard
                                    key={notice.id}
                                    variant="glass"
                                    className={`p-6 cursor-pointer transition-all ${!notice.read ? 'ring-1 ring-club-red/30' : ''
                                        }`}
                                    onClick={() => !notice.read && markAsRead(notice.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className={`font-bold ${!notice.read ? 'text-white' : 'text-white/60'}`}>
                                                    {notice.title}
                                                </h4>
                                                {!notice.read && (
                                                    <div className="w-2 h-2 rounded-full bg-club-red" />
                                                )}
                                            </div>
                                            <p className="text-white/60 text-sm mb-2">
                                                {notice.message}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-white/40">
                                                <span>{new Date(notice.createdAt).toLocaleDateString('pt-BR')}</span>
                                                <span>•</span>
                                                <span>{new Date(notice.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
