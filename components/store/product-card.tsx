'use client';

import React from 'react';
import { Product } from '@/lib/data/store-products';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Plus, Check, ShoppingCart } from 'lucide-react';
import { useCart } from './cart-context';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, items } = useCart();
    const [showZoom, setShowZoom] = React.useState(false);
    const [isAdded, setIsAdded] = React.useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <>
            <AnimatedCard
                variant="metal"
                hover="lift"
                className="flex flex-col h-full group overflow-hidden cursor-pointer"
                onClick={() => setShowZoom(true)}
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-black rounded-lg mb-4">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.isNew && (
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black bg-club-gold rounded">
                                Novo
                            </span>
                        )}
                        {product.isPopular && (
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-club-red rounded">
                                Popular
                            </span>
                        )}
                    </div>

                    {/* Store Image */}
                    <div className="w-full h-full flex items-center justify-center bg-white/5 group-hover:scale-105 transition-transform duration-500">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white/20">
                                <ShoppingCart className="w-16 h-16" />
                            </div>
                        )}
                    </div>

                    {/* Overlay on hover - Agora apenas com botão de adicionar */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                            onClick={handleAddToCart}
                            className="bg-club-gold hover:bg-club-gold-light text-black font-bold rounded-full scale-90 group-hover:scale-100 transition-transform"
                        >
                            Adicionar
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                            <p className="text-xs text-club-gold/80 uppercase tracking-widest font-bold mb-1">
                                {product.category}
                            </p>
                            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-club-gold transition-colors">
                                {product.name}
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm text-white/50 line-clamp-2 mb-4 flex-1">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className="text-xl font-bold text-white">
                            R$ {product.price.toFixed(2)}
                        </span>

                        <Button
                            size="sm"
                            variant={isAdded ? "default" : "outline"}
                            className={cn(
                                "transition-all duration-300",
                                isAdded
                                    ? "bg-green-500 hover:bg-green-600 border-transparent text-white w-10 px-0"
                                    : "border-white/20 hover:bg-white/10 text-club-gold"
                            )}
                            onClick={handleAddToCart}
                        >
                            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </AnimatedCard>

            {/* Modal de Detalhes do Produto */}
            {showZoom && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto"
                    onClick={() => setShowZoom(false)}
                >
                    <div
                        className="relative max-w-5xl w-full bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowZoom(false)}
                            className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white bg-black/50 hover:bg-club-red/50 rounded-full transition-all"
                        >
                            <Plus className="w-6 h-6 rotate-45" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Imagem do Produto */}
                            <div className="relative aspect-square md:aspect-auto md:h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl"
                                    />
                                ) : (
                                    <div className="text-white/20">
                                        <ShoppingCart className="w-32 h-32" />
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.isNew && (
                                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-black bg-club-gold rounded-full">
                                            Novo
                                        </span>
                                    )}
                                    {product.isPopular && (
                                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-club-red rounded-full">
                                            Popular
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Informações do Produto */}
                            <div className="p-8 flex flex-col">
                                {/* Categoria */}
                                <p className="text-xs text-club-gold uppercase tracking-[0.2em] font-bold mb-2">
                                    {product.category}
                                </p>

                                {/* Nome */}
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
                                    {product.name}
                                </h2>

                                {/* Preço */}
                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-4xl font-black text-club-gold">
                                        R$ {product.price.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-white/40">
                                        ou 3x de R$ {(product.price / 3).toFixed(2)}
                                    </span>
                                </div>

                                {/* Descrição Completa */}
                                <div className="mb-6">
                                    <h3 className="text-xs text-white/50 uppercase tracking-widest font-bold mb-2">
                                        Descrição
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Tamanhos (para vestuário) */}
                                {(product.category === 'vestuario') && (
                                    <div className="mb-6">
                                        <h3 className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">
                                            Tamanhos Disponíveis
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {['PP', 'P', 'M', 'G', 'GG', 'XG'].map((size) => (
                                                <button
                                                    key={size}
                                                    className="w-12 h-12 rounded-lg border border-white/20 text-white/70 hover:border-club-gold hover:text-club-gold font-bold transition-all hover:bg-club-gold/10"
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Especificações */}
                                <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">
                                        Especificações
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">SKU</span>
                                            <span className="text-white font-medium">SCN-{product.id.toString().padStart(4, '0')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Disponibilidade</span>
                                            <span className="text-emerald-400 font-medium">Em Estoque</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Categoria</span>
                                            <span className="text-white font-medium capitalize">{product.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Entrega</span>
                                            <span className="text-white font-medium">3-5 dias</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-3 mt-auto">
                                    <Button
                                        onClick={(e) => {
                                            handleAddToCart(e as any);
                                        }}
                                        className="flex-1 bg-club-red hover:bg-club-red-dark text-white h-14 rounded-xl font-bold uppercase tracking-wider text-sm"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Adicionar ao Carrinho
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-14 px-6 rounded-xl border-white/20 hover:bg-white/5 text-white"
                                        onClick={() => setShowZoom(false)}
                                    >
                                        Voltar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
