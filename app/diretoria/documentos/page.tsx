'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    FileText,
    Download,
    Eye,
    Calendar,
    Plus,
    Search,
    Filter,
    FolderOpen,
    File,
    FileCheck,
    BookOpen,
    Scale,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const documents = [
    {
        id: '1',
        title: 'Estatuto Social',
        description: 'Estatuto Social do Sport Club de Natal - Atualizado em 2023',
        category: 'ESTATUTO',
        date: '2023-06-15',
        fileSize: '2.4 MB',
        downloads: 145,
    },
    {
        id: '2',
        title: 'Regimento Interno',
        description: 'Normas e procedimentos internos do clube',
        category: 'REGIMENTO',
        date: '2023-08-20',
        fileSize: '1.8 MB',
        downloads: 98,
    },
    {
        id: '3',
        title: 'Código de Ética',
        description: 'Código de conduta para sócios e atletas',
        category: 'REGULAMENTO',
        date: '2022-01-10',
        fileSize: '850 KB',
        downloads: 67,
    },
    {
        id: '4',
        title: 'Ata AGO 2024',
        description: 'Ata da Assembleia Geral Ordinária de 2024',
        category: 'ATA',
        date: '2024-03-20',
        fileSize: '1.2 MB',
        downloads: 42,
    },
    {
        id: '5',
        title: 'Ata AGO 2023',
        description: 'Ata da Assembleia Geral Ordinária de 2023',
        category: 'ATA',
        date: '2023-03-15',
        fileSize: '1.1 MB',
        downloads: 89,
    },
    {
        id: '6',
        title: 'Regulamento de Competições',
        description: 'Regras para participação em competições oficiais',
        category: 'REGULAMENTO',
        date: '2024-01-05',
        fileSize: '650 KB',
        downloads: 34,
    },
    {
        id: '7',
        title: 'Termo de Responsabilidade',
        description: 'Termo obrigatório para uso de embarcações',
        category: 'FORMULARIO',
        date: '2024-06-01',
        fileSize: '180 KB',
        downloads: 256,
    },
    {
        id: '8',
        title: 'Ficha de Inscrição',
        description: 'Formulário para novos sócios',
        category: 'FORMULARIO',
        date: '2024-06-01',
        fileSize: '220 KB',
        downloads: 187,
    },
];

const categoryConfig: Record<string, { label: string; color: string; icon: any }> = {
    ESTATUTO: { label: 'Estatuto', color: 'bg-club-red/20 text-club-red', icon: Scale },
    REGIMENTO: { label: 'Regimento', color: 'bg-blue-500/20 text-blue-400', icon: BookOpen },
    REGULAMENTO: { label: 'Regulamento', color: 'bg-purple-500/20 text-purple-400', icon: FileCheck },
    ATA: { label: 'Ata', color: 'bg-emerald-500/20 text-emerald-400', icon: FileText },
    FORMULARIO: { label: 'Formulário', color: 'bg-amber-500/20 text-amber-400', icon: File },
};

const categories = ['Todos', 'Estatuto', 'Regimento', 'Regulamento', 'Ata', 'Formulário'];

export default function DocumentosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' ||
            categoryConfig[doc.category]?.label === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedByCategory = filteredDocuments.reduce((acc, doc) => {
        const cat = categoryConfig[doc.category]?.label || 'Outros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {} as Record<string, typeof documents>);

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Diretoria
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Documentos</h1>
                            <p className="text-white/50">Estatuto, atas, regulamentos e formulários</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Upload
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{documents.length}</div>
                        <div className="text-xs text-white/40">Documentos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <FolderOpen className="w-6 h-6 text-club-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{Object.keys(categoryConfig).length}</div>
                        <div className="text-xs text-white/40">Categorias</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Download className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {documents.reduce((acc, d) => acc + d.downloads, 0)}
                        </div>
                        <div className="text-xs text-white/40">Downloads</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">2024</div>
                        <div className="text-xs text-white/40">Última Atualização</div>
                    </AnimatedCard>
                </div>

                {/* Search and Categories */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-club-red/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className={selectedCategory === cat ? "" : "border-white/10 text-white/60"}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Documents List */}
                {Object.entries(groupedByCategory).map(([category, docs]) => (
                    <section key={category} className="mb-8">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {(() => {
                                const config = Object.values(categoryConfig).find(c => c.label === category);
                                const Icon = config?.icon || FileText;
                                return <Icon className="w-5 h-5 text-white/50" />;
                            })()}
                            {category}
                            <Badge className="ml-2 bg-white/10 text-white/60 border-0">{docs.length}</Badge>
                        </h2>

                        <div className="grid gap-3 md:grid-cols-2">
                            {docs.map((doc, i) => {
                                const config = categoryConfig[doc.category];
                                const Icon = config?.icon || FileText;

                                return (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <AnimatedCard variant="glass" hover className="group">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl ${config?.color.split(' ')[0] || 'bg-white/10'} flex items-center justify-center flex-shrink-0`}>
                                                    <Icon className={`w-6 h-6 ${config?.color.split(' ')[1] || 'text-white/40'}`} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-white group-hover:text-club-gold transition-colors mb-1">
                                                        {doc.title}
                                                    </h3>
                                                    <p className="text-xs text-white/40 line-clamp-1 mb-2">
                                                        {doc.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(doc.date).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <span>{doc.fileSize}</span>
                                                        <span>{doc.downloads} downloads</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 flex-shrink-0">
                                                    <Button variant="ghost" size="icon" className="text-white/30 hover:text-white">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-white/30 hover:text-club-gold">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Nenhum documento encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
