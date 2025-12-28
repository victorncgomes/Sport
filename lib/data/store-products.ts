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
        image: '/store/camisa_poliester_oficial.png',
        isNew: true
    },
    {
        id: '1',
        name: 'Camisa Oficial Competição 2025',
        description: 'Tecido tecnológico com proteção UV50+ e secagem ultra rápida. Design aerodinâmico para alta performance.',
        price: 189.90,
        category: 'vestuario',
        image: 'https://images.unsplash.com/photo-1571945153237-4929e783ee4a?auto=format&fit=crop&q=80&w=800',
        isNew: true
    },
    {
        id: '2',
        name: 'Boné Tático SCN',
        description: 'Boné leve com ventilação lateral a laser. Logo bordado em fio metálico.',
        price: 89.90,
        category: 'vestuario',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '3',
        name: 'Unisuit Elite Pro',
        description: 'Macaquinho de remo profissional. Compressão graduada e corte anatômico.',
        price: 299.90,
        category: 'vestuario',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        isPopular: true
    },
    {
        id: '4',
        name: 'Jaqueta Corta-Vento',
        description: 'Proteção contra vento e chuva leve. Faixas refletivas para segurança.',
        price: 249.90,
        category: 'vestuario',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '5',
        name: 'Regata de Treino Diário',
        description: 'Conforto e durabilidade para o dia a dia. Malha fria.',
        price: 69.90,
        category: 'vestuario',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    },

    // Acessórios
    {
        id: '6',
        name: 'Squeeze Térmico 750ml',
        description: 'Mantém a temperatura por até 12 horas. Aço inoxidável com acabamento fosco.',
        price: 99.90,
        category: 'acessorios',
        image: 'https://images.unsplash.com/photo-1602143302703-f9a4991a8da2?auto=format&fit=crop&q=80&w=800',
        isPopular: true
    },
    {
        id: '7',
        name: 'Viseira SCN Gold',
        description: 'Proteção solar sem comprometer a ventilação. Ajuste elástico confortável.',
        price: 59.90,
        category: 'acessorios',
        image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '8',
        name: 'Mochila Estanque 30L',
        description: '100% à prova d\'água. Ideal para levar equipamentos no barco.',
        price: 329.90,
        category: 'acessorios',
        image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '9',
        name: 'Toalha de Alta Absorção',
        description: 'Microfibra compacta. Seca 5x mais rápido que toalhas comuns.',
        price: 49.90,
        category: 'acessorios',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '10',
        name: 'Chaveiro Flutuante',
        description: 'Nunca perca suas chaves na água. Espuma de alta densidade.',
        price: 29.90,
        category: 'acessorios',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    },

    // Bar & Lanchonete
    {
        id: '11',
        name: 'Açaí Turbinado 500ml',
        description: 'Açaí puro com banana, granola e mel. Energia para o pós-treino.',
        price: 22.00,
        category: 'lanchonete',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800',
        isPopular: true
    },
    {
        id: '12',
        name: 'Isotônico Natural',
        description: 'Mix de frutas cítricas, água de coco e sal do himalaia.',
        price: 12.00,
        category: 'bar',
        image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '13',
        name: 'Sanduíche de Club',
        description: 'Pão integral, peito de frango desfiado, ricota e cenoura.',
        price: 18.00,
        category: 'lanchonete',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '14',
        name: 'Água de Coco Fresca',
        description: 'Direto do coco. Hidratação perfeita.',
        price: 8.00,
        category: 'bar',
        image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '15',
        name: 'Barra de Proteína Caseira',
        description: 'Aveia, pasta de amendoim, whey protein e cacau.',
        price: 10.00,
        category: 'lanchonete',
        image: 'https://images.unsplash.com/photo-1510003461433-6f4327292271?auto=format&fit=crop&q=80&w=800',
        isNew: true
    }
];
