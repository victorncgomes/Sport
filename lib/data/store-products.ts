export type ProductCategory = 'vestuario' | 'acessorios' | 'bar' | 'lanchonete';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    image: string;
    isNew?: boolean;
    isPopular?: boolean;
}


export const storeProducts: Product[] = [
    // Vestuário
    {
        id: 'regata-scn-oficial',
        name: 'Camiseta Regata Sport Club de Natal',
        description: 'Camiseta regata oficial em poliéster de alta performance. Design exclusivo preto e vermelho com listras horizontais e escudo bordado.',
        price: 89.90,
        category: 'vestuario',
        image: '/store/regata_scn_2.png',
        isNew: true,
        isPopular: true
    },
    {
        id: 'camisa-poliester-oficial',
        name: 'Camiseta Poliéster Oficial SCN',
        description: 'Camiseta oficial de treino e torcida. Tecido 100% poliéster leve e respirável com as cores tradicionais do clube.',
        price: 79.90,
        category: 'vestuario',
        image: '/store/camisa_poliester_oficial_v3.png',
        isNew: true
    },
    {
        id: '1',
        name: 'Camisa Oficial Competição 2025',
        description: 'Tecido tecnológico com proteção UV50+ e secagem ultra rápida. Design aerodinâmico para alta performance.',
        price: 189.90,
        category: 'vestuario',
        image: '/store/camisa_competicao_2025.png',
        isNew: true
    },
    {
        id: '2',
        name: 'Boné Tático SCN',
        description: 'Boné leve com ventilação lateral a laser. Logo bordado em fio metálico.',
        price: 89.90,
        category: 'vestuario',
        image: '/store/bone_tatico_scn.png'
    },
    {
        id: '3',
        name: 'Unisuit Elite Pro',
        description: 'Macaquinho de remo profissional. Compressão graduada e corte anatômico.',
        price: 299.90,
        category: 'vestuario',
        image: '/store/unisuit_elite_pro.png',
        isPopular: true
    },
    {
        id: '4',
        name: 'Jaqueta Corta-Vento',
        description: 'Proteção contra vento e chuva leve. Faixas refletivas para segurança.',
        price: 249.90,
        category: 'vestuario',
        image: '/store/jaqueta_corta_vento.png'
    },
    {
        id: '5',
        name: 'Regata de Treino Diário',
        description: 'Conforto e durabilidade para o dia a dia. Malha fria.',
        price: 69.90,
        category: 'vestuario',
        image: '/store/regata_treino_diario.png'
    },

    // Acessórios
    {
        id: '6',
        name: 'Squeeze Térmico 750ml',
        description: 'Mantém a temperatura por até 12 horas. Aço inoxidável com acabamento fosco.',
        price: 99.90,
        category: 'acessorios',
        image: '/store/squeeze_termico.png',
        isPopular: true
    },
    {
        id: '7',
        name: 'Viseira SCN Gold',
        description: 'Proteção solar sem comprometer a ventilação. Ajuste elástico confortável.',
        price: 59.90,
        category: 'acessorios',
        image: '/store/viseira_scn_gold.png'
    },
    {
        id: '8',
        name: 'Mochila Estanque 30L',
        description: '100% à prova d\'água. Ideal para levar equipamentos no barco.',
        price: 329.90,
        category: 'acessorios',
        image: '/store/mochila_estanque.png'
    },
    {
        id: '9',
        name: 'Toalha de Alta Absorção',
        description: 'Microfibra compacta. Seca 5x mais rápido que toalhas comuns.',
        price: 49.90,
        category: 'acessorios',
        image: '/store/toalha_alta_absorcao.png'
    },
    {
        id: '10',
        name: 'Chaveiro Flutuante',
        description: 'Nunca perca suas chaves na água. Espuma de alta densidade.',
        price: 29.90,
        category: 'acessorios',
        image: '/store/chaveiro_flutuante.png'
    },

    // Bar & Lanchonete
    {
        id: '11',
        name: 'Açaí Turbinado 500ml',
        description: 'Açaí puro com banana, granola e mel. Energia para o pós-treino.',
        price: 22.00,
        category: 'lanchonete',
        image: '/store/acai_turbinado.png',
        isPopular: true
    },
    {
        id: '12',
        name: 'Isotônico Natural',
        description: 'Mix de frutas cítricas, água de coco e sal do himalaia.',
        price: 12.00,
        category: 'bar',
        image: '/store/isotonico_natural.png'
    },
    {
        id: '13',
        name: 'Sanduíche de Club',
        description: 'Pão integral, peito de frango desfiado, ricota e cenoura.',
        price: 18.00,
        category: 'lanchonete',
        image: '/store/sanduiche_club.png'
    },
    {
        id: '14',
        name: 'Água de Coco Fresca',
        description: 'Direto do coco. Hidratação perfeita.',
        price: 8.00,
        category: 'bar',
        image: '/store/agua_de_coco.png'
    },
    {
        id: '15',
        name: 'Barra de Proteína Caseira',
        description: 'Aveia, pasta de amendoim, whey protein e cacau.',
        price: 10.00,
        category: 'lanchonete',
        image: '/store/barra_proteina.png',
        isNew: true
    }
];
