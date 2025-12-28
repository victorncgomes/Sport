'use client';

import React from 'react';
import { useCart } from './cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { ProductCategory } from '@/lib/data/store-products';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StoreHeaderProps {
    selectedCategory: ProductCategory | 'all';
    onSelectCategory: (category: ProductCategory | 'all') => void;
}

export function StoreHeader({ selectedCategory, onSelectCategory }: StoreHeaderProps) {
    const { setIsOpen, itemsCount } = useCart();

    const categories: { id: ProductCategory | 'all', label: string }[] = [
        { id: 'all', label: 'Tudo' },
        { id: 'vestuario', label: 'Vestuário' },
        { id: 'acessorios', label: 'Acessórios' },
        { id: 'bar', label: 'Bar' },
        { id: 'lanchonete', label: 'Lanchonete' },
    ];

    return (
        <div className="sticky top-0 z-40 bg-club-black/80 backdrop-blur-xl border-b border-white/10 pb-4">
            <div className="container mx-auto px-4 pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    {/* Search Bar - Placeholder */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-club-gold/50 transition-colors"
                        />
                    </div>

                    {/* Cart Button */}
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="relative bg-club-gold hover:bg-club-gold-light text-black font-bold rounded-full group"
                    >
                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Minha Cesta
                        {itemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-club-red text-white text-xs flex items-center justify-center rounded-full border-2 border-black animate-bounce">
                                {itemsCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Categories Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <Filter className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                selectedCategory === cat.id
                                    ? "bg-white/10 border-club-gold text-club-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                                    : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
