'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Activity,
    Award,
    Edit,
    Anchor,
    Heart,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dados simulados de sócio
const mockMember = {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(84) 99999-1234',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    address: 'Rua das Flores, 123 - Tirol, Natal/RN',
    memberSince: '2022-03-10',
    status: 'ACTIVE',
    category: 'Atleta',
    plan: 'Mensal',
    avatar: 'JS',
    stats: {
        totalTrainings: 156,
        totalDistance: 482.5,
        avgSessionTime: 65,
        currentStreak: 12
    },
    payments: [
        { id: '1', date: '2024-12-01', value: 250, status: 'PAID', method: 'PIX' },
        { id: '2', date: '2024-11-01', value: 250, status: 'PAID', method: 'Cartão' },
        { id: '3', date: '2024-10-01', value: 250, status: 'PAID', method: 'PIX' },
    ],
    recentTrainings: [
        { id: '1', date: '2024-12-28', type: 'Remo Outdoor', duration: 72, distance: 8.5 },
        { id: '2', date: '2024-12-26', type: 'Remo Indoor', duration: 45, distance: 6.2 },
        { id: '3', date: '2024-12-24', type: 'Musculação', duration: 60, distance: 0 },
    ],
    boats: ['Potengi I', 'Natal'],
    emergencyContact: {
        name: 'Maria Silva',
        phone: '(84) 99888-5678',
        relation: 'Esposa'
    }
};

export default function MemberDetailPage() {
    const params = useParams();
    const [member] = useState(mockMember);

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria/socios" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar à Lista de Sócios
                    </Link>
                </div>

                {/* Perfil Principal */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Coluna Esquerda - Info Principal */}
                    <AnimatedCard variant="gradient" className="p-6 lg:col-span-1">
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-club-red/30 flex items-center justify-center mx-auto mb-4 text-3xl font-black text-club-red">
                                {member.avatar}
                            </div>
                            <h1 className="text-xl font-bold text-white">{member.name}</h1>
                            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/50">
                                {member.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-white/40" />
                                <span className="text-white/70">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-white/40" />
                                <span className="text-white/70">{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-white/40" />
                                <span className="text-white/70">{member.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-white/40" />
                                <span className="text-white/70">
                                    Sócio desde {new Date(member.memberSince).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/40 text-xs">Categoria</span>
                                <Badge className="bg-club-red/20 text-club-red">{member.category}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/40 text-xs">Plano</span>
                                <span className="text-white text-sm font-medium">{member.plan}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-6 bg-white/10 hover:bg-white/20">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Cadastro
                        </Button>
                    </AnimatedCard>

                    {/* Coluna Direita - Detalhes */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <AnimatedCard variant="glass" className="p-4 text-center">
                                <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{member.stats.totalTrainings}</div>
                                <div className="text-xs text-white/40">Treinos</div>
                            </AnimatedCard>
                            <AnimatedCard variant="glass" className="p-4 text-center">
                                <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{member.stats.totalDistance}km</div>
                                <div className="text-xs text-white/40">Total Remado</div>
                            </AnimatedCard>
                            <AnimatedCard variant="glass" className="p-4 text-center">
                                <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{member.stats.avgSessionTime}min</div>
                                <div className="text-xs text-white/40">Média/Sessão</div>
                            </AnimatedCard>
                            <AnimatedCard variant="glass" className="p-4 text-center">
                                <Award className="w-6 h-6 text-club-gold mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{member.stats.currentStreak}</div>
                                <div className="text-xs text-white/40">Sequência</div>
                            </AnimatedCard>
                        </div>

                        {/* Treinos Recentes */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Treinos Recentes
                            </h3>
                            <div className="space-y-3">
                                {member.recentTrainings.map(training => (
                                    <div key={training.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <div className="font-medium text-white">{training.type}</div>
                                            <div className="text-xs text-white/40">
                                                {new Date(training.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-white">{training.duration}min</div>
                                            {training.distance > 0 && (
                                                <div className="text-xs text-blue-400">{training.distance}km</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        {/* Pagamentos */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-400" />
                                Histórico de Pagamentos
                            </h3>
                            <div className="space-y-3">
                                {member.payments.map(payment => (
                                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <div className="font-medium text-white">
                                                {new Date(payment.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-white/40">{payment.method}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-emerald-400">
                                                R$ {payment.value.toFixed(2)}
                                            </div>
                                            <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                                                {payment.status === 'PAID' ? 'Pago' : 'Pendente'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        {/* Barcos Habilitados */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Anchor className="w-5 h-5 text-club-gold" />
                                Barcos Habilitados
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {member.boats.map((boat, i) => (
                                    <Badge key={i} className="bg-club-gold/20 text-club-gold border-club-gold/50 px-4 py-2">
                                        {boat}
                                    </Badge>
                                ))}
                            </div>
                        </AnimatedCard>

                        {/* Contato de Emergência */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-red-400" />
                                Contato de Emergência
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-white/40 text-xs mb-1">Nome</div>
                                    <div className="text-white">{member.emergencyContact.name}</div>
                                </div>
                                <div>
                                    <div className="text-white/40 text-xs mb-1">Telefone</div>
                                    <div className="text-white">{member.emergencyContact.phone}</div>
                                </div>
                                <div>
                                    <div className="text-white/40 text-xs mb-1">Parentesco</div>
                                    <div className="text-white">{member.emergencyContact.relation}</div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
