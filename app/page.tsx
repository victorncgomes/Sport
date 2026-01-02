'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Trophy,
    Users,
    Ship,
    Calendar
} from 'lucide-react';
import { TideWidget } from '@/components/tide-widget';
import { useState, useEffect } from 'react';
import { allNews, NewsItem } from '@/lib/data/news-data';

// Helper para embaralhar array
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const stats = [
    { value: '110', suffix: '+', label: 'Anos de História' },
    { value: '500', suffix: '+', label: 'Atletas' },
    { value: '50', suffix: '+', label: 'Regatas/Ano' },
    { value: '20', suffix: '+', label: 'Embarcações' },
];

const upcomingEvents = [
    { title: 'Campeonato Brasileiro de Barcos Curtos e Seletiva Nacional', date: '23 Fev a 01 Mar', time: 'São Paulo/SP', type: 'regata' },
    { title: 'Campeonato Brasileiro de Beach Sprint e Seletiva Nacional', date: '08 a 12 Abr', time: 'Natal/RN', type: 'regata' },
    { title: 'Copa Brasil Feminina de Oito-com', date: '20 a 24 Mai', time: 'São Paulo/SP', type: 'regata' },
    { title: 'Copa Sul-Sudeste de Remo', date: '16 a 21 Jun', time: 'Curitiba/PR', type: 'regata' },
    { title: 'Copa Norte-Nordeste de Remo', date: '11 a 16 Ago', time: 'Aracaju/SE', type: 'regata' },
    { title: 'Campeonato Brasileiro de Jovens Talentos', date: '29 Set a 04 Out', time: 'Porto Alegre/RS', type: 'regata' },
    { title: 'Campeonato Brasileiro de Barcos Longos', date: '18 a 25 Out', time: 'Rio de Janeiro/RJ', type: 'regata' },
    { title: 'Campeonato Brasileiro de Remo Master', date: '11 a 15 Nov', time: 'A definir', type: 'regata' },
];

