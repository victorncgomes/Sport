'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Search, UserPlus, Filter, MoreHorizontal, FileText,
    CreditCard, Calendar, Activity, ChevronRight, X, Mail, Phone, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockUsers = [
    { id: '1', name: 'Ricardo Mendes', email: 'ricardo@email.com', role: 'MEMBER', level: 12, status: 'Ativo', plan: 'Sócio Atleta', joinDate: '12/05/2010', matricula: '00125' },
    { id: '2', name: 'Ana Paula Santos', email: 'ana@email.com', role: 'COACH', level: 25, status: 'Ativo', plan: 'Colaborador', joinDate: '20/08/2015', matricula: '00085' },
    { id: '3', name: 'Marcos Oliveira', email: 'marcos@email.com', role: 'MEMBER', level: 5, status: 'Inadimplente', plan: 'Sócio Contribuinte', joinDate: '15/01/2023', matricula: '00452' },
];

export default function adminUsersPage() {
    const [selectedUser, setSelectedUser] = useState<any>(null);

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Gestão de Associados"
                subtitle="Registro de Membros"
                description="Consulte fichas detalhadas, histórico financeiro e dados de filiação."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou matrícula..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-club-red outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="border-white/10 gap-2 text-xs font-black uppercase tracking-widest hover:bg-white/5">
                            <Filter className="w-4 h-4" /> Filtros
                        </Button>
                        <Button className="bg-club-red hover:bg-club-red-700 gap-2 text-xs font-black uppercase tracking-widest shadow-glow-red">
                            <UserPlus className="w-4 h-4" /> Novo Sócio
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {mockUsers.map((user) => (
                        <AnimatedCard key={user.id} variant="glass" className="p-4 hover:border-white/20 transition-all group cursor-pointer" onClick={() => setSelectedUser(user)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-club-red/20 to-club-red flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold group-hover:text-club-red transition-colors">{user.name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">
                                            <span>Matricula: {user.matricula}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{user.plan}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Status</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${user.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-club-red/20 text-club-red'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-club-red transition-all" />
                                </div>
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            </div>

            {/* Ficha do Associado - Modal/Overlay */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-club-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-club-black border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl maxHeight-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-club-red flex items-center justify-center text-3xl font-black text-white shadow-glow-red">
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-1">{selectedUser.name}</h2>
                                            <p className="text-club-red font-black text-sm uppercase tracking-widest">{selectedUser.plan}</p>
                                            <p className="text-white/30 text-xs mt-2">Membro desde {selectedUser.joinDate}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full bg-white/5 text-white/30 hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Info Panel */}
                                    <div className="md:col-span-2 space-y-8">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="glass-card p-4 space-y-3">
                                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 border-b border-white/5 pb-2 ml-1">Dados de Contato</h4>
                                                <div className="flex items-center gap-3 text-sm text-white/70">
                                                    <Mail className="w-4 h-4 text-club-red" /> {selectedUser.email}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-white/70">
                                                    <Phone className="w-4 h-4 text-club-red" /> (84) 99888-XXXX
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-white/70">
                                                    <MapPin className="w-4 h-4 text-club-red" /> Natal, RN
                                                </div>
                                            </div>
                                            <div className="glass-card p-4">
                                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 ml-1">Status de Saúde</h4>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-white/50">Exame Médico</span>
                                                        <span className="text-emerald-400 font-bold">VÁLIDO</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-white/50">Vencimento</span>
                                                        <span className="text-white/30">12/12/2024</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-white/50">Anamnese Detalhada</span>
                                                        <Button variant="link" size="sm" className="p-0 h-auto text-club-red text-[10px] font-black uppercase tracking-widest">Visualizar</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-card p-6">
                                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Histórico de Pagamentos</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { ref: 'Maio/2024', status: 'Pago', val: 'R$ 150,00', date: '05/05/24' },
                                                    { ref: 'Abril/2024', status: 'Pago', val: 'R$ 150,00', date: '04/04/24' },
                                                    { ref: 'Março/2024', status: 'Atrasado', val: 'R$ 150,00', date: '-' },
                                                ].map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                        <div>
                                                            <p className="text-sm text-white font-bold">{p.ref}</p>
                                                            <p className="text-[10px] text-white/30 uppercase tracking-widest">{p.date}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-white font-black">{p.val}</p>
                                                            <span className={`text-[8px] font-black uppercase tracking-widest ${p.status === 'Pago' ? 'text-emerald-400' : 'text-club-red'}`}>{p.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Panel */}
                                    <div className="space-y-6">
                                        <div className="glass-card p-6 text-center">
                                            <div className="relative w-20 h-20 mx-auto mb-4">
                                                <svg className="w-20 h-20 transform -rotate-90">
                                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * 0.75)} className="text-club-red" />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-sm font-black text-white">75%</span>
                                                </div>
                                            </div>
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Frequência Treinos</h4>
                                            <p className="text-[10px] text-white/20 italic">Últimos 30 dias</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest py-6 gap-3">
                                                <FileText className="w-4 h-4 text-club-gold" /> Emitir Declaração
                                            </Button>
                                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest py-6 gap-3">
                                                <Activity className="w-4 h-4 text-blue-500" /> Consultar Treinos
                                            </Button>
                                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest py-6 gap-3">
                                                <CreditCard className="w-4 h-4 text-emerald-500" /> Gestão de Mensalidade
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
