'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Menu,
    X,
    User,
    Search,
    Bell,
    Facebook,
    Instagram,
} from 'lucide-react';
import { useAuth } from './auth-context';

// TikTok icon (not available in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

// Menu base para visitantes
const baseMenuItems = [
    { href: '/', label: 'INÍCIO' },
    { href: '/news', label: 'NOTÍCIAS' },
    { href: '/store', label: 'STORE' },
    { href: '/gallery', label: 'GALERIA' },
    { href: '/about', label: 'CONTATO' },
];

// Menus adicionais por role
const socioMenuItems = [
    { href: '/trainings', label: 'TREINOS' },
    { href: '/diretoria/voluntariado', label: 'VOLUNTARIADO' },
];

const treinadorMenuItems = [
    { href: '/coach/painel', label: 'COACH' },
];

const diretoriaMenuItems = [
    { href: '/diretoria', label: 'DIRETORIA' },
];

// Função para obter menus por role
function getMenuItems(role: string) {
    let items = [...baseMenuItems];

    if (role === 'socio' || role === 'atleta' || role === 'treinador' || role === 'diretoria' || role === 'admin') {
        items = [...items, ...socioMenuItems];
    }

    if (role === 'treinador' || role === 'diretoria' || role === 'admin') {
        items = [...items, ...treinadorMenuItems];
    }

    if (role === 'diretoria' || role === 'admin') {
        items = [...items, ...diretoriaMenuItems];
    }

    return items;
}