export default function HomePage() {
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
    const [heroNews, setHeroNews] = useState<NewsItem[]>([]);
    const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Inicializar notícias aleatórias apenas no cliente
    useEffect(() => {
        const shuffled = shuffleArray(allNews);
        setHeroNews(shuffled.slice(0, 2)); // 2 para o Hero
        setLatestNews(shuffled.slice(2, 5)); // 3 para a lista abaixo
        setIsLoaded(true);
    }, []);

    const nextSlide = () => {
        if (heroNews.length > 0) {
            setCurrentHeroSlide((prev) => (prev + 1) % heroNews.length);
        }
    };

    const prevSlide = () => {
        if (heroNews.length > 0) {
            setCurrentHeroSlide((prev) => (prev - 1 + heroNews.length) % heroNews.length);
        }
    };

    if (!isLoaded) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Carregando notícias...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-club-black">
            {/* Spacer for fixed header - reduzido para mobile */}
            <div className="h-8 md:h-10" />

            {/* ========== HERO NEWS SECTION (Estilo Flamengo) ========== */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4 py-2 md:py-4">
                    {/* Hero News Grid - 2 colunas no desktop */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {heroNews.map((news, index) => (
                            <motion.article
                                key={news.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer"
                            >
                                <Link href={`/news/${news.id}`} className="block h-full">
                                    <Image
                                        src={news.image || '/placeholder-news.jpg'} // Fallback se imagem for null
                                        alt={news.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                                        <span className="inline-block px-2 py-1 bg-club-red text-white text-xs font-bold uppercase tracking-wider mb-2 rounded">
                                            {news.category}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 md:line-clamp-3 group-hover:text-club-red transition-colors">
                                            {news.title}
                                        </h3>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-club-red/50 transition-all duration-300" />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section >

            {/* ========== LATEST NEWS SECTION ========== */}
            <section className="py-8 md:py-12 bg-gray-900 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-club-red rounded-full" />
                            Últimas Notícias
                        </h2>
                        <Link href="/news" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                            Ver todas <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {latestNews.map((news, index) => (
                            <motion.article
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800 overflow-hidden border border-white/5 hover:border-club-red/30 transition-all group cursor-pointer"
                            >
                                <Link href={`/news/${news.id}`} className="block h-full p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-club-red uppercase tracking-wider">
                                            {news.category}
                                        </span>
                                        <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                                            {news.date ? news.date : new Date(news.publishedAt!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-3 group-hover:text-club-red transition-colors">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-4">
                                        {news.excerpt}
                                    </p>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section >


            {/* ========== STATS SECTION ========== */}
            < section className="py-8 px-4" >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="p-4 md:p-6 bg-white/5 border border-white/10 text-center"
                            >
                                <div className="text-2xl md:text-3xl font-black text-white">
                                    {stat.value}
                                    <span className="text-club-red">{stat.suffix}</span>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section >

            {/* ========== TIDE WIDGET + EVENTS ========== */}
            < section className="py-8 px-4" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Tide Widget */}
                        <TideWidget className="w-full" />

                        {/* Upcoming Events */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-club-gold" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                                        Próximos Eventos
                                    </span>
                                </div>
                                <Link href="/events" className="text-[10px] text-club-red font-bold uppercase tracking-wider">
                                    Ver Todos
                                </Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {upcomingEvents.map((event, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                        <div className="w-12 h-12 bg-club-red/10 flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold text-club-red uppercase">{event.date}</span>
                                            <span className="text-[10px] text-white/50">{event.time}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">{event.type}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* ========== CTA SECTION ========== */}
            < section className="py-12 px-4" >
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 bg-gradient-to-br from-club-red/20 to-club-black border border-club-red/30 text-center"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                            Pronto para remar conosco?
                        </h2>
                        <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
                            Agende sua aula experimental gratuita e descubra o poder transformador do remo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/trial-booking"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-club-red text-white font-bold uppercase tracking-wider text-sm hover:bg-club-red-700 transition-colors"
                            >
                                Agendar Aula Grátis
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white font-semibold border border-white/20 hover:bg-white/10 transition-colors"
                            >
                                Conhecer o Clube
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* ========== FOOTER ========== */}
            < footer className="border-t border-white/10 bg-club-black" >
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Logo & Info - CORRIGIDO: letras maiúsculas */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src="/SCN.svg"
                                    alt="Sport Club de Natal"
                                    width={40}
                                    height={40}
                                    style={{ width: '40px', height: 'auto' }}
                                />
                                <div>
                                    <p className="text-lg font-black text-white uppercase tracking-tight leading-none">
                                        SPORT CLUB
                                    </p>
                                    <p className="text-lg font-black text-club-red uppercase tracking-widest leading-none">
                                        DE NATAL
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-white/40 mb-4">
                                O clube de remo mais tradicional do RN, desde 1915.
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href="https://facebook.com/sportclubdenatal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-club-red transition-colors"
                                >
                                    <Facebook className="w-4 h-4 text-white" />
                                </a>
                                <a
                                    href="https://instagram.com/sportclubdenatal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-club-red transition-colors"
                                >
                                    <Instagram className="w-4 h-4 text-white" />
                                </a>
                                <a
                                    href="https://tiktok.com/@sportclubdenatal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-club-red transition-colors"
                                >
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Parceiros */}
                            <div className="mt-6">
                                <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Parceiros</p>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <a href="https://www.rn.gov.br/" target="_blank" rel="noopener noreferrer" className="relative h-[96px] w-[120px] hover:opacity-70 transition-opacity">
                                        <Image
                                            src="/logos/svg/RN.svg"
                                            alt="Governo do RN"
                                            fill
                                            className="object-contain"
                                        />
                                    </a>
                                    <a href="https://www.natal.rn.gov.br/" target="_blank" rel="noopener noreferrer" className="relative h-[53px] w-[66px] hover:opacity-70 transition-opacity">
                                        <Image
                                            src="/logos/svg/prefeitura.svg"
                                            alt="Prefeitura de Natal"
                                            fill
                                            className="object-contain"
                                        />
                                    </a>
                                    <a href="https://www.potigas.com.br/" target="_blank" rel="noopener noreferrer" className="relative h-[48px] w-[60px] hover:opacity-70 transition-opacity">
                                        <Image
                                            src="/logos/svg/POTIGAS.svg"
                                            alt="Potigás"
                                            fill
                                            className="object-contain"
                                        />
                                    </a>
                                    <a href="https://www.instagram.com/eurekaerk/" target="_blank" rel="noopener noreferrer" className="relative h-[48px] w-[60px] hover:opacity-70 transition-opacity">
                                        <Image
                                            src="/logos/svg/ERK.svg"
                                            alt="Eureka"
                                            fill
                                            className="object-contain"
                                        />
                                    </a>
                                    <a href="https://www.remobrasil.com/" target="_blank" rel="noopener noreferrer" className="relative h-[48px] w-[60px] hover:opacity-70 transition-opacity">
                                        <Image
                                            src="/logos/svg/CBR.svg"
                                            alt="CBR"
                                            fill
                                            className="object-contain"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                                Links
                            </h4>
                            <ul className="space-y-2">
                                {['Sobre', 'Notícias', 'Galeria', 'Store', 'Contato'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            href={`/${item.toLowerCase().replace('í', 'i')}`}
                                            className="text-sm text-white/50 hover:text-club-red transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                                Contato
                            </h4>
                            <ul className="space-y-3 text-sm text-white/50">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-club-red" />
                                    R. Chile, 14 - Ribeira, Natal - RN, 59012-250
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-club-red" />
                                    (84) 99933-1251
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-club-red" />
                                    contato@scnatal.com.br
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
                        <p>© 2025 Sport Club de Natal. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
}
