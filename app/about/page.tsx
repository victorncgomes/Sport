'use client';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Ship, Users, Calendar, ArrowRight, Sparkles, Flag, Heart, Target, Crown, Quote, ChevronDown, ChevronUp, Mail, Phone, MapPin, MessageSquare, Send, Clock, Instagram, Facebook, Youtube } from 'lucide-react';
import React, { useState } from 'react';

// ... (previous constants)

const AppDetailsSection = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
                    Tecnologia & Inovação
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Sobre o <span className="text-blue-500">Aplicativo</span>
                </h2>
            </div>

            <AnimatedCard
                variant="carbon"
                className="cursor-pointer overflow-hidden relative group"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Visual Header (Always Visible) */}
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Sistema de Gestão Digital</h3>
                            <p className="text-blue-400 font-bold text-sm mt-1">Clique para ver detalhes</p>
                        </div>
                    </div>
                    <div>
                        {isOpen ? <ChevronUp className="text-white w-6 h-6" /> : <ChevronDown className="text-white w-6 h-6" />}
                    </div>
                </div>

                {/* Expandable Content */}
                {isOpen && (
                    <div className="p-8 pt-0 border-t border-white/10 mt-2 animate-slide-up">
                        <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
                            <div>
                                <p className="text-white/60 text-sm leading-relaxed mb-6">
                                    O Sport Club de Natal entra em uma nova era com seu sistema de gestão integrado. Desenvolvido para facilitar a vida do sócio e otimizar processos internos, o aplicativo reúne desde reservas de barcos até o acompanhamento de performance dos atletas.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        Reserva de barcos e equipamentos
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        Acompanhamento de treinos com GPS
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        Sistema de gamificação e conquistas
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-club-gold" />
                                        Portal de voluntariado
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Versão Atual</h4>
                                <div className="space-y-4">
                                    <div className="relative pl-6 border-l border-blue-500/30">
                                        <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-club-black" />
                                        <div className="text-sm font-bold text-blue-400 mb-1">V0.4.7</div>
                                        <p className="text-xs text-white/70">Sistema de Votações, Gestão de Sócios avançada, Voluntariado expandido.</p>
                                    </div>
                                    <div className="relative pl-6 border-l border-blue-500/30">
                                        <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-blue-500/50 border-2 border-club-black" />
                                        <div className="text-[10px] font-bold text-white/30 mb-1">V0.4.6</div>
                                        <p className="text-xs text-white/50">Imagens de notícias e galeria, Tide Widget aprimorado.</p>
                                    </div>
                                    <div className="relative pl-6 border-l border-blue-500/30">
                                        <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-blue-500/30 border-2 border-club-black" />
                                        <div className="text-[10px] font-bold text-white/20 mb-1">V0.4.5</div>
                                        <p className="text-xs text-white/40">Módulo Coach, Alongamento, Fichas de Sócio.</p>
                                    </div>
                                </div>
                                <Link href="/docs" onClick={(e) => e.stopPropagation()} className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    Ver documentação completa <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatedCard>
        </section>
    );
};

const milestones = [
    { year: '1915', title: 'Fundação', description: 'Criação oficial do Sport Club de Natal às margens do Rio Potengi' },
    { year: '1950', title: 'Primeira Competição Nacional', description: 'Participação no Campeonato Brasileiro de Remo' },
    { year: '1982', title: 'Sede Própria', description: 'Inauguração da sede definitiva com garagem de barcos' },
    { year: '2015', title: 'Centenário', description: 'Celebração dos 100 anos com regata comemorativa' },
    { year: '2025', title: 'Modernização', description: 'Renovação da frota e implementação de sistema digital' },
];

const values = [
    { icon: Trophy, title: 'Excelência', description: 'Busca constante pela melhoria e superação, dentro e fora da água' },
    { icon: Heart, title: 'Comunidade', description: 'Família unida pela paixão pelo remo e respeito mútuo' },
    { icon: Flag, title: 'Tradição', description: '110 anos de história que inspiram o futuro do esporte' },
];

// Galeria de Presidentes Históricos
const presidents = [
    { name: 'João da Silva', period: '1915-1920', title: 'Fundador' },
    { name: 'Antônio Pereira', period: '1920-1935', title: 'Consolidador' },
    { name: 'Carlos Medeiros', period: '1935-1950', title: 'Expansão' },
    { name: 'Roberto Câmara', period: '1950-1965', title: 'Era das Competições' },
    { name: 'José Augusto', period: '1965-1982', title: 'Sede Própria' },
    { name: 'Fernando Lima', period: '1982-2000', title: 'Modernização' },
    { name: 'Paulo Henriques', period: '2000-2015', title: 'Centenário' },
    { name: 'Ricardo Santos', period: '2015-2024', title: 'Era Digital' },
];

