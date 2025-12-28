'use client';

import React, { useState } from 'react';
import { StoreHeader } from '@/components/store/store-header';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { ProductCard } from '@/components/store/product-card';
import { storeProducts, Product, ProductCategory } from '@/lib/data/store-products';
import { ShoppingBag, Shirt, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type StoreSection = 'produtos' | 'cantina';

export default function StoreContent() {
    const [section, setSection] = useState<StoreSection>('produtos');
    const [category, setCategory] = useState<ProductCategory | 'all'>('all');

    // Filtra produtos baseado na seção
    const sectionProducts = section === 'produtos'
        ? storeProducts.filter(p => p.category === 'vestuario' || p.category === 'acessorios')
        : storeProducts.filter(p => p.category === 'bar' || p.category === 'lanchonete');

    // Aplica filtro de categoria adicional
    const filteredProducts = category === 'all'
        ? sectionProducts
        : sectionProducts.filter(p => p.category === category);

    // Categorias disponíveis para cada seção
    const produtosCategorias = [
        { id: 'all' as const, label: 'Todos' },
        { id: 'vestuario' as const, label: 'Vestuário' },
        { id: 'acessorios' as const, label: 'Acessórios' },
    ];

    const cantinaCategorias = [
        { id: 'all' as const, label: 'Todos' },
        { id: 'lanchonete' as const, label: 'Lanches' },
        { id: 'bar' as const, label: 'Bebidas' },
    ];

    const currentCategorias = section === 'produtos' ? produtosCategorias : cantinaCategorias;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-club-black pb-24">
            {/* Header com espaçamento para nav fixa */}
            <div className="h-14 md:h-16" />

            {/* Cart Drawer */}
            <CartSidebar />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Hero Banner */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-club-red/20 via-club-black to-club-red/10 border border-white/5 p-6 md:p-10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            Store <span className="text-club-gold">SCN</span>
                        </h1>
                        <p className="text-white/60 max-w-xl text-sm md:text-base">
                            Vista a camisa do maior clube do RN ou recarregue as energias na cantina.
                        </p>
                    </div>
                </div>

                {/* Toggle Produtos / Cantina */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
                        <button
                            onClick={() => { setSection('produtos'); setCategory('all'); }}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all",
                                section === 'produtos'
                                    ? "bg-club-red text-white shadow-lg"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Shirt className="w-4 h-4" />
                            Produtos
                        </button>
                        <button
                            onClick={() => { setSection('cantina'); setCategory('all'); }}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all",
                                section === 'cantina'
                                    ? "bg-club-gold text-black shadow-lg"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Coffee className="w-4 h-4" />
                            Cantina
                        </button>
                    </div>
                </div>

                {/* Filtro de categorias */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {currentCategorias.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                                category === cat.id
                                    ? section === 'produtos'
                                        ? "bg-club-red/20 border-club-red text-club-red"
                                        : "bg-club-gold/20 border-club-gold text-club-gold"
                                    : "bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-club-red/20 flex items-center justify-center">
                                    <ShoppingBag className="w-10 h-10 text-club-red" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
                                <p className="text-white/50">Tente mudar a categoria.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
