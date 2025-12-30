'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    User,
    CreditCard,
    FileText,
    Heart,
    Bell,
    Settings,
    Camera,
    QrCode,
    ArrowRight,
    Star,
    Trophy,
    Flame,
    Calendar,
    Zap
} from 'lucide-react';
import { XPIcon, LevelBadgeIcon, StreakIcon, TrophyIcon } from '@/components/icons/gamification-icons';
import { getMemberDashboardData, type MemberDashboardData } from '@/lib/actions/member';

const menuItems = [
    {
        href: '/profile/data',
        icon: User,
        title: 'Dados Pessoais',
        description: 'Informações de contato e documentos',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
    },
    {
        href: '/profile/anamnese',
        icon: FileText,
        title: 'Anamnese e Dados Físicos',
        description: 'Histórico de saúde e avaliações',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
    },
    {
        href: '/profile/payments',
        icon: CreditCard,
        title: 'Pagamentos',
        description: 'Mensalidades, boletos e histórico',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/20',
    },
    {
        href: '/profile/volunteer',
        icon: Heart,
        title: 'Voluntariado',
        description: 'Programas e disponibilidade',
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/20',
    },
    {
        href: '/profile/notifications',
        icon: Bell,
        title: 'Avisos',
        description: 'Notificações e comunicados',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
    },
    {
        href: '/profile/settings',
        icon: Settings,
        title: 'Configurações',
        description: 'Preferências e segurança',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
    },
];

