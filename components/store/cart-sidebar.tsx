'use client';

import React from 'react';
import { useCart } from './cart-context';
import { Button } from '@/components/ui/button';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';

export function CartSidebar() {
    const { isOpen, setIsOpen, items, removeFromCart, updateQuantity, total, clearCart } = useCart();

    // Prevent body scroll when cart is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleCheckout = () => {
        alert('Checkout simulado! Pedido enviado para a Garagem/Bar.');
        clearCart();
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-club-gold" />
                                Seu Carrinho
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <ShoppingBag className="w-16 h-16 text-white/20" />
                                    <p className="text-white/60">Seu carrinho está vazio.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="mt-4"
                                    >
                                        Explorar Loja
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <AnimatedCard key={item.id} variant="metal" className="flex gap-4 p-3 items-center">
                                        <div className="w-16 h-16 rounded bg-black/50 flex items-center justify-center flex-shrink-0">
                                            {/* Placeholder image */}
                                            <ShoppingBag className="w-6 h-6 text-white/20" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate">{item.name}</h4>
                                            <p className="text-club-gold text-sm font-bold">
                                                R$ {item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:text-club-red transition-colors text-white/50"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-mono text-white w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:text-green-400 transition-colors text-white/50"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-white/30 hover:text-club-red transition-colors text-xs flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" /> Remover
                                            </button>
                                        </div>
                                    </AnimatedCard>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                                <div className="space-y-2 text-sm text-white/60">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>R$ {total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxa de Serviço</span>
                                        <span>R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="text-club-gold">R$ {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-club-gold hover:bg-club-gold-light text-black font-bold h-12 text-lg shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                                    onClick={handleCheckout}
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Finalizar Pedido
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
