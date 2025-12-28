'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function MemberLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Em produção, usar real auth. No modo demo redirecionamos.
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-club-black flex items-center justify-center px-4 py-20">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-club-red/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative w-20 h-20 mx-auto mb-6"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-club-red to-club-red-800 flex items-center justify-center shadow-glow-red">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Portal do <span className="text-club-red">Sócio</span>
                    </h1>
                    <p className="text-white/50">Acesse seus dados e reservas</p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 sm:p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/70">Email ou Matrícula</Label>
                            <Input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="socio@email.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-club-red"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/70">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-club-red pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gap-2 bg-club-red hover:bg-club-red-700 hover:shadow-glow-red"
                        >
                            Entrar no Portal
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-white/30 mb-4">Ainda não é sócio? Entre em contato com a secretaria.</p>
                        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                            ← Voltar para seleção de perfil
                        </Link>
                    </div>
                </motion.div>

                {/* Demo mode */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-white/40 mb-3">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">Modo demonstração</span>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-club-gold hover:text-club-gold-400">
                            Entrar como Sócio (Demonstração)
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
