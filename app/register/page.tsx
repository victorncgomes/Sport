'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao criar conta');
                return;
            }

            // Redirecionar para login com mensagem de sucesso
            router.push('/login?registered=true');

        } catch (error) {
            console.error('Register error:', error);
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
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
                        Criar Conta
                    </h1>
                    <p className="text-white/50">Junte-se ao Sport Club de Natal</p>
                </div>

                {/* Register Form */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 p-8 mb-6"
                >
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-2">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-2">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                                disabled={loading}
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
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 pr-12 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                                    disabled={loading}
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-2">Confirmar Senha</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Digite a senha novamente"
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors placeholder:text-white/30"
                                disabled={loading}
                            />
                        </div>

                        {/* Register Button */}
                        <Button
                            type="submit"
                            className="w-full bg-club-red hover:bg-club-red-700 text-white font-bold py-3 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </Button>
                    </form>
                </motion.div>

                {/* Back to Login */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Link href="/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o login
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
