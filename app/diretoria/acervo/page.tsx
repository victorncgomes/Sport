'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Archive,
    Ship,
    PackageCheck,
    AlertTriangle,
    Search,
    Plus,
    Filter,
    Calendar,
    MapPin,
    Tag,
    History,
    CheckCircle2,
    Clock,
    Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Dados simulados do acervo/patrimônio - 44 itens
const patrimonioItems = [
    // Barcos de competição e treino (20 itens)
    { id: 'B001', nome: 'Potengi I', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2015-003', localizacao: 'Garagem A', ultimaVistoria: '2025-01-15', valor: 45000 },
    { id: 'B002', nome: 'Natal', categoria: 'Barco', tipo: 'Quadruple (4-)', status: 'ativo', tombamento: '2018-007', localizacao: 'Garagem A', ultimaVistoria: '2025-01-10', valor: 120000 },
    { id: 'B003', nome: 'SCN Master', categoria: 'Barco', tipo: 'Oito (8+)', status: 'manutencao', tombamento: '2020-012', localizacao: 'Oficina', ultimaVistoria: '2024-12-28', valor: 250000 },
    { id: 'B004', nome: 'Forte dos Reis', categoria: 'Barco', tipo: 'Double (2x)', status: 'ativo', tombamento: '2019-005', localizacao: 'Garagem A', ultimaVistoria: '2025-01-12', valor: 85000 },
    { id: 'B005', nome: 'Mãe Luiza', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2021-001', localizacao: 'Garagem A', ultimaVistoria: '2025-01-08', valor: 42000 },
    { id: 'B006', nome: 'Ponta Negra I', categoria: 'Barco', tipo: 'Pair (2-)', status: 'ativo', tombamento: '2017-009', localizacao: 'Garagem B', ultimaVistoria: '2025-01-05', valor: 78000 },
    { id: 'B007', nome: 'Ponta Negra II', categoria: 'Barco', tipo: 'Pair (2-)', status: 'ativo', tombamento: '2017-010', localizacao: 'Garagem B', ultimaVistoria: '2025-01-05', valor: 78000 },
    { id: 'B008', nome: 'Galo', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2022-003', localizacao: 'Garagem A', ultimaVistoria: '2024-12-20', valor: 38000 },
    { id: 'B009', nome: 'Reis Magos', categoria: 'Barco', tipo: 'Coxed Four (4+)', status: 'ativo', tombamento: '2016-008', localizacao: 'Garagem B', ultimaVistoria: '2025-01-18', valor: 135000 },
    { id: 'B010', nome: 'Estrela do Mar', categoria: 'Barco', tipo: 'Single (1x)', status: 'manutencao', tombamento: '2014-002', localizacao: 'Oficina', ultimaVistoria: '2024-11-30', valor: 32000 },
    { id: 'B011', nome: 'Barreira do Inferno', categoria: 'Barco', tipo: 'Double Scull (2x)', status: 'ativo', tombamento: '2023-002', localizacao: 'Garagem A', ultimaVistoria: '2025-01-20', valor: 92000 },
    { id: 'B012', nome: 'Areia Preta', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2020-006', localizacao: 'Garagem B', ultimaVistoria: '2025-01-14', valor: 40000 },
    { id: 'B013', nome: 'Cajueiro', categoria: 'Barco', tipo: 'Quadruple Scull (4x)', status: 'ativo', tombamento: '2019-011', localizacao: 'Garagem A', ultimaVistoria: '2024-12-15', valor: 140000 },
    { id: 'B014', nome: 'Pitimbú', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2023-005', localizacao: 'Garagem B', ultimaVistoria: '2025-01-22', valor: 48000 },
    { id: 'B015', nome: 'Redinha', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2021-008', localizacao: 'Garagem A', ultimaVistoria: '2025-01-19', valor: 44000 },
    { id: 'B016', nome: 'Costeira', categoria: 'Barco', tipo: 'Double (2x)', status: 'ativo', tombamento: '2018-014', localizacao: 'Garagem B', ultimaVistoria: '2025-01-11', valor: 82000 },
    { id: 'B017', nome: 'Via Costeira', categoria: 'Barco', tipo: 'Single Jr (1x)', status: 'ativo', tombamento: '2024-003', localizacao: 'Garagem A', ultimaVistoria: '2025-01-25', valor: 28000 },
    { id: 'B018', nome: 'Pirangi', categoria: 'Barco', tipo: 'Single Jr (1x)', status: 'ativo', tombamento: '2024-004', localizacao: 'Garagem A', ultimaVistoria: '2025-01-25', valor: 28000 },
    { id: 'B019', nome: 'Cotovelo', categoria: 'Barco', tipo: 'Single Jr (1x)', status: 'ativo', tombamento: '2024-005', localizacao: 'Garagem A', ultimaVistoria: '2025-01-25', valor: 28000 },
    { id: 'B020', nome: 'Barra do Rio', categoria: 'Barco', tipo: 'Treino Iniciante', status: 'ativo', tombamento: '2022-010', localizacao: 'Garagem B', ultimaVistoria: '2024-12-10', valor: 18000 },
    // Lancha e Motor (2 itens)
    { id: 'L001', nome: 'Lancha de Apoio SCN', categoria: 'Lancha', tipo: 'Apoio/Resgate', status: 'ativo', tombamento: '2019-020', localizacao: 'Doca', ultimaVistoria: '2025-01-15', valor: 85000 },
    { id: 'M001', nome: 'Motor de Popa Yamaha 40HP', categoria: 'Motor', tipo: 'Motor Externo', status: 'ativo', tombamento: '2020-021', localizacao: 'Doca', ultimaVistoria: '2025-01-15', valor: 22000 },
    // Remos (4 itens)
    { id: 'R001', nome: 'Conjunto Remos Concept2', categoria: 'Remo', tipo: 'Competição', status: 'ativo', tombamento: '2022-045', localizacao: 'Armário 1', ultimaVistoria: '2025-01-20', valor: 8500 },
    { id: 'R002', nome: 'Remos Treino Júnior', categoria: 'Remo', tipo: 'Treino', status: 'ativo', tombamento: '2023-018', localizacao: 'Armário 2', ultimaVistoria: '2025-01-18', valor: 3200 },
    { id: 'R003', nome: 'Remos Croker Competição', categoria: 'Remo', tipo: 'Competição', status: 'ativo', tombamento: '2021-030', localizacao: 'Armário 1', ultimaVistoria: '2025-01-16', valor: 12000 },
    { id: 'R004', nome: 'Remos Treino Média', categoria: 'Remo', tipo: 'Treino', status: 'manutencao', tombamento: '2020-035', localizacao: 'Oficina', ultimaVistoria: '2024-12-22', valor: 4800 },
    // Equipamentos de treino (4 itens)
    { id: 'E001', nome: 'Ergômetro Concept2 RowErg', categoria: 'Equipamento', tipo: 'Treino', status: 'ativo', tombamento: '2024-001', localizacao: 'Sala Ergômetros', ultimaVistoria: '2025-01-22', valor: 12000 },
    { id: 'E002', nome: 'Ergômetro Concept2 RowErg', categoria: 'Equipamento', tipo: 'Treino', status: 'ativo', tombamento: '2024-002', localizacao: 'Sala Ergômetros', ultimaVistoria: '2025-01-22', valor: 12000 },
    { id: 'E003', nome: 'Ergômetro Concept2 BikeErg', categoria: 'Equipamento', tipo: 'Treino', status: 'ativo', tombamento: '2023-015', localizacao: 'Sala Ergômetros', ultimaVistoria: '2025-01-20', valor: 9000 },
    { id: 'E004', nome: 'Esteira Elétrica Movement', categoria: 'Equipamento', tipo: 'Treino', status: 'ativo', tombamento: '2022-028', localizacao: 'Sala Ergômetros', ultimaVistoria: '2024-12-28', valor: 8500 },
    // Eletrônicos (5 itens)
    { id: 'EL001', nome: 'TV Samsung 65" Salão Social', categoria: 'Eletrônico', tipo: 'Televisão', status: 'ativo', tombamento: '2023-050', localizacao: 'Salão Social', ultimaVistoria: '2024-11-10', valor: 4500 },
    { id: 'EL002', nome: 'TV LG 55" Sala Treino', categoria: 'Eletrônico', tipo: 'Televisão', status: 'ativo', tombamento: '2022-055', localizacao: 'Sala Ergômetros', ultimaVistoria: '2024-11-10', valor: 3200 },
    { id: 'EL003', nome: 'Ar Condicionado Split 24000 BTU', categoria: 'Eletrônico', tipo: 'Climatização', status: 'ativo', tombamento: '2021-080', localizacao: 'Salão Social', ultimaVistoria: '2024-10-15', valor: 3800 },
    { id: 'EL004', nome: 'Ar Condicionado Split 18000 BTU', categoria: 'Eletrônico', tipo: 'Climatização', status: 'ativo', tombamento: '2021-081', localizacao: 'Sala Ergômetros', ultimaVistoria: '2024-10-15', valor: 2800 },
    { id: 'EL005', nome: 'Sistema de Som JBL', categoria: 'Eletrônico', tipo: 'Áudio', status: 'ativo', tombamento: '2022-060', localizacao: 'Salão Social', ultimaVistoria: '2024-09-20', valor: 2500 },
    // Mobiliário (6 itens)
    { id: 'MOB001', nome: 'Mesa de Reunião 12 lugares', categoria: 'Mobiliário', tipo: 'Mesa', status: 'ativo', tombamento: '2019-089', localizacao: 'Sala Diretoria', ultimaVistoria: '2024-11-15', valor: 4500 },
    { id: 'MOB002', nome: 'Armário Vestiário M-01 (20 portas)', categoria: 'Mobiliário', tipo: 'Armário', status: 'ativo', tombamento: '2019-090', localizacao: 'Vestiário Masculino', ultimaVistoria: '2024-11-15', valor: 3500 },
    { id: 'MOB003', nome: 'Armário Vestiário F-01 (20 portas)', categoria: 'Mobiliário', tipo: 'Armário', status: 'ativo', tombamento: '2019-091', localizacao: 'Vestiário Feminino', ultimaVistoria: '2024-11-15', valor: 3500 },
    { id: 'MOB004', nome: 'Bebedouro Industrial IBBL', categoria: 'Mobiliário', tipo: 'Bebedouro', status: 'ativo', tombamento: '2020-100', localizacao: 'Área Comum', ultimaVistoria: '2024-12-01', valor: 2200 },
    { id: 'MOB005', nome: 'Geladeira Brastemp Frost Free 472L', categoria: 'Mobiliário', tipo: 'Eletrodoméstico', status: 'ativo', tombamento: '2021-110', localizacao: 'Cozinha', ultimaVistoria: '2024-10-20', valor: 3800 },
    { id: 'MOB006', nome: 'Conjunto Mesas Plásticas (10 un)', categoria: 'Mobiliário', tipo: 'Mesa', status: 'ativo', tombamento: '2022-120', localizacao: 'Área Externa', ultimaVistoria: '2024-08-15', valor: 1500 },
    // Cutelaria (classificação secundária - 1 item)
    { id: 'C001', nome: 'Talheres Inox Completo', categoria: 'Acessório', tipo: 'Cutelaria', status: 'ativo', tombamento: '2021-156', localizacao: 'Cozinha', ultimaVistoria: '2024-10-01', valor: 2800 },
    // Outros acessórios (2 itens)
    { id: 'AC001', nome: 'Coletes Salva-Vidas (20 un)', categoria: 'Acessório', tipo: 'Segurança', status: 'ativo', tombamento: '2023-160', localizacao: 'Armário Segurança', ultimaVistoria: '2025-01-10', valor: 4000 },
    { id: 'AC002', nome: 'Bóias de Sinalização (10 un)', categoria: 'Acessório', tipo: 'Segurança', status: 'ativo', tombamento: '2023-161', localizacao: 'Doca', ultimaVistoria: '2025-01-10', valor: 1500 },
];

const categorias = ['Todos', 'Barco', 'Lancha', 'Motor', 'Remo', 'Equipamento', 'Eletrônico', 'Mobiliário', 'Acessório'];

const statusColors = {
    ativo: 'bg-emerald-500/20 text-emerald-400',
    manutencao: 'bg-amber-500/20 text-amber-400',
    inativo: 'bg-red-500/20 text-red-400',
    emprestado: 'bg-blue-500/20 text-blue-400',
};

const statusLabels = {
    ativo: 'Ativo',
    manutencao: 'Manutenção',
    inativo: 'Inativo',
    emprestado: 'Emprestado',
};

export default function AcervoPage() {
    const [selectedCategoria, setSelectedCategoria] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = patrimonioItems.filter(item => {
        const matchesCategoria = selectedCategoria === 'Todos' || item.categoria === selectedCategoria;
        const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tombamento.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategoria && matchesSearch;
    });

    const totalValor = patrimonioItems.reduce((sum, item) => sum + item.valor, 0);
    const totalAtivo = patrimonioItems.filter(i => i.status === 'ativo').length;
    const totalManutencao = patrimonioItems.filter(i => i.status === 'manutencao').length;

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Archive className="w-8 h-8 text-rose-500" />
                                Acervo do Clube
                            </h1>
                            <p className="text-white/50">Patrimônio, tombamento e inventário geral</p>
                        </div>
                        <Button className="gap-2 bg-rose-600 hover:bg-rose-700">
                            <Plus className="w-4 h-4" />
                            Novo Item
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Archive className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{patrimonioItems.length}</div>
                        <p className="text-xs text-white/50">Total Itens</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20 bg-emerald-500/5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{totalAtivo}</div>
                        <p className="text-xs text-emerald-400/70">Ativos</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20 bg-amber-500/5">
                        <Wrench className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{totalManutencao}</div>
                        <p className="text-xs text-amber-400/70">Em Manutenção</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-rose-500/20 bg-rose-500/5">
                        <Tag className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-rose-400">R$ {(totalValor / 1000).toFixed(0)}k</div>
                        <p className="text-xs text-rose-400/70">Valor Total</p>
                    </AnimatedCard>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou tombamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <Filter className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategoria(cat)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                    selectedCategoria === cat
                                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                                        : "bg-transparent border-white/10 text-white/60 hover:border-white/30"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Itens */}
                <div className="grid gap-4">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <AnimatedCard variant="glass" className="p-4 hover:border-rose-500/20 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                                            {item.categoria === 'Barco' ? <Ship className="w-6 h-6 text-rose-400" /> :
                                                item.categoria === 'Remo' ? <Archive className="w-6 h-6 text-rose-400" /> :
                                                    <PackageCheck className="w-6 h-6 text-rose-400" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-bold">{item.nome}</h3>
                                                <Badge className={cn("border-0 text-[10px]", statusColors[item.status as keyof typeof statusColors])}>
                                                    {statusLabels[item.status as keyof typeof statusLabels]}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {item.tombamento}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {item.localizacao}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Vistoria: {new Date(item.ultimaVistoria).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/30 uppercase font-bold">Valor</p>
                                            <p className="text-white font-bold">R$ {item.valor.toLocaleString('pt-BR')}</p>
                                        </div>
                                        <Badge className="bg-white/5 text-white/70 border-white/10">{item.tipo}</Badge>
                                        <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                                            <History className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <Archive className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50">Nenhum item encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
