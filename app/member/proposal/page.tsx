'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, User, Mail, Phone, MapPin, Calendar, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberProposalPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        dataNascimento: '',
        profissao: '',
        motivacao: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simular envio
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500/20 flex items-center justify-center">
                        <Send className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Proposta Enviada!</h1>
                    <p className="text-white/50 mb-8">
                        Recebemos sua proposta de associação. Nossa diretoria irá analisar e entraremos em contato em breve.
                    </p>
                    <Link href="/">
                        <Button className="bg-club-red hover:bg-club-red-700">
                            Voltar ao Início
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black px-4 py-20">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-club-red/20 blur-[150px]" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Back Button */}
                <Link href="/login" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Voltar ao Login</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Proposta de <span className="text-club-red">Associação</span>
                    </h1>
                    <p className="text-white/50">Preencha o formulário abaixo e faça parte da nossa família</p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white/5 border border-white/10 p-8"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <User className="w-4 h-4" /> Nome Completo
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <Mail className="w-4 h-4" /> E-mail
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <Phone className="w-4 h-4" /> Telefone
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <Calendar className="w-4 h-4" /> Data de Nascimento
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dataNascimento}
                                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Profissão */}
                        <div>
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <Anchor className="w-4 h-4" /> Profissão
                            </label>
                            <input
                                type="text"
                                value={formData.profissao}
                                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Endereço */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                <MapPin className="w-4 h-4" /> Endereço Completo
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.endereco}
                                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors"
                            />
                        </div>

                        {/* Motivação */}
                        <div className="md:col-span-2">
                            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">
                                Por que deseja fazer parte do Sport Club de Natal?
                            </label>
                            <textarea
                                rows={4}
                                value={formData.motivacao}
                                onChange={(e) => setFormData({ ...formData, motivacao: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-club-red transition-colors resize-none"
                                placeholder="Conte-nos um pouco sobre você e seu interesse pelo remo..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button type="submit" className="flex-1 bg-club-red hover:bg-club-red-700 text-white font-bold py-3">
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Proposta
                        </Button>
                        <Link href="/login">
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                Cancelar
                            </Button>
                        </Link>
                    </div>
                </motion.form>

                {/* Info */}
                <p className="text-center text-white/30 text-xs mt-8">
                    Após o envio, nossa diretoria analisará sua proposta. O processo pode levar até 7 dias úteis.
                </p>
            </div>
        </div>
    );
}
