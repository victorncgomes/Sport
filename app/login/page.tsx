'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, type UserRole } from '@/components/auth-context';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const { setRole } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleDemoLogin = (role: UserRole, path: string) => {
        setRole(role);
        router.push(path);
    };

    return (
        <div className="min-h-screen bg-club-black flex items-center justify-center px-4 py-20">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-club-red/20 blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/2 -translate-x-1/2 w-64 h-64 bg-club-gold/10 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative w-24 h-24 mx-auto mb-6"
                    >
                        <Image src="/SCN.svg" alt="Sport Club de Natal" width={96} height={96} style={{ width: 'auto', height: 'auto' }} className="drop-shadow-2xl" />
                        <div className="absolute inset-0 bg-club-red/20 blur-xl -z-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Bem-vindo ao <span className="text-club-red">Sport Club</span> <span className="text-club-red">de Natal</span>
                    </h1>
                    <p className="text-white/50">Acesse sua conta</p>
                </div>

                {/* Registration Success Message */}
                <AnimatePresence>
                    {registered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-emerald-400 text-sm">Conta criada com sucesso! Faça login para continuar.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 p-8 mb-6"
                >
                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        {/* Email */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-2">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 pr-12 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-club-red text-xs hover:text-club-red-400 transition-colors">
                                Esqueci minha senha
                            </Link>
                        </div>

                        {/* Login Button */}
                        <Button type="submit" className="w-full bg-club-red hover:bg-club-red-700 text-white font-bold py-3 mt-2">
                            Entrar
                        </Button>
                    </form>
                </motion.div>

                {/* Social Login Options */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white/5 border border-white/10 p-6 mb-6"
                >
                    <p className="text-center text-white/30 text-[10px] uppercase tracking-widest font-bold mb-4">
                        Ou entre com
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-3 py-3 bg-black hover:bg-gray-900 text-white font-semibold border border-white/20 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            Apple
                        </button>
                    </div>
                </motion.div>

                {/* Demo Version Access */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 p-6 mb-6"
                >
                    <p className="text-center text-white/30 text-[10px] uppercase tracking-widest font-bold mb-4">
                        Versão de demonstração
                    </p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleDemoLogin('socio', '/profile/panel')}
                            className="w-full py-2 text-white/50 text-sm border border-white/10 hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider font-semibold"
                        >
                            Sócio
                        </button>
                        <button
                            onClick={() => handleDemoLogin('treinador', '/coach/painel')}
                            className="w-full py-2 text-white/50 text-sm border border-white/10 hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider font-semibold"
                        >
                            Treinador
                        </button>
                        <button
                            onClick={() => handleDemoLogin('diretoria', '/diretoria')}
                            className="w-full py-2 text-white/50 text-sm border border-white/10 hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider font-semibold"
                        >
                            Diretoria
                        </button>
                    </div>
                </motion.div>

                {/* Link de Proposta */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mb-6">
                    <p className="text-white/40 text-sm mb-2">Ainda não é associado?</p>
                    <Link href="/about#fale-conosco" className="inline-flex items-center gap-2 text-club-gold font-black uppercase tracking-widest text-[10px] hover:text-club-gold-400 transition-colors">
                        Fale Conosco para Associar-se!
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-club-black flex items-center justify-center"><div className="text-white">Carregando...</div></div>}>
            <LoginContent />
        </Suspense>
    );
}
