'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Bell, Lock, Trash2, LogOut, Moon, Sun, Globe } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        privacy: {
            showProfile: true,
            showActivity: false
        },
        theme: 'dark' as 'light' | 'dark',
        language: 'pt-BR'
    });

    const handleToggle = (category: string, key: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: !prev[category as keyof typeof prev][key as any]
            }
        }));
    };

    const handleClearCache = async () => {
        if (confirm('Tem certeza que deseja limpar o cache?')) {
            try {
                // Limpar cache do service worker
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }

                // Limpar localStorage
                localStorage.clear();

                alert('Cache limpo com sucesso!');
                window.location.reload();
            } catch (error) {
                console.error('Error clearing cache:', error);
                alert('Erro ao limpar cache');
            }
        }
    };

    const handleLogout = async () => {
        if (confirm('Tem certeza que deseja sair?')) {
            try {
                await fetch('/api/auth/signout', { method: 'POST' });
                router.push('/');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Configurações"
                subtitle="Personalize sua experiência"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Notificações */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Notificações</h3>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                            <span className="text-white">Notificações por Email</span>
                            <input
                                type="checkbox"
                                checked={settings.notifications.email}
                                onChange={() => handleToggle('notifications', 'email')}
                                className="w-5 h-5 rounded border-white/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                            <span className="text-white">Notificações Push</span>
                            <input
                                type="checkbox"
                                checked={settings.notifications.push}
                                onChange={() => handleToggle('notifications', 'push')}
                                className="w-5 h-5 rounded border-white/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                            <span className="text-white">Notificações por SMS</span>
                            <input
                                type="checkbox"
                                checked={settings.notifications.sms}
                                onChange={() => handleToggle('notifications', 'sms')}
                                className="w-5 h-5 rounded border-white/20"
                            />
                        </label>
                    </div>
                </AnimatedCard>

                {/* Privacidade */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Privacidade</h3>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                            <span className="text-white">Perfil Público</span>
                            <input
                                type="checkbox"
                                checked={settings.privacy.showProfile}
                                onChange={() => handleToggle('privacy', 'showProfile')}
                                className="w-5 h-5 rounded border-white/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                            <span className="text-white">Mostrar Atividades</span>
                            <input
                                type="checkbox"
                                checked={settings.privacy.showActivity}
                                onChange={() => handleToggle('privacy', 'showActivity')}
                                className="w-5 h-5 rounded border-white/20"
                            />
                        </label>
                    </div>
                </AnimatedCard>

                {/* Aparência */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        {settings.theme === 'dark' ? (
                            <Moon className="w-5 h-5 text-club-red" />
                        ) : (
                            <Sun className="w-5 h-5 text-club-red" />
                        )}
                        <h3 className="text-white font-bold">Aparência</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.theme === 'light'
                                    ? 'bg-club-red text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <Sun className="w-4 h-4 mx-auto mb-1" />
                            Claro
                        </button>
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.theme === 'dark'
                                    ? 'bg-club-red text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <Moon className="w-4 h-4 mx-auto mb-1" />
                            Escuro
                        </button>
                    </div>
                </AnimatedCard>

                {/* Ações */}
                <div className="space-y-3">
                    <Button
                        onClick={handleClearCache}
                        variant="outline"
                        className="w-full h-12 gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Limpar Cache
                    </Button>

                    <Button
                        onClick={handleLogout}
                        className="w-full h-12 gap-2 bg-red-600 hover:bg-red-700"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair da Conta
                    </Button>
                </div>
            </div>
        </div>
    );
}
