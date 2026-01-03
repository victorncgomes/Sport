'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchResult {
    query: string;
    totalResults: number;
    results: {
        news: Array<{ id: string; title: string; content: string; date: string; category: string }>;
        events: Array<{ id: string; title: string; description: string; date: string; location: string }>;
        members: Array<{ id: string; name: string; role: string; category: string; level: string }>;
        boats: Array<{ id: string; name: string; type: string; status: string; condition: string }>;
    };
}

export function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        setLoading(true);

        // Debounce de 300ms
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                }
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    const handleClose = () => {
        setIsOpen(false);
        setQuery('');
        setResults(null);
    };

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Buscar"
            >
                <Search className="w-5 h-5 text-white" />
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50"
                            onClick={handleClose}
                        />

                        {/* Search Panel - Fixed for mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="fixed inset-x-0 top-0 bottom-0 z-50 flex flex-col p-4 pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,16px)]"
                        >
                            <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden mt-4 mb-4 max-h-[calc(100vh-120px)]">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 p-4 border-b border-white/10 flex-shrink-0">
                                    <Search className="w-5 h-5 text-white/60" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Buscar notícias, eventos, membros..."
                                        className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base"
                                    />
                                    {loading && <Loader2 className="w-5 h-5 text-white/60 animate-spin" />}
                                    <button
                                        onClick={handleClose}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white/60" />
                                    </button>
                                </div>

                                {/* Results - Scrollable */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-white/10">
                                    {!results && query.length < 2 && (
                                        <p className="text-white/40 text-sm text-center py-8">
                                            Digite pelo menos 2 caracteres para buscar
                                        </p>
                                    )}

                                    {results && results.totalResults === 0 && (
                                        <p className="text-white/40 text-sm text-center py-8">
                                            Nenhum resultado encontrado para "{query}"
                                        </p>
                                    )}

                                    {results && results.totalResults > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-white/60 text-sm">
                                                {results.totalResults} resultado{results.totalResults > 1 ? 's' : ''} encontrado{results.totalResults > 1 ? 's' : ''}
                                            </p>

                                            {/* News */}
                                            {results.results.news.length > 0 && (
                                                <div>
                                                    <h3 className="text-white font-bold text-sm mb-2">Notícias</h3>
                                                    <div className="space-y-2">
                                                        {results.results.news.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/news/${item.id}`}
                                                                onClick={handleClose}
                                                                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                            >
                                                                <p className="text-white font-semibold text-sm">{item.title}</p>
                                                                <p className="text-white/60 text-xs mt-1 line-clamp-1">{item.content}</p>
                                                                <p className="text-white/40 text-xs mt-1">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Events */}
                                            {results.results.events.length > 0 && (
                                                <div>
                                                    <h3 className="text-white font-bold text-sm mb-2">Eventos</h3>
                                                    <div className="space-y-2">
                                                        {results.results.events.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/events/${item.id}`}
                                                                onClick={handleClose}
                                                                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                            >
                                                                <p className="text-white font-semibold text-sm">{item.title}</p>
                                                                <p className="text-white/60 text-xs mt-1">{item.description}</p>
                                                                <p className="text-white/40 text-xs mt-1">
                                                                    {new Date(item.date).toLocaleDateString('pt-BR')} • {item.location}
                                                                </p>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Members */}
                                            {results.results.members.length > 0 && (
                                                <div>
                                                    <h3 className="text-white font-bold text-sm mb-2">Membros</h3>
                                                    <div className="space-y-2">
                                                        {results.results.members.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="p-3 rounded-lg bg-white/5"
                                                            >
                                                                <p className="text-white font-semibold text-sm">{item.name}</p>
                                                                <p className="text-white/60 text-xs mt-1">
                                                                    {item.role} • {item.category} • {item.level}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Boats */}
                                            {results.results.boats.length > 0 && (
                                                <div>
                                                    <h3 className="text-white font-bold text-sm mb-2">Barcos</h3>
                                                    <div className="space-y-2">
                                                        {results.results.boats.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href="/garage"
                                                                onClick={handleClose}
                                                                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                            >
                                                                <p className="text-white font-semibold text-sm">{item.name}</p>
                                                                <p className="text-white/60 text-xs mt-1">
                                                                    {item.type} • {item.status} • {item.condition}
                                                                </p>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
