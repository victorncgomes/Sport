'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Moon,
    Sun,
    Globe,
    Shield,
    Smartphone,
    Trash2,
    LogOut,
    ChevronRight,
    ToggleLeft,
    User,
    Lock,
    Mail,
    HelpCircle
} from 'lucide-react';

interface SettingItem {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    type: 'toggle' | 'link' | 'action';
    value?: boolean;
    danger?: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifications: true,
        emailNotifications: true,
        pushNotifications: false,
        darkMode: true,
        biometricLogin: false,
        showOnlineStatus: true,
        publicProfile: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const settingSections: { title: string; items: SettingItem[] }[] = [
        {
            title: 'Conta',
            items: [
                {
                    id: 'profile',
                    icon: <User className="w-5 h-5" />,
                    title: 'Editar Perfil',
                    description: 'Nome, foto, informações pessoais',
                    type: 'link'
                },
                {
                    id: 'password',
                    icon: <Lock className="w-5 h-5" />,
                    title: 'Alterar Senha',
                    description: 'Atualize sua senha de acesso',
                    type: 'link'
                },
                {
                    id: 'email',
                    icon: <Mail className="w-5 h-5" />,
                    title: 'E-mail',
                    description: 'usuario@email.com',
                    type: 'link'
                }
            ]
        },
        {
            title: 'Notificações',
            items: [
                {
                    id: 'notifications',
                    icon: <Bell className="w-5 h-5" />,
                    title: 'Notificações',
                    description: 'Ativar todas as notificações',
                    type: 'toggle',
                    value: settings.notifications
                },
                {
                    id: 'emailNotifications',
                    icon: <Mail className="w-5 h-5" />,
                    title: 'Notificações por E-mail',
                    description: 'Receber atualizações por e-mail',
                    type: 'toggle',
                    value: settings.emailNotifications
                },
                {
                    id: 'pushNotifications',
                    icon: <Smartphone className="w-5 h-5" />,
                    title: 'Push Notifications',
                    description: 'Notificações em tempo real',
                    type: 'toggle',
                    value: settings.pushNotifications
                }
            ]
        },
        {
            title: 'Aparência',
            items: [
                {
                    id: 'darkMode',
                    icon: settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
                    title: 'Modo Escuro',
                    description: 'Alternar entre tema claro e escuro',
                    type: 'toggle',
                    value: settings.darkMode
                },
                {
                    id: 'language',
                    icon: <Globe className="w-5 h-5" />,
                    title: 'Idioma',
                    description: 'Português (Brasil)',
                    type: 'link'
                }
            ]
        },
        {
            title: 'Privacidade e Segurança',
            items: [
                {
                    id: 'biometricLogin',
                    icon: <Shield className="w-5 h-5" />,
                    title: 'Login Biométrico',
                    description: 'Use digital ou Face ID',
                    type: 'toggle',
                    value: settings.biometricLogin
                },
                {
                    id: 'showOnlineStatus',
                    icon: <User className="w-5 h-5" />,
                    title: 'Mostrar Status Online',
                    description: 'Outros podem ver quando você está ativo',
                    type: 'toggle',
                    value: settings.showOnlineStatus
                },
                {
                    id: 'publicProfile',
                    icon: <Globe className="w-5 h-5" />,
                    title: 'Perfil Público',
                    description: 'Seu perfil visível para outros sócios',
                    type: 'toggle',
                    value: settings.publicProfile
                }
            ]
        },
        {
            title: 'Outros',
            items: [
                {
                    id: 'help',
                    icon: <HelpCircle className="w-5 h-5" />,
                    title: 'Ajuda e Suporte',
                    description: 'FAQ, contato, reportar problema',
                    type: 'link'
                },
                {
                    id: 'clearCache',
                    icon: <Trash2 className="w-5 h-5" />,
                    title: 'Limpar Cache',
                    description: 'Liberar espaço de armazenamento',
                    type: 'action'
                },
                {
                    id: 'logout',
                    icon: <LogOut className="w-5 h-5" />,
                    title: 'Sair',
                    description: 'Encerrar sessão',
                    type: 'action',
                    danger: true
                }
            ]
        }
    ];

    const handleAction = (id: string) => {
        switch (id) {
            case 'clearCache':
                // Limpar cache
                if (typeof window !== 'undefined' && 'caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => caches.delete(name));
                    });
                }
                alert('Cache limpo com sucesso!');
                break;
            case 'logout':
                // Redirecionar para logout
                window.location.href = '/api/auth/signout';
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Configurações</h1>
                <p className="text-white/60 text-sm mt-1">
                    Personalize sua experiência
                </p>
            </div>

            {/* App Version */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 mb-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold">Sport Club de Natal</p>
                        <p className="text-white/60 text-sm">Versão 0.4.3</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        Atualizado
                    </div>
                </div>
            </motion.div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {settingSections.map((section, sectionIndex) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex * 0.1 }}
                    >
                        <h2 className="text-white/50 text-sm font-medium mb-2 px-2">
                            {section.title.toUpperCase()}
                        </h2>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                            {section.items.map((item, itemIndex) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.type === 'toggle') {
                                            toggleSetting(item.id as keyof typeof settings);
                                        } else if (item.type === 'action') {
                                            handleAction(item.id);
                                        }
                                    }}
                                    className={`
                                        w-full flex items-center gap-4 p-4 transition-colors
                                        ${itemIndex !== section.items.length - 1 ? 'border-b border-white/10' : ''}
                                        ${item.danger ? 'hover:bg-red-500/10' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <div className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center
                                        ${item.danger ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70'}
                                    `}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                                            {item.title}
                                        </p>
                                        <p className="text-white/50 text-sm">{item.description}</p>
                                    </div>
                                    {item.type === 'toggle' && (
                                        <div className={`
                                            w-12 h-7 rounded-full transition-colors relative
                                            ${item.value ? 'bg-blue-600' : 'bg-white/20'}
                                        `}>
                                            <div className={`
                                                absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                                                ${item.value ? 'left-6' : 'left-1'}
                                            `} />
                                        </div>
                                    )}
                                    {item.type === 'link' && (
                                        <ChevronRight className="w-5 h-5 text-white/40" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white/40 text-sm">
                <p>© 2024 Sport Club de Natal</p>
                <p className="mt-1">Todos os direitos reservados</p>
            </div>
        </div>
    );
}
