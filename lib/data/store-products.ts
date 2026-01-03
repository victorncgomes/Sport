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
        description: 'Reposição eletrolítica natural com água de coco, limão siciliano, sal marinho e mel orgânico.',
        price: 14.00,
        category: 'bar',
        image: '/store/isotonico_natural_v2.png' // Placeholder until Quota reset
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
    },
    {
        id: '16',
        name: 'Água Mineral Premium 500ml',
        description: 'Água mineral natural de fonte, pH equilibrado.',
        price: 5.00,
        category: 'bar',
        image: '/store/agua_mineral.png'
    },
    {
        id: '17',
        name: 'Energético Volt 350ml',
        description: 'Energia extra para o treino intenso. Sabor frutas tropicais.',
        price: 12.00,
        category: 'bar',
        image: '/store/energetico.png'
    },
    {
        id: '18',
        name: 'Refrigerante Cola 350ml',
        description: 'Refrescante e clássico. Ideal para acompanhar o lanche.',
        price: 6.00,
        category: 'bar',
        image: '/store/refrigerante.png'
    },
    {
        id: '19',
        name: 'Cerveja Heineken 350ml',
        description: 'Puro malte, sabor marcante. (Venda proibida para menores de 18 anos).',
        price: 9.00,
        category: 'bar',
        image: '/store/heineken.png'
    },
    {
        id: '20',
        name: 'Cerveja Budweiser 350ml',
        description: 'Leve e refrescante. A cerveja dos campeões.',
        price: 8.00,
        category: 'bar',
        image: '/store/budweiser.png'
    },
    {
        id: '21',
        name: 'Café da Manhã do Remador',
        description: 'Combo: Café com leite, misto quente e porção de frutas.',
        price: 18.00,
        category: 'lanchonete',
        image: '/store/cafe_da_manha.png'
    },
    {
        id: '22',
        name: 'Vitamina Whey Protein',
        description: 'Banana, morango, leite desnatado e whey protein isolado.',
        price: 16.00,
        category: 'lanchonete',
        image: '/store/vitamina_whey.png'
    },
    {
        id: '23',
        name: 'Pão de Queijo Mineiro',
        description: 'Porção com 6 unidades, quentinhos e crocantes.',
        price: 12.00,
        category: 'lanchonete',
        image: '/store/pao_de_queijo.png'
    },
    {
        id: '24',
        name: 'Salada de Frutas Frescas',
        description: 'Mix da estação com granola e mel.',
        price: 10.00,
        category: 'lanchonete',
        image: '/store/salada_frutas.png'
    }
];
