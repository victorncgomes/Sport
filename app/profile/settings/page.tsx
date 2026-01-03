'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Bell, Lock, LogOut, Moon, Sun, Type, Eye, EyeOff, Loader2 } from 'lucide-react';

// Tipos para configurações
type ThemeMode = 'light' | 'dark';
type FontSize = 'normal' | 'grande' | 'extra-grande';

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true
        },
        theme: 'dark' as ThemeMode,
        fontSize: 'normal' as FontSize
    });

    // Estado para alteração de senha
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Carregar configurações do localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeMode;
        const savedFontSize = localStorage.getItem('fontSize') as FontSize;

        if (savedTheme) {
            setSettings(prev => ({ ...prev, theme: savedTheme }));
            applyTheme(savedTheme);
        }

        if (savedFontSize) {
            setSettings(prev => ({ ...prev, fontSize: savedFontSize }));
            applyFontSize(savedFontSize);
        }
    }, []);

    // Aplicar tema
    const applyTheme = (theme: ThemeMode) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        } else {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
        }
    };

    // Aplicar tamanho da fonte
    const applyFontSize = (size: FontSize) => {
        document.documentElement.setAttribute('data-font-size', size);
        localStorage.setItem('fontSize', size);

        const root = document.documentElement;
        switch (size) {
            case 'normal':
                root.style.fontSize = '16px';
                break;
            case 'grande':
                root.style.fontSize = '18px';
                break;
            case 'extra-grande':
                root.style.fontSize = '20px';
                break;
        }
    };

    const handleThemeChange = (theme: ThemeMode) => {
        setSettings(prev => ({ ...prev, theme }));
        applyTheme(theme);
    };

    const handleFontSizeChange = (fontSize: FontSize) => {
        setSettings(prev => ({ ...prev, fontSize }));
        applyFontSize(fontSize);
    };

    const handleToggle = (category: string, key: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: !prev[category as keyof typeof prev][key as any]
            }
        }));
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        // Validações
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.error || 'Erro ao alterar senha');
            } else {
                setPasswordSuccess(true);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setPasswordError('Erro de conexão');
        } finally {
            setPasswordLoading(false);
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
                            onClick={() => handleThemeChange('light')}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.theme === 'light'
                                ? 'bg-club-red text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <Sun className="w-4 h-4 mx-auto mb-1" />
                            Claro
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
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

                {/* Tamanho da Fonte */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Type className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Tamanho da Fonte</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleFontSizeChange('normal')}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.fontSize === 'normal'
                                ? 'bg-club-red text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <span className="text-xs">A</span>
                            <span className="block text-[10px] mt-1">Normal</span>
                        </button>
                        <button
                            onClick={() => handleFontSizeChange('grande')}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.fontSize === 'grande'
                                ? 'bg-club-red text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <span className="text-base">A</span>
                            <span className="block text-[10px] mt-1">Grande</span>
                        </button>
                        <button
                            onClick={() => handleFontSizeChange('extra-grande')}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${settings.fontSize === 'extra-grande'
                                ? 'bg-club-red text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            <span className="text-lg">A</span>
                            <span className="block text-[10px] mt-1">Extra Grande</span>
                        </button>
                    </div>
                </AnimatedCard>

                {/* Alterar Senha */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-club-red" />
                        <h3 className="text-white font-bold">Alterar Senha</h3>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                placeholder="Senha atual"
                                value={passwordForm.currentPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                placeholder="Nova senha (mín. 6 caracteres)"
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                            >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                placeholder="Confirmar nova senha"
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {passwordError && (
                            <p className="text-red-400 text-sm">{passwordError}</p>
                        )}
                        {passwordSuccess && (
                            <p className="text-emerald-400 text-sm">Senha alterada com sucesso!</p>
                        )}

                        <Button
                            type="submit"
                            disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            className="w-full bg-club-red hover:bg-club-red/90"
                        >
                            {passwordLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Alterar Senha'
                            )}
                        </Button>
                    </form>
                </AnimatedCard>

                {/* Sair */}
                <div className="pt-4">
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
