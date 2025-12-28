import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Ship, Users, Calendar, Trophy, ArrowRight, CreditCard } from 'lucide-react';
import { getMemberDashboardData } from '@/lib/actions/member';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
    // Para modo demonstração, usamos o sócio do seed
    const userData = await getMemberDashboardData('socio1@email.com');

    if (!userData) {
        return <div className="pt-24 text-center text-white">Erro ao carregar dados do sócio.</div>;
    }

    const { membership, reservations, trainingSessions, payments } = userData;
    const activeReservations = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length;
    const upcomingTrainings = trainingSessions.length;

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-club-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <HeroSection
                title={`Olá, ${userData.name}`}
                subtitle="Painel do Sócio"
                description="Bem‑vindo ao seu espaço exclusivo do Sport Club de Natal"
                compact
            />

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Status Financeiro & Membership - Quick View */}
                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    <AnimatedCard variant="glass" className="flex flex-col items-center justify-center py-6">
                        <Ship className="w-8 h-8 text-club-red mb-2" />
                        <div className="text-2xl font-bold text-white">{activeReservations}</div>
                        <div className="text-xs text-white/40 uppercase">Barcos Reservados</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="flex flex-col items-center justify-center py-6">
                        <Calendar className="w-8 h-8 text-club-red mb-2" />
                        <div className="text-2xl font-bold text-white">{upcomingTrainings}</div>
                        <div className="text-xs text-white/40 uppercase">Treinos Agendados</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="flex flex-col items-center justify-center py-6">
                        <CreditCard className="w-8 h-8 text-emerald-400 mb-2" />
                        <div className="text-sm font-bold text-white">MENSALIDADE</div>
                        <Badge variant="outline" className="mt-1 border-emerald-500/50 text-emerald-400">Regular</Badge>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="flex flex-col items-center justify-center py-6">
                        <Trophy className="w-8 h-8 text-club-gold mb-2" />
                        <div className="text-2xl font-bold text-club-gold">{userData.points}</div>
                        <div className="text-xs text-white/40 uppercase">Pontos Acumulados</div>
                    </AnimatedCard>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Reservas e Treinos */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Minhas Próximas Atividades</h2>
                                <Link href="/trainings" className="text-club-gold text-sm hover:underline">Ver grade de treinos</Link>
                            </div>
                            <div className="space-y-4">
                                {trainingSessions.length > 0 ? (
                                    trainingSessions.map((session) => (
                                        <AnimatedCard key={session.id} variant="glass" hover>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-club-red/20 flex items-center justify-center text-club-red">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{session.training.title}</h4>
                                                        <p className="text-xs text-white/50">
                                                            {new Date(session.training.startTime).toLocaleDateString('pt-BR')} às {new Date(session.training.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={session.attended ? "bg-emerald-500/20 text-emerald-400" : "bg-club-gold/20 text-club-gold"}>
                                                    {session.attended ? "Presente" : "Confirmado"}
                                                </Badge>
                                            </div>
                                        </AnimatedCard>
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-white/40">
                                        Nenhum treino agendado.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Barcos Reservados</h2>
                                <Link href="/boats" className="text-club-gold text-sm hover:underline">Nova reserva</Link>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {reservations.length > 0 ? (
                                    reservations.map((res) => (
                                        <AnimatedCard key={res.id} variant="glass" hover>
                                            <h4 className="font-bold text-white">{res.boat.name}</h4>
                                            <p className="text-xs text-white/50 mb-3">{res.boat.type}</p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[10px] text-white/30 uppercase">
                                                    {new Date(res.startTime).toLocaleDateString('pt-BR')}
                                                </span>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {res.status}
                                                </Badge>
                                            </div>
                                        </AnimatedCard>
                                    ))
                                ) : (
                                    <div className="col-span-full p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-white/40">
                                        Nenhuma reserva encontrada.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Perfil & Financeiro */}
                    <div className="space-y-8">
                        <AnimatedCard variant="gradient" className="p-6">
                            <h3 className="font-bold text-white mb-4">Seu Plano</h3>
                            <div className="mb-4">
                                <div className="text-xs text-white/40 uppercase">Categoria</div>
                                <div className="text-lg font-bold text-club-gold">{membership?.membershipType.name}</div>
                            </div>
                            <div className="space-y-3">
                                <Link href="/profile/card" className="block">
                                    <Button variant="secondary" className="w-full gap-2">
                                        <Users className="w-4 h-4" />
                                        Carteirinha Digital
                                    </Button>
                                </Link>
                                <Link href="/profile/panel" className="block">
                                    <Button variant="outline" className="w-full gap-2 text-white border-white/20">
                                        <Users className="w-4 h-4" />
                                        Gerenciar Perfil
                                    </Button>
                                </Link>
                            </div>
                        </AnimatedCard>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Últimos Pagamentos</h2>
                            <div className="space-y-3">
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div>
                                                <div className="text-sm font-bold text-white">{p.description}</div>
                                                <div className="text-[10px] text-white/40 uppercase">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">R$ {p.amount.toFixed(2)}</div>
                                                <div className={`text-[10px] font-bold ${p.status === 'PAID' ? 'text-emerald-400' : 'text-club-red'}`}>
                                                    {p.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-white/30 text-sm">Histórico vazio.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