export function ClubHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationCount] = useState(3);
    const pathname = usePathname();
    const router = useRouter();
    const { role, logout } = useAuth();

    const isAuthenticated = role !== 'visitante';
    const menuItems = getMenuItems(role);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const handleUserClick = () => {
        if (isAuthenticated) {
            router.push('/profile/panel');
        } else {
            router.push('/login');
        }
    };

    return (
        <>
            {/* ========== DESKTOP HEADER (>=992px) ========== */}
            <header className="hidden lg:block fixed top-0 left-0 right-0 z-50">
                {/* FAIXA SUPERIOR - PRETA (80px) */}
                <div className="bg-[#000000] h-[80px] flex items-center justify-between px-5 relative">
                    {/* Logo Esquerdo - SOBREPOSTO ÀS BARRAS */}
                    <Link href="/" className="absolute left-5 -bottom-[80px] z-50">
                        <div className="relative w-[140px] h-[140px] drop-shadow-2xl">
                            <Image
                                src="/sport_shield_new.svg"
                                alt="Sport Club de Natal"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Texto 'SPORT CLUB' acima */}
                    <div className="absolute left-[155px] top-[4px] z-40">
                        <span className="text-white font-saira-condensed font-bold text-[65px] tracking-tight">
                            SPORT CLUB
                        </span>
                    </div>

                    {/* Texto 'DE NATAL' - posição original */}
                    <div className="absolute left-[180px] top-[54px] z-40">
                        <span className="text-black font-saira-condensed font-bold text-[65px] tracking-tight">
                            DE NATAL
                        </span>
                    </div>

                    {/* Espaçador para compensar o logo */}
                    <div className="w-[140px]"></div>

                    {/* Blocos Funcionais - Direita (com margem para respeitar área das stripes) */}
                    <div className="flex items-center gap-6 mr-[160px]">
                        {/* REDES SOCIAIS */}
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" aria-label="Facebook">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" aria-label="Instagram">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" aria-label="TikTok">
                                <TikTokIcon className="w-6 h-6" />
                            </a>
                        </div>

                        {/* PARCEIROS */}
                        <div className="flex items-center gap-4">
                            <a href="https://www.rn.gov.br/" target="_blank" rel="noopener noreferrer" className="relative h-[30px] w-[40px] hover:opacity-80 transition-opacity" title="Governo do Estado do Rio Grande do Norte">
                                <Image
                                    src="/logos/svg/RN.svg"
                                    alt="Governo do RN"
                                    fill
                                    className="object-contain"
                                />
                            </a>
                            <a href="https://www.natal.rn.gov.br/" target="_blank" rel="noopener noreferrer" className="relative h-[30px] w-[40px] hover:opacity-80 transition-opacity" title="Prefeitura de Natal">
                                <Image
                                    src="/logos/svg/prefeitura.svg"
                                    alt="Prefeitura de Natal"
                                    fill
                                    className="object-contain"
                                />
                            </a>
                            <a href="https://www.instagram.com/eurekaerk/" target="_blank" rel="noopener noreferrer" className="relative h-[30px] w-[40px] hover:opacity-80 transition-opacity" title="Eureka">
                                <Image
                                    src="/logos/svg/ERK.svg"
                                    alt="Eureka"
                                    fill
                                    className="object-contain"
                                />
                            </a>
                            <a href="https://www.remobrasil.com/" target="_blank" rel="noopener noreferrer" className="relative h-[30px] w-[40px] hover:opacity-80 transition-opacity" title="Confederação Brasileira de Remo">
                                <Image
                                    src="/logos/svg/CBR.svg"
                                    alt="CBR"
                                    fill
                                    className="object-contain"
                                />
                            </a>
                            <a href="https://www.potigas.com.br/" target="_blank" rel="noopener noreferrer" className="relative h-[30px] w-[40px] hover:opacity-80 transition-opacity" title="Potigás">
                                <Image
                                    src="/logos/svg/POTIGAS.svg"
                                    alt="Potigás"
                                    fill
                                    className="object-contain"
                                />
                            </a>
                        </div>

                        {/* SISTEMA/USUÁRIO */}
                        <div className="flex items-center gap-4">
                            {/* Indicador de Role */}
                            {isAuthenticated && (
                                <span className="text-[10px] uppercase font-bold text-club-gold bg-black/50 px-2 py-1">
                                    {role === 'diretoria' ? 'Diretoria' : role === 'treinador' ? 'Treinador' : role === 'admin' ? 'Admin' : 'Sócio'}
                                </span>
                            )}
                            <button
                                onClick={handleUserClick}
                                className="text-white hover:opacity-80 transition-opacity"
                                aria-label="Usuário"
                            >
                                <User className="w-6 h-6" />
                            </button>
                            <Link href="/notifications">
                                <button className="text-white hover:opacity-80 transition-opacity relative" aria-label="Notificações">
                                    <Bell className="w-6 h-6" />
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>
                            </Link>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="text-white hover:opacity-80 transition-opacity"
                                aria-label="Buscar"
                            >
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAIXA INFERIOR - VERMELHA (45px) */}
                <div className="bg-[#DC2626] h-[45px] flex items-center justify-between px-5 relative">
                    {/* Espaçador invisível à esquerda para proteger área do texto */}
                    <div className="w-[380px] flex-shrink-0"></div>

                    {/* Menu Central */}
                    <nav className="flex items-center justify-center gap-12 flex-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group font-sans text-sm font-bold tracking-wider text-black hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] active:scale-95 active:drop-shadow-[0_0_12px_rgba(255,255,255,1)] transition-all duration-150"
                            >
                                {item.label}
                                {/* Retângulo preto no hover - alinhado com fundo da barra vermelha */}
                                <span className="absolute left-0 right-0 bottom-[-15px] h-[4px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                            </Link>
                        ))}
                    </nav>

                    {/* Espaçador invisível à direita para proteger área das stripes */}
                    <div className="w-[140px] flex-shrink-0"></div>

                    {/* Recorte Inclinado Decorativo - Direita */}
                    <div className="absolute right-0 top-0 h-full w-[180px] pointer-events-none overflow-visible">
                        <Image
                            src="/stripes_inclined.svg"
                            alt=""
                            fill
                            className="object-contain object-right"
                        />
                    </div>
                </div>
            </header>

            {/* ========== MOBILE HEADER (<992px) ========== */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50">
                {/* FAIXA SUPERIOR - PRETA (80px) */}
                <div className="bg-[#000000] h-[80px] flex items-center justify-between px-4 relative">
                    {/* BLOCO ESQUERDA - REDES SOCIAIS (deslocado 20px para baixo) */}
                    <div className="flex items-center gap-3 translate-y-[20px]">
                        <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white" aria-label="Facebook">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white" aria-label="Instagram">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/sportclubdenatal/" target="_blank" rel="noopener noreferrer" className="text-white" aria-label="TikTok">
                            <TikTokIcon className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Logo Centralizado - MESMO TAMANHO E ATRAVESSANDO AS BARRAS */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 -bottom-[80px] z-50">
                        <div className="relative w-[140px] h-[140px] drop-shadow-2xl">
                            <Image
                                src="/sport_shield_new.svg"
                                alt="Sport Club de Natal"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* BLOCO DIREITA - ÍCONES DO SISTEMA (deslocado 20px para baixo, sem parceiros) */}
                    <div className="flex items-center gap-3 translate-y-[20px]">
                        {/* Ícones do Sistema */}
                        <button
                            onClick={handleUserClick}
                            className="text-white hover:opacity-70 transition-opacity"
                            aria-label="Usuário"
                        >
                            <User className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => router.push('/profile/notices')}
                            className="text-white hover:opacity-70 transition-opacity relative"
                            aria-label="Notificações"
                        >
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-club-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="text-white hover:opacity-70 transition-opacity"
                            aria-label="Buscar"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* FAIXA INFERIOR - VERMELHA (45px) com STRIPES */}
                <div className="bg-[#DC2626] h-[45px] flex items-center justify-between px-4 relative overflow-visible">
                    {/* Stripes decorativos */}
                    <div className="absolute right-0 top-0 h-full w-[180px] pointer-events-none overflow-visible">
                        <Image
                            src="/stripes_inclined.svg"
                            alt=""
                            fill
                            className="object-contain object-right"
                        />
                    </div>

                    {/* Lado Esquerdo: Menu + Indicador de Role */}
                    <div className="flex items-center gap-3 z-10">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-black"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                        {/* Indicador de Role (se logado) */}
                        {isAuthenticated && (
                            <span className="text-[10px] uppercase font-bold text-black bg-white/20 px-2 py-1 rounded">
                                {role === 'diretoria' ? 'Diretoria' : role === 'treinador' ? 'Treinador' : 'Sócio'}
                            </span>
                        )}
                    </div>

                    {/* Espaçador para centralizar visualmente */}
                    <div className="w-1"></div>
                </div>
            </header>

            {/* ========== MOBILE MENU OVERLAY ========== */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/80 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="lg:hidden fixed top-[115px] left-0 bottom-0 w-72 bg-black border-r border-white/10 z-50 overflow-y-auto"
                        >
                            <div className="p-6 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block py-3 px-4 rounded font-bold text-sm tracking-widest transition-colors",
                                            pathname === item.href
                                                ? "bg-[#DC2626] text-white"
                                                : "text-white/70 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* ========== SEARCH OVERLAY ========== */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-[115px] left-0 right-0 bg-black/95 backdrop-blur-lg z-40 p-4 border-b border-white/10"
                    >
                        <div className="container mx-auto max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full bg-white/10 border border-white/20 rounded py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#DC2626]"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from going under fixed header */}
            <div className="h-[125px]" />
        </>
    );
}
