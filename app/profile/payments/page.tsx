'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        try {
            const response = await fetch('/api/profile/payments');
            const data = await response.json();
            setPayments(data.payments || []);
            setPendingPayments(data.pending || []);
        } catch (error) {
            console.error('Error loading payments:', error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'OVERDUE': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return 'Pago';
            case 'PENDING': return 'Pendente';
            case 'OVERDUE': return 'Atrasado';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <p className="text-white/60">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Pagamentos"
                subtitle="Gerencie suas mensalidades e pagamentos"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Mensalidades Pendentes */}
                {pendingPayments.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            Mensalidades Pendentes
                        </h3>
                        {pendingPayments.map((payment) => (
                            <AnimatedCard key={payment.id} variant="glass" className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-white font-bold">{payment.description}</h4>
                                        <p className="text-white/60 text-sm">
                                            Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(payment.status)}`}>
                                        {getStatusLabel(payment.status)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-white">
                                        R$ {payment.amount.toFixed(2)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            PIX
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-club-red hover:bg-club-red/90 gap-2"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            Pagar
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                )}

                {/* Histórico de Pagamentos */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-club-red" />
                        Histórico de Pagamentos
                    </h3>
                    {payments.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">Nenhum pagamento registrado</p>
                        </AnimatedCard>
                    ) : (
                        payments.map((payment) => (
                            <AnimatedCard key={payment.id} variant="glass" className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'PAID' ? 'bg-green-500/20' : 'bg-white/10'
                                            }`}>
                                            {payment.status === 'PAID' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-white/40" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{payment.description}</h4>
                                            <p className="text-white/60 text-sm">
                                                {new Date(payment.paidAt || payment.dueDate).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">
                                            R$ {payment.amount.toFixed(2)}
                                        </div>
                                        <div className={`text-xs ${payment.status === 'PAID' ? 'text-green-400' : 'text-white/40'
                                            }`}>
                                            {getStatusLabel(payment.status)}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))
                    )}
                </div>

                {/* Métodos de Pagamento */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4">Métodos de Pagamento</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-club-red" />
                                <span className="text-white">PIX</span>
                            </div>
                            <span className="text-white/60 text-sm">Instantâneo</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-club-red" />
                                <span className="text-white">Mercado Pago</span>
                            </div>
                            <span className="text-white/60 text-sm">Cartão ou Boleto</span>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
}