export default function ProfilePanelPage() {
    const { role, isLoaded, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<MemberDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            if (role === 'visitante') {
                router.push('/login');
                return;
            }

            // Buscar dados do membro (simulado)
            const fetchData = async () => {
                try {
                    const data = await getMemberDashboardData('socio1@email.com');
                    setUserData(data);
                } catch (error) {
                    console.error('Erro ao buscar dados:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isLoaded, role, router]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!userData) {
        return <div className="pt-24 text-center text-white">Erro ao carregar perfil.</div>;
    }

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-club-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Profile Card */}
                <div>
                    <AnimatedCard variant="gradient" className="mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-club-red to-club-red-800 flex items-center justify-center ring-4 ring-club-gold/30 shadow-glow-red">
                                    {userData.image ? (
                                        <img src={userData.image} alt={userData.name} className="w-full h-full rounded-2xl object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-white/70" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-club-gold flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4 text-club-black" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                                <p className="text-white/50">{userData.email}</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                                    <Badge className="bg-club-gold/20 text-club-gold border-0">
                                        {userData.membership?.membershipType.name}
                                    </Badge>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                                        {userData.membership?.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-white/40 mt-2">
                                    Matrícula: {userData.membership?.memberNumber}
                                </p>
                            </div>

                            {/* QR Code Button */}
                            <Link href="/profile/card">
                                <Button variant="outline" className="gap-2 border-white/20 text-white">
                                    <QrCode className="w-4 h-4" />
                                    Carteirinha
                                </Button>
                            </Link>
                        </div>
                    </AnimatedCard>
                </div>

                {/* Gamification Stats */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <AnimatedCard variant="carbon" hover="glow" className="p-4 text-center group">
                            <div className="w-10 h-10 mx-auto mb-2 transform group-hover:scale-110 transition-transform">
                                <XPIcon />
                            </div>
                            <div className="text-2xl font-black text-club-gold tracking-tighter">{userData.points}</div>
                            <div className="text-[10px] text-white/60 uppercase font-black tracking-widest">XP Total</div>
                        </AnimatedCard>
                        <AnimatedCard variant="metal" hover="glow" className="p-4 text-center group">
                            <div className="w-10 h-10 mx-auto mb-2 transform group-hover:rotate-12 transition-transform">
                                <LevelBadgeIcon level={userData.level || 5} />
                            </div>
                            <div className="text-2xl font-black text-club-gold tracking-tighter">Lv.{userData.level}</div>
                            <div className="text-[10px] text-white/60 uppercase font-black tracking-widest">Nível</div>
                        </AnimatedCard>
                        <AnimatedCard variant="carbon" hover="glow" className="p-4 text-center group">
                            <div className="w-10 h-10 mx-auto mb-2 transform group-hover:scale-125 transition-transform">
                                <StreakIcon days={12} />
                            </div>
                            <div className="text-2xl font-black text-club-red tracking-tighter">12d</div>
                            <div className="text-[10px] text-white/60 uppercase font-black tracking-widest">Sequência</div>
                        </AnimatedCard>
                        <AnimatedCard variant="metal" hover="glow" className="p-4 text-center group">
                            <div className="w-10 h-10 mx-auto mb-2 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                                <TrophyIcon place={3} />
                            </div>
                            <div className="text-2xl font-black text-club-gold tracking-tighter">#3</div>
                            <div className="text-[10px] text-white/60 uppercase font-black tracking-widest">Ranking</div>
                        </AnimatedCard>
                    </div>
                </div>

                {/* Progressão de Barcos */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">🚣</span>
                            Meus Barcos
                        </h2>
                        <Link href="/boats">
                            <Button variant="ghost" className="text-white/40 hover:text-white text-sm gap-1">
                                Ver Todos <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Barra de Progresso */}
                    <AnimatedCard variant="glass" className="mb-4">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/60">Nível {userData.level}</span>
                                    <span className="text-club-gold font-bold">{userData.points} XP</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-club-red to-club-gold rounded-full transition-all duration-1000"
                                        style={{ width: `${((userData.points || 0) % 500) / 5}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-white/40 mt-1">
                                    {500 - ((userData.points || 0) % 500)} XP para próximo barco
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* Barcos em Grid Horizontal */}
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {/* Barcos Desbloqueados */}
                        {[
                            { name: 'Single Skiff', emoji: '🚣', level: 1, unlocked: true },
                            { name: 'Double Scull', emoji: '🚣‍♂️', level: 5, unlocked: true },
                            { name: 'Coxed Four', emoji: '🛶', level: 10, unlocked: (userData.level || 0) >= 10 },
                            { name: 'Eight', emoji: '⛵', level: 15, unlocked: (userData.level || 0) >= 15 },
                            { name: 'Racing Shell', emoji: '🏆', level: 25, unlocked: (userData.level || 0) >= 25 }
                        ].map((boat, i) => (
                            <div
                                key={boat.name}
                                className={`flex-shrink-0 w-28 text-center p-4 rounded-xl transition-all ${boat.unlocked
                                        ? 'bg-gradient-to-br from-club-red/20 to-club-gold/20 border border-club-gold/30'
                                        : 'bg-white/5 border border-white/10 opacity-50'
                                    }`}
                            >
                                <div className={`text-3xl mb-2 ${boat.unlocked ? '' : 'grayscale'}`}>
                                    {boat.unlocked ? boat.emoji : '🔒'}
                                </div>
                                <div className={`text-xs font-bold ${boat.unlocked ? 'text-white' : 'text-white/40'}`}>
                                    {boat.name}
                                </div>
                                <div className="text-[10px] text-white/40">
                                    Nível {boat.level}
                                </div>
                                {boat.unlocked && (
                                    <div className="mt-2">
                                        <Badge className="text-[8px] bg-emerald-500/20 text-emerald-400">
                                            ✓ Desbloqueado
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumo Financeiro - NEW Section requested by USER */}
                <div className="mb-8">
                    <AnimatedCard variant="glass" className="border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Situação Financeira</div>
                                    <h3 className="text-lg font-bold text-white">Mensalidade em Dia</h3>
                                    <p className="text-xs text-white/40 italic">Próximo vencimento: 10/01/2025</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
                                    Ver Boletos
                                </Button>
                                <Button size="sm" className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600">
                                    Copiar Pix
                                </Button>
                            </div>
                        </div>
                    </AnimatedCard>
                </div>

                {/* Menu Items */}
                <div className="grid md:grid-cols-2 gap-3">
                    {menuItems.map((item, i) => (
                        <Link key={item.href} href={item.href}>
                            <AnimatedCard variant="glass" hover className="h-full">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white">{item.title}</h3>
                                        <p className="text-sm text-white/50 truncate">{item.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/30" />
                                </div>
                            </AnimatedCard>
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <div className="mt-12 text-center">
                    <Button
                        variant="ghost"
                        className="text-white/40 hover:text-club-red"
                        onClick={() => logout()}
                    >
                        Sair da conta
                    </Button>
                </div>
            </div>
        </div>
    );
}