// Diretoria Atual
const currentBoard = {
    president: {
        name: 'Carlos Eduardo Melo',
        role: 'Presidente',
        since: '2024',
        message: 'É uma honra liderar este clube centenário. Nosso compromisso é preservar a tradição enquanto construímos o futuro do remo potiguar. Juntos, remamos mais longe.',
    },
    members: [
        { name: 'Ana Paula Santos', role: 'Vice-Presidente' },
        { name: 'Marcos Oliveira', role: 'Diretor Financeiro' },
        { name: 'Fernanda Costa', role: 'Diretora Técnica' },
        { name: 'Roberto Lima', role: 'Diretor de Patrimônio' },
        { name: 'Juliana Medeiros', role: 'Diretora Social' },
    ]
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Sport Club de Natal"
                subtitle="Desde 25 de Novembro de 1915"
                description="110 anos navegando a história do remo no Rio Grande do Norte"
                compact
            />

            <div className="container mx-auto px-4 py-16">
                {/* História */}
                <section className="max-w-4xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-club-red/20 text-club-red text-sm font-semibold mb-4">
                            Nossa História
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Mais de um século de{' '}
                            <span className="text-club-red">tradição náutica</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                        <AnimatedCard variant="gradient">
                            <div className="aspect-square bg-gradient-to-br from-club-red/20 to-club-black rounded-xl flex items-center justify-center">
                                <Ship className="w-32 h-32 text-club-red/40" />
                            </div>
                        </AnimatedCard>

                        <div className="space-y-4 text-white/70">
                            <p className="text-lg leading-relaxed">
                                Fundado em <strong className="text-club-red">25 de novembro de 1915</strong>, o Sport Club de Natal é um dos clubes de remo mais tradicionais do Nordeste brasileiro.
                            </p>
                            <p className="leading-relaxed">
                                Localizado às margens do <strong className="text-club-gold">Rio Potengi</strong>, nosso clube tem sido berço de campeões e ponto de encontro de apaixonados pelo esporte náutico há mais de um século.
                            </p>
                            <p className="leading-relaxed">
                                Nossa missão é preservar a tradição do remo enquanto formamos novas gerações de atletas, promovendo saúde, disciplina e espírito de equipe.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">
                        Marcos <span className="text-club-gold">Históricos</span>
                    </h2>

                    <div className="space-y-6">
                        {milestones.map((milestone, idx) => (
                            <div key={idx} className="flex gap-4 sm:gap-8 items-start">
                                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-club-red to-club-red-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-glow-red">
                                    {milestone.year}
                                </div>
                                <AnimatedCard className="flex-1" variant="glass">
                                    <h3 className="text-lg font-bold text-white mb-1">{milestone.title}</h3>
                                    <p className="text-sm text-white/50">{milestone.description}</p>
                                </AnimatedCard>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Valores */}
                <section className="max-w-6xl mx-auto mb-20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">
                        Nossos <span className="text-club-red">Valores</span>
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                        {values.map((value, idx) => (
                            <AnimatedCard key={idx} variant="glass" hover>
                                <div className="text-center">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-club-red/20 flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="w-7 h-7 sm:w-8 sm:h-8 text-club-red" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-sm text-white/50">{value.description}</p>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </section>

                {/* Galeria dos Presidentes (Movido para baixo de Valores) */}
                <section className="max-w-6xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-club-gold/20 text-club-gold text-sm font-semibold mb-4">
                            <Crown className="w-4 h-4 inline mr-2" />
                            Galeria de Honra
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Nossos <span className="text-club-gold">Presidentes</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {presidents.map((president, idx) => (
                            <AnimatedCard key={idx} variant="glass" hover>
                                <div className="text-center p-2">
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-club-gold/30 to-club-gold/10 flex items-center justify-center">
                                        <Crown className="w-8 h-8 text-club-gold/50" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white line-clamp-1">{president.name}</h3>
                                    <p className="text-xs text-club-gold">{president.period}</p>
                                    <p className="text-xs text-white/40 mt-1">{president.title}</p>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </section>

                {/* Sobre o Aplicativo (Interativo) */}
                <AppDetailsSection />

                {/* Contato (Migrado de /contact) */}
                <section id="contato" className="max-w-6xl mx-auto py-20 border-t border-white/10">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 rounded-full bg-club-red/20 text-club-red text-sm font-semibold mb-4">
                            Atendimento & Suporte
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-tighter">
                            Fale <span className="text-club-red">Conosco</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <AnimatedCard variant="glass" className="p-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8">Informações</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <MapPin className="w-6 h-6 text-club-red flex-shrink-0" />
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Localização</p>
                                            <p className="text-white font-bold text-sm">R. Chile, 14 - Ribeira, Natal - RN, 59012-250</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Phone className="w-6 h-6 text-club-gold flex-shrink-0" />
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">WhatsApp</p>
                                            <p className="text-white font-bold text-sm">(84) 3202-0000</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">E-mail</p>
                                            <p className="text-white font-bold text-sm">contato@scnatal.com.br</p>
                                        </div>
                                    </div>

                                    {/* Google Maps Embed */}
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">Como Chegar</p>
                                        <div className="rounded-xl overflow-hidden border border-white/10 h-48 w-full bg-white/5">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.319567844086!2d-35.2045582!3d-5.8052278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b2550116892607%3A0x805421526685827c!2sSport%20Club%20de%20Natal!5e0!3m2!1spt-BR!2sbr!4v1704207185072!5m2!1spt-BR!2sbr"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>

                            <div className="flex justify-center gap-4">
                                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-club-red transition-all group">
                                    <Instagram className="w-5 h-5 text-white/40 group-hover:text-white" />
                                </button>
                                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-club-red transition-all group">
                                    <Facebook className="w-5 h-5 text-white/40 group-hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <AnimatedCard variant="glass" className="p-8">
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            placeholder="Seu Nome"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-club-red outline-none transition-all placeholder:text-white/20"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Seu E-mail"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-club-red outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Como podemos ajudar?"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-club-red outline-none transition-all min-h-[120px] placeholder:text-white/20"
                                    />
                                    <Button className="w-full bg-club-red hover:bg-club-red-700 h-14 text-xs font-black uppercase tracking-widest shadow-glow-red gap-2">
                                        Enviar Mensagem <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </AnimatedCard>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-4xl mx-auto text-center mt-20">
                    <div className="glass-card p-12">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-club-gold" />
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Faça Parte da Nossa <span className="text-club-red">História</span>
                        </h2>
                        <Link href="/member/proposal">
                            <Button size="lg" className="bg-club-red hover:bg-club-red-700">
                                Enviar Proposta de Sócio <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
