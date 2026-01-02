'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Newspaper,
    ShoppingBag,
    User,
    Dumbbell,
    Heart,
    Megaphone,
    Briefcase,
    Mail,
    Phone,
    Image as ImageIcon,
    Anchor
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth-context';

// Definição dos tipos de ícones
type NavItem = {
    href: string;
    icon: any;
    label: string;
};

// Configuração dos Menus por Perfil

// Visitantes
const visitorNavItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/news', icon: Newspaper, label: 'Notícias' },
    { href: '/store', icon: ShoppingBag, label: 'Store' },
    { href: '/gallery', icon: ImageIcon, label: 'Galeria' },
    { href: '/about', icon: Phone, label: 'Contato' },
];

// Sócios
const memberNavItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/trainings', icon: Dumbbell, label: 'Treino' },
    { href: '/store', icon: ShoppingBag, label: 'Store' },
    { href: '/volunteer', icon: Heart, label: 'Voluntariado' },
    { href: '/profile/panel', icon: User, label: 'Perfil' },
];

// Treinadores
const coachNavItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/trainings', icon: Dumbbell, label: 'Treino' },
    { href: '/coach/painel', icon: Megaphone, label: 'Coach' },
    { href: '/diretoria/voluntariado', icon: Heart, label: 'Voluntariado' },
    { href: '/profile/panel', icon: User, label: 'Perfil' },
];

// Diretoria
const boardNavItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/trainings', icon: Dumbbell, label: 'Treino' },
    { href: '/coach/painel', icon: Megaphone, label: 'Coach' },
    { href: '/diretoria', icon: Briefcase, label: 'Diretoria' },
    { href: '/profile/panel', icon: User, label: 'Perfil' },
];

export function BottomNav() {
    const pathname = usePathname();
    const { role, isLoaded } = useAuth();

    // Determinar qual menu mostrar baseado na role
    let navItems = visitorNavItems;

    if (isLoaded && role) {
        switch (role) {
            case 'socio':
            case 'atleta':
                navItems = memberNavItems;
                break;
            case 'treinador':
                navItems = coachNavItems;
                break;
            case 'diretoria':
            case 'admin':
                navItems = boardNavItems;
                break;
            default: // visitante
                navItems = visitorNavItems;
                break;
        }
    }

    // Ocultar em rotas específicas (login, telas de treino ao vivo para fullscreen)
    const hiddenRoutes = [
        '/login',
        '/member/login',
        '/coach/login',
        '/admin/login',
        '/training/live',
        '/training/live/gym',
        '/training/warmup',
        '/training/cooldown',
        '/training/start'
    ];
    const isHidden = hiddenRoutes.some(route => pathname.startsWith(route));

    if (isHidden || !isLoaded) return null;

    return (
        <nav className="bottom-nav lg:hidden">
            <div className="bottom-nav-inner">
                {navItems.map((item) => {
                    // Lógica de Ativo: Correspondência exata ou prefixo (exceto root)
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'bottom-nav-item relative',
                                isActive && 'active'
                            )}
                        >
                            {/* Active indicator (linha superior) */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-club-red rounded-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <Icon
                                className={cn(
                                    'w-5 h-5 transition-colors duration-200',
                                    isActive ? 'text-club-red' : 'text-white/40'
                                )}
                                strokeWidth={2}
                            />

                            {/* Label */}
                            <span className={cn(
                                "bottom-nav-label",
                                isActive ? 'text-club-red' : 'text-white/40'
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

