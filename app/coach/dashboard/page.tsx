import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Users,
    ClipboardCheck,
    Trophy,
    Plus,
    Clock,
    MapPin,
    ArrowRight,
    TrendingUp,
    Search,
    User,
    BarChart3,
    BookOpen,
    Medal,
    Target,
    Settings,
    Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getCoachDashboardData } from '@/lib/actions/coach';

export default async function CoachDashboardPage() {
    // Para modo demonstração, usamos o treinador do seed
    const data = await getCoachDashboardData('treinador@scnatal.com.br');

    if (!data) {
        return <div className="pt-24 text-center text-white font-black uppercase tracking-widest">Erro ao carregar dados do treinador.</div>;
    }

    const { coach, trainings, stats } = data;

    const coachStats = [
        { label: 'Treinos Aplicados', value: stats.totalTrainings.toString(), icon: Calendar, color: 'text-blue-400' },
        { label: 'Total Alunos', value: stats.totalStudents.toString(), icon: Users, color: 'text-emerald-400' },
        { label: 'Aproveitamento', value: `${stats.attendanceRate}%`, icon: TrendingUp, color: 'text-club-gold' },
        { label: 'Atletas Ranking', value: stats.competingAthletes.toString(), icon: Trophy, color: 'text-club-red' },
    ];

    const categories = [
        { name: 'Júnior', count: 12, color: 'bg-blue-500/20 text-blue-400' },
        { name: 'Adulto', count: 45, color: 'bg-club-red/20 text-club-red' },
        { name: 'Master', count: 18, color: 'bg-club-gold/20 text-club-gold' },
        { name: 'Feminino', count: 32, color: 'bg-pink-500/20 text-pink-400' },
        { name: 'Misto', count: 8, color: 'bg-purple-500/20 text-purple-400' },
    ];

    return (
        <div className="min-h-screen bg-club-black pt-24 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-club-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-club-red to-club-red-800 flex items-center justify-center shadow-glow-red">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Painel do Treinador</h1>
                                <p className="text-club-red font-bold text-xs uppercase tracking-widest">Prof. {coach.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="gap-2 bg-club-red hover:bg-club-red-700 text-xs font-black uppercase tracking-widest py-6 px-8 shadow-glow-red">
                            <Plus className="w-4 h-4" />
                            Novo Plano
                        </Button>
                        <Button variant="outline" className="gap-2 border-white/10 text-white text-xs font-black uppercase tracking-widest py-6 px-8 hover:bg-white/5">
                            <BookOpen className="w-4 h-4" />
                            Diário
                        </Button>
                    </div>
                </div>

                {/* Categories Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {categories.map((cat, i) => (
                        <AnimatedCard key={i} variant="glass" className="p-4 text-center border-white/5">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${cat.color} mb-2 inline-block`}>
                                {cat.name}
                            </span>
                            <div className="text-2xl font-black text-white">{cat.count}</div>
                            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Atletas</div>
                        </AnimatedCard>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Performance & Athletes */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Análise de Performance</h2>
                                    <p className="text-white/30 text-xs uppercase font-bold tracking-widest">Média da Equipe vs Metas</p>
                                </div>
                                <BarChart3 className="w-6 h-6 text-club-gold" />
                            </div>

                            <div className="space-y-6">
                                {['Resistência', 'Força Explosiva', 'Sincronia', 'Frequência Cardíaca Média'].map((metric, i) => (
                                    <div key={metric} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                            <span className="text-white/70">{metric}</span>
                                            <span className="text-club-red">{[85, 72, 94, 65][i]}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-club-red shadow-glow-red" style={{ width: `${[85, 72, 94, 65][i]}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Gestão de Atletas</h2>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input type="text" placeholder="Buscar atleta..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-club-red/50 w-48" />
                                    </div>
                                    <Button variant="outline" className="border-white/10 h-10 px-3"><Filter className="w-4 h-4" /></Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'Ana Silva', category: 'Feminino', performance: '98%', status: 'active', avatar: 'AS' },
                                    { name: 'Bruno Santos', category: 'Adulto', performance: '85%', status: 'warning', avatar: 'BS' },
                                    { name: 'Carla Melo', category: 'Master', performance: '92%', status: 'active', avatar: 'CM' },
                                    { name: 'Diego Ferreira', category: 'Júnior', performance: '70%', status: 'maintenance', avatar: 'DF' },
                                ].map((athlete, i) => (
                                    <AnimatedCard key={i} variant="glass" className="p-4 border-white/5 group hover:border-club-red/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-club-red/10 border border-club-red/20 flex items-center justify-center font-black text-club-red text-xs">
                                                    {athlete.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white group-hover:text-club-red transition-colors">{athlete.name}</h4>
                                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{athlete.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-white">{athlete.performance}</div>
                                                <div className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-1",
                                                    athlete.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                                                        athlete.status === 'warning' ? "bg-amber-500/10 text-amber-500" : "bg-club-red/10 text-club-red"
                                                )}>
                                                    {athlete.status === 'active' ? 'Em Dia' : athlete.status === 'warning' ? 'Atenção' : 'Afastado'}
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Próximos Treinos</h2>
                                <Button variant="ghost" className="text-xs text-club-gold hover:text-white uppercase font-black tracking-widest">Agenda Completa</Button>
                            </div>
                            <div className="grid gap-4">
                                {trainings.map((training) => (
                                    <AnimatedCard key={training.id} variant="glass" className="p-6 group hover:border-club-red/30 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-club-red/30 transition-colors">
                                                    <span className="text-[10px] font-black text-club-red uppercase tracking-tighter">{new Date(training.startTime).toLocaleString('pt-BR', { month: 'short' })}</span>
                                                    <span className="text-xl font-black text-white">{new Date(training.startTime).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-club-red transition-colors">{training.title}</h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="flex items-center gap-1.5 text-xs text-white/40"><Clock className="w-3 h-3" /> {new Date(training.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span className="flex items-center gap-1.5 text-xs text-white/40"><Users className="w-3 h-3" /> {training.sessions.length} Atletas</span>
                                                        <span className="flex items-center gap-1.5 text-xs text-white/40"><MapPin className="w-3 h-3" /> Base SCN</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button className="bg-white/5 hover:bg-club-red text-white border border-white/10 hover:border-club-red transition-all px-6 text-[10px] font-black uppercase tracking-widest h-11">Chamada</Button>
                                                <Button variant="outline" className="border-white/10 text-white/40 hover:text-white hover:bg-white/5 h-11"><ArrowRight className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Competition & Notes */}
                    <div className="space-y-8">
                        <AnimatedCard variant="gradient" className="p-8">
                            <Medal className="w-12 h-12 text-white mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Competições Próximas</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Regata de Junho - Potengi', date: '15/06', status: 'Inscrições Abertas' },
                                    { name: 'Estadual de Remo', date: '02/07', status: 'Planejamento' },
                                ].map((comp, i) => (
                                    <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-white leading-tight">{comp.name}</h4>
                                            <span className="text-[10px] font-black text-club-gold">{comp.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{comp.status}</span>
                                            <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-black text-club-red uppercase tracking-widest">Inscrever Equipe</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Anotações & Notas</h3>
                                <Plus className="w-4 h-4 text-white/30 cursor-pointer hover:text-white" />
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border-l-2 border-club-gold">
                                    <p className="text-xs text-white/80 leading-relaxed">Verificar estado do remo nº 14 (skiff júnior) antes do treino de amanhã.</p>
                                    <span className="text-[8px] text-white/20 uppercase font-bold mt-2 block">12/05 - 14:20</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border-l-2 border-club-red">
                                    <p className="text-xs text-white/80 leading-relaxed">Reunião técnica com diretoria sobre novas metas de performance.</p>
                                    <span className="text-[8px] text-white/20 uppercase font-bold mt-2 block">11/05 - 09:00</span>
                                </div>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard variant="glass" className="p-8 border-club-gold/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Reservas de Barcos</h3>
                                <Plus className="w-4 h-4 text-white/30 cursor-pointer hover:text-white" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    { boat: 'Potengi I (Single)', user: 'João Silva', time: '06:00 - 07:30', status: 'Confirmado' },
                                    { boat: 'Natal (Quad)', user: 'Equipe Júnior', time: '08:00 - 10:00', status: 'Em Uso' },
                                    { boat: 'Potengi II (Double)', user: 'Ana & Bia', time: '16:00 - 17:30', status: 'Pendente' },
                                ].map((res, i) => (
                                    <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-club-gold/30 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-club-gold uppercase tracking-widest">{res.boat}</p>
                                                <p className="text-xs font-bold text-white mt-1 group-hover:text-club-gold transition-colors">{res.user}</p>
                                            </div>
                                            <span className="text-[8px] font-black text-white/20 uppercase">{res.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <AnimatedCard variant="glass" className="p-6">
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Atalhos do Treinador</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/coach/metas">
                                    <Button variant="outline" className="h-20 w-full flex-col gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">
                                        <Target className="w-5 h-5 text-club-red" /> Metas
                                    </Button>
                                </Link>
                                <Link href="/coach/ajustes">
                                    <Button variant="outline" className="h-20 w-full flex-col gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">
                                        <Settings className="w-5 h-5 text-blue-500" /> Ajustes
                                    </Button>
                                </Link>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
