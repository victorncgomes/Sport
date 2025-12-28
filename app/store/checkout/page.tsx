'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    QrCode,
    Truck,
    Shield,
    ArrowRight,
    Tag,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock cart data - in production this would come from a store (Zustand/Context)
const mockCartItems = [
    { id: '1', name: 'Camisa Oficial 2025', price: 120.00, quantity: 2, image: '/placeholder.jpg', size: 'M' },
    { id: '2', name: 'Boné SCN Tático', price: 60.00, quantity: 1, image: '/placeholder.jpg', size: 'Único' },
    { id: '3', name: 'Squeeze Térmico 750ml', price: 45.00, quantity: 1, image: '/placeholder.jpg', size: 'Único' },
];

export default function CheckoutPage() {
    const [items, setItems] = useState(mockCartItems);
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 15.00;
    const total = subtotal - discount + shipping;

    const updateQuantity = (id: string, delta: number) => {
        setItems(items.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const applyCoupon = () => {
        if (coupon.toUpperCase() === 'SCN10') {
            setDiscount(subtotal * 0.1);
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Finalizar Compra"
                subtitle="Checkout Seguro"
                description="Revise seus itens e escolha a forma de pagamento."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatedCard variant="carbon" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-club-red" />
                                    Itens do Carrinho
                                </h2>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShoppingBag className="w-10 h-10 text-white/20" />
                                    </div>
                                    <p className="text-white/40 mb-6">Seu carrinho está vazio</p>
                                    <Link href="/store">
                                        <Button className="bg-club-red hover:bg-club-red-700">
                                            Voltar para a Loja
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                            <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                <ShoppingBag className="w-8 h-8 text-white/20" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="text-white font-bold">{item.name}</h4>
                                                        <p className="text-[10px] text-white/30 uppercase font-bold">Tamanho: {item.size}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 rounded-lg text-white/20 hover:text-club-red hover:bg-club-red/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center text-white font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-club-gold font-black text-lg">
                                                        R$ {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AnimatedCard>

                        {/* Coupon */}
                        <AnimatedCard variant="glass" className="p-6">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Código de desconto"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:border-club-gold/50 outline-none"
                                    />
                                </div>
                                <Button
                                    onClick={applyCoupon}
                                    variant="outline"
                                    className="border-club-gold/30 text-club-gold hover:bg-club-gold/10 px-8"
                                >
                                    Aplicar
                                </Button>
                            </div>
                            {discount > 0 && (
                                <p className="text-emerald-400 text-sm mt-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Cupom aplicado! Desconto de R$ {discount.toFixed(2)}
                                </p>
                            )}
                            <p className="text-white/20 text-[10px] mt-2">Use SCN10 para 10% de desconto</p>
                        </AnimatedCard>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <AnimatedCard variant="metal" className="p-8">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">Resumo do Pedido</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Subtotal</span>
                                    <span className="text-white font-bold">R$ {subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400">Desconto</span>
                                        <span className="text-emerald-400 font-bold">- R$ {discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> Frete
                                    </span>
                                    <span className={cn("font-bold", shipping === 0 ? "text-emerald-400" : "text-white")}>
                                        {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-white font-black uppercase tracking-tight">Total</span>
                                <span className="text-2xl font-black text-club-gold">R$ {total.toFixed(2)}</span>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4 mb-8">
                                <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Forma de Pagamento</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('pix')}
                                        className={cn(
                                            "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                            paymentMethod === 'pix'
                                                ? "border-club-gold bg-club-gold/10 text-club-gold"
                                                : "border-white/10 text-white/40 hover:border-white/20"
                                        )}
                                    >
                                        <QrCode className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">PIX</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={cn(
                                            "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                            paymentMethod === 'card'
                                                ? "border-club-gold bg-club-gold/10 text-club-gold"
                                                : "border-white/10 text-white/40 hover:border-white/20"
                                        )}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cartão</span>
                                    </button>
                                </div>
                            </div>

                            {paymentMethod === 'pix' && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-6 text-center">
                                    <div className="w-32 h-32 bg-white mx-auto rounded-xl mb-4 flex items-center justify-center">
                                        <QrCode className="w-20 h-20 text-club-black" />
                                    </div>
                                    <p className="text-white/40 text-xs mb-2">Escaneie o código ou copie a chave</p>
                                    <div className="flex items-center gap-2 text-[10px] text-club-gold justify-center">
                                        <Clock className="w-3 h-3" /> Válido por 30 minutos
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full h-14 bg-club-red hover:bg-club-red-700 text-xs font-black uppercase tracking-[0.2em] shadow-glow-red"
                                disabled={items.length === 0}
                            >
                                {paymentMethod === 'pix' ? 'Copiar Código PIX' : 'Pagar com Cartão'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-white/20 text-[10px]">
                                <Shield className="w-3 h-3" />
                                <span>Pagamento 100% seguro</span>
                            </div>
                        </AnimatedCard>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                            <Truck className="w-6 h-6 text-emerald-400 shrink-0" />
                            <div>
                                <p className="text-emerald-400 text-sm font-bold">Frete Grátis</p>
                                <p className="text-white/30 text-[10px]">Em compras acima de R$ 200,00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
