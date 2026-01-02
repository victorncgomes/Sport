export type GalleryCategory = 'historico' | 'social' | 'treinos' | 'paisagens' | 'eventos';

export interface GalleryComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    text: string;
    createdAt: string;
}

export interface GalleryImage {
    id: string;
    title: string;
    description: string;
    category: GalleryCategory;
    imageUrl: string;
    date: string;
    likes: number;
    likedBy: string[]; // IDs dos usuários que curtiram
    comments: GalleryComment[];
}

// Simulação de usuários do clube
const mockUsers = [
    { id: 'u1', name: 'João Silva', avatar: null },
    { id: 'u2', name: 'Maria Santos', avatar: null },
    { id: 'u3', name: 'Pedro Oliveira', avatar: null },
    { id: 'u4', name: 'Ana Costa', avatar: null },
    { id: 'u5', name: 'Carlos Mendes', avatar: null },
    { id: 'u6', name: 'Fernanda Lima', avatar: null },
    { id: 'u7', name: 'Roberto Alves', avatar: null },
    { id: 'u8', name: 'Patricia Nunes', avatar: null },
    { id: 'u9', name: 'Lucas Ferreira', avatar: null },
    { id: 'u10', name: 'Juliana Medeiros', avatar: null },
];

// Função helper para gerar comentários simulados
const generateComments = (count: number): GalleryComment[] => {
    const comentarios = [
        'Que foto incrível! 🔴⚫',
        'O Sport Club é nossa vida! 💪',
        'Momentos inesquecíveis no Potengi!',
        'Orgulho de fazer parte dessa história!',
        'Vamos Sport! 🚣‍♂️',
        'Equipe sensacional!',
        'Foto maravilhosa! Parabéns ao fotógrafo!',
        'Nossa sede é linda demais!',
        'Remo é vida, Sport é paixão!',
        'Que treino foi esse! Top demais!',
        'Saudades desse dia! 😢',
        'Representando o rubro-negro com orgulho!',
        'A melhor equipe do RN! 🏆',
        'Paisagem espetacular!',
        'Isso é Sport Club de Natal!',
    ];

    const result: GalleryComment[] = [];
    for (let i = 0; i < count; i++) {
        const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        result.push({
            id: `c${Date.now()}-${i}`,
            userId: user.id,
            userName: user.name,
            text: comentarios[Math.floor(Math.random() * comentarios.length)],
            createdAt: date.toISOString(),
        });
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Função helper para gerar likes simulados
const generateLikes = (min: number, max: number): { likes: number; likedBy: string[] } => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
    const likedBy = shuffled.slice(0, Math.min(count, mockUsers.length)).map(u => u.id);
    return { likes: count, likedBy };
};

export const galleryImages: GalleryImage[] = [
    // Imagens reais do Sport Club de Natal
    {
        id: 'scn-1',
        title: 'Pôr do Sol no Rio Potengi',
        description: 'Equipe de remo em treino ao final do dia, com o sol se pondo sobre as águas do Rio Potengi.',
        category: 'paisagens',
        imageUrl: '/images/gallery/remo-sunset.png',
        date: '2024-12-15',
        ...generateLikes(25, 48),
        comments: generateComments(8),
    },
    {
        id: 'scn-2',
        title: 'Equipe de Oito Com',
        description: 'Nossa equipe de Oito Com passando pela Marina Badauê durante treino preparatório.',
        category: 'treinos',
        imageUrl: '/images/gallery/remo-equipe.png',
        date: '2024-12-10',
        ...generateLikes(32, 56),
        comments: generateComments(12),
    },
    {
        id: 'scn-3',
        title: 'Celebração da Vitória',
        description: 'Remadores do Sport Club comemorando mais uma conquista no cais do clube.',
        category: 'eventos',
        imageUrl: '/images/gallery/equipe-comemoracao.png',
        date: '2024-11-28',
        ...generateLikes(45, 72),
        comments: generateComments(15),
    },
    {
        id: 'scn-4',
        title: 'Equipe Feminina de Remo',
        description: 'Nossas atletas representando o Sport Club de Natal em competição nacional.',
        category: 'treinos',
        imageUrl: '/images/gallery/equipe-feminina.png',
        date: '2024-11-15',
        ...generateLikes(38, 65),
        comments: generateComments(10),
    },
    {
        id: 'scn-5',
        title: 'Orgulho Rubro-Negro',
        description: 'Atleta do Sport Club de Natal vestindo as cores do clube com orgulho.',
        category: 'social',
        imageUrl: '/images/gallery/atleta-sorrindo.jpg',
        date: '2024-10-20',
        ...generateLikes(28, 45),
        comments: generateComments(7),
    },
    // Imagens existentes (placeholders)
    {
        id: '1',
        title: 'Fundação do SCN',
        description: 'Primeira diretoria reunida na sede náutica em 1915.',
        category: 'historico',
        imageUrl: '/gallery_1_fundacao.png',
        date: '1915-11-25',
        ...generateLikes(55, 89),
        comments: generateComments(18),
    },
    {
        id: '2',
        title: 'Manhã no Potengi',
        description: 'Neblina baixa sobre o rio momentos antes do treino de Oito Com.',
        category: 'paisagens',
        imageUrl: '/gallery_2_morning.png',
        date: '2024-05-12',
        ...generateLikes(22, 38),
        comments: generateComments(6),
    },
    {
        id: '3',
        title: 'Regata de Aniversário',
        description: 'Competição comemorativa atraindo clubes de todo o Nordeste.',
        category: 'eventos',
        imageUrl: '/gallery_3_regata.png',
        date: '2023-11-15',
        ...generateLikes(42, 68),
        comments: generateComments(14),
    },
    {
        id: '4',
        title: 'Treino de Elite - Single Skiff',
        description: 'Foco e técnica: Atleta do SCN em preparação para o campeonato nacional.',
        category: 'treinos',
        imageUrl: '/gallery_4_elite.png',
        date: '2024-02-20',
        ...generateLikes(35, 52),
        comments: generateComments(9),
    },
    {
        id: '5',
        title: 'Ação Ambiental Rio Limpo',
        description: 'Sócios e comunidade unidos na limpeza das margens do rio.',
        category: 'social',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop',
        date: '2024-01-10',
        ...generateLikes(48, 75),
        comments: generateComments(16),
    },
    // Item 'Troféu Eficiência 1952' removido conforme solicitação
];
