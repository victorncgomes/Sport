'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    QrCode,
    Wallet,
    Clock,
    CheckCircle2,
    AlertCircle,
    Copy,
    RefreshCw,
    DollarSign,
    Calendar
} from 'lucide-react';

interface Payment {
    id: string;
    description: string;
    amount: number;
    dueDate?: string;
    date?: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PROCESSING' | 'PAGO' | 'PENDENTE';
    type: 'MENSALIDADE' | 'EVENTO' | 'MULTA' | 'TAXA' | 'LOJA';
    method?: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'MERCADOPAGO' | null>(null);
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [pixLoading, setPixLoading] = useState(false);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        try {
            const response = await fetch('/api/payments/history');
            const data = await response.json();
            setPayments(data.history || []);
            setUpcomingPayments(data.upcoming || []);
        } catch (error) {
            console.error('Error loading payments:', error);
        } finally {
            setLoading(false);
        }
    }

    const pendingPayments = upcomingPayments.filter(p => p.status === 'PENDING' || p.status === 'PENDENTE' || p.status === 'OVERDUE');
    const paidPayments = payments.filter(p => p.status === 'PAID' || p.status === 'PAGO');
    const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

    const generatePixCode = async (payment: Payment) => {
        setPixLoading(true);
        // Simula geração de código PIX
        await new Promise(resolve => setTimeout(resolve, 1500));
        const code = `00020126580014br.gov.bcb.pix0136${payment.id}5204000053039865802BR5925SPORT CLUB DE NATAL6009SAO PAULO62070503***6304${payment.amount.toFixed(2).replace('.', '')}`;
        setPixCode(code);
        setPixLoading(false);
    };

    const copyPixCode = () => {
        if (pixCode) {
            navigator.clipboard.writeText(pixCode);
            // Show toast
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-green-400 bg-green-400/10';
            case 'PENDING': return 'text-yellow-400 bg-yellow-400/10';
            case 'OVERDUE': return 'text-red-400 bg-red-400/10';
            case 'PROCESSING': return 'text-blue-400 bg-blue-400/10';
            default: return 'text-white/60 bg-white/10';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID': return 'Pago';
            case 'PENDING': return 'Pendente';
            case 'OVERDUE': return 'Atrasado';
            case 'PROCESSING': return 'Processando';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
                <p className="text-white/60 text-sm mt-1">
                    Gerencie suas mensalidades e pagamentos
                </p>
            </div>

            {/* Resumo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-sm">Total Pendente</p>
                        <p className="text-3xl font-bold text-white">
                            R$ {totalPending.toFixed(2)}
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                            {pendingPayments.length} pagamento(s)
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                </div>
            </motion.div>

            {/* Métodos de Pagamento */}
            {selectedPayment && !paymentMethod && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Pagar: {selectedPayment.description}
                    </h3>
                    <p className="text-2xl font-bold text-white mb-6">
                        R$ {selectedPayment.amount.toFixed(2)}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setPaymentMethod('PIX');
                                generatePixCode(selectedPayment);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center gap-4 transition-colors"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">PIX</p>
                                <p className="text-sm text-white/70">Pagamento instantâneo</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setPaymentMethod('MERCADOPAGO')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center gap-4 transition-colors"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Mercado Pago</p>
                                <p className="text-sm text-white/70">Cartão de crédito/débito</p>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={() => setSelectedPayment(null)}
                        className="w-full mt-4 text-white/60 py-2"
                    >
                        Cancelar
                    </button>
                </motion.div>
            )}

            {/* PIX Payment */}
            {paymentMethod === 'PIX' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
                >
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Pagamento via PIX</h3>
                        <p className="text-2xl font-bold text-white mt-2">
                            R$ {selectedPayment?.amount.toFixed(2)}
                        </p>
                    </div>

                    {pixLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-8 h-8 text-white/60 animate-spin" />
                        </div>
                    ) : pixCode ? (
                        <>
                            {/* QR Code Placeholder */}
                            <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <QrCode className="w-32 h-32 text-gray-800" />
                            </div>

                            {/* PIX Copia e Cola */}
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                                <p className="text-white/60 text-sm mb-2">PIX Copia e Cola</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={pixCode.substring(0, 40) + '...'}
                                        readOnly
                                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                    <button
                                        onClick={copyPixCode}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    <p className="text-yellow-200 text-sm">
                                        Este código expira em 30 minutos
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setPaymentMethod(null);
                                    setSelectedPayment(null);
                                    setPixCode(null);
                                }}
                                className="w-full bg-white/10 text-white py-3 rounded-xl"
                            >
                                Voltar
                            </button>
                        </>
                    ) : null}
                </motion.div>
            )}

            {/* Mercado Pago */}
            {paymentMethod === 'MERCADOPAGO' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
                >
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Mercado Pago</h3>
                        <p className="text-white/60 text-sm mt-2">
                            Você será redirecionado para o checkout seguro
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-blue-200 text-sm">
                            <strong>Valor:</strong> R$ {selectedPayment?.amount.toFixed(2)}
                        </p>
                        <p className="text-blue-200 text-sm mt-1">
                            <strong>Parcele em até 12x</strong> no cartão de crédito
                        </p>
                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mb-3"
                    >
                        Ir para Mercado Pago
                    </button>

                    <button
                        onClick={() => {
                            setPaymentMethod(null);
                            setSelectedPayment(null);
                        }}
                        className="w-full bg-white/10 text-white py-3 rounded-xl"
                    >
                        Voltar
                    </button>
                </motion.div>
            )}

            {/* Lista de Pagamentos Pendentes */}
            {!selectedPayment && (
                <>
                    <h2 className="text-lg font-semibold text-white mb-4">Pendentes</h2>
                    <div className="space-y-3 mb-8">
                        {pendingPayments.length === 0 ? (
                            <div className="text-center text-white/50 py-8">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhum pagamento pendente!</p>
                            </div>
                        ) : (
                            pendingPayments.map(payment => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-white">{payment.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-4 h-4 text-white/50" />
                                                <span className="text-white/50 text-sm">
                                                    Vence: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : 'A definir'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                            {getStatusText(payment.status)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-xl font-bold text-white">
                                            R$ {payment.amount.toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => setSelectedPayment(payment)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Pagar
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Histórico */}
                    <h2 className="text-lg font-semibold text-white mb-4">Histórico</h2>
                    <div className="space-y-3">
                        {paidPayments.map(payment => (
                            <div
                                key={payment.id}
                                className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-white/80">{payment.description}</p>
                                    <p className="text-white/40 text-sm">
                                        {new Date(payment.date || payment.dueDate || '').toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-semibold">R$ {payment.amount.toFixed(2)}</p>
                                    <span className="text-xs text-green-400">✓ Pago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
