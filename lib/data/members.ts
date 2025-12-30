// Dados simulados de 30 sócios para o Sport Club de Natal
// Usado no painel da diretoria e em outras partes do sistema

export interface MemberData {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    category: 'JUNIOR' | 'ADULT' | 'MASTER' | 'HONORARY';
    memberSince: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
    paymentStatus: 'CURRENT' | 'PENDING' | 'OVERDUE';
    photo?: string;
    sports: string[];
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
    xp: number;
    badges: string[];
    stats: {
        totalTrainings: number;
        totalDistance: number; // km
        avgPace: string;
        competitions: number;
        medals: number;
    };
    physicalData?: {
        height: number; // cm
        weight: number; // kg
        armSpan: number; // cm
        heartRateMax: number;
        vo2max?: number;
    };
    address: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
}

const firstNames = [
    'Ana Paula', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena',
    'Igor', 'Julia', 'Lucas', 'Mariana', 'Nicolau', 'Olivia', 'Pedro', 'Rafaela',
    'Thiago', 'Valentina', 'Wagner', 'Yasmin', 'André', 'Beatriz', 'Caio', 'Diana',
    'Emanuel', 'Flávia', 'Gustavo', 'Isabela', 'João', 'Larissa'
];

const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Ferreira', 'Almeida',
    'Nascimento', 'Lima', 'Araújo', 'Barbosa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha',
    'Correia', 'Gomes', 'Dias', 'Moreira', 'Nunes', 'Vieira', 'Teixeira', 'Mendes',
    'Cardoso', 'Freitas', 'Monteiro', 'Cavalcante', 'Bezerra', 'Medeiros'
];

const neighborhoods = [
    'Petrópolis', 'Tirol', 'Lagoa Nova', 'Capim Macio', 'Ponta Negra',
    'Candelária', 'Cidade Alta', 'Alecrim', 'Barro Vermelho', 'Morro Branco'
];

const streets = [
    'Rua Seridó', 'Av. Prudente de Morais', 'Rua Trairi', 'Av. Hermes da Fonseca',
    'Rua João Pessoa', 'Av. Roberto Freire', 'Rua Mossoró', 'Av. Salgado Filho',
    'Rua Potengi', 'Rua Apodi'
];

const emergencyRelations = ['Mãe', 'Pai', 'Cônjuge', 'Irmão(ã)', 'Amigo(a)'];

const badgeOptions = [
    'first_training', 'streak_7', 'streak_30', 'distance_100km', 'distance_500km',
    'early_bird', 'night_owl', 'speed_demon', 'endurance_master', 'team_player',
    'competition_ready', 'medal_winner', 'volunteer', 'ambassador', 'veteran'
];

function generateCPF(): string {
    const n = () => Math.floor(Math.random() * 10);
    return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
}

function generatePhone(): string {
    const n = () => Math.floor(Math.random() * 10);
    return `(84) 9${n()}${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
}

function generateDate(minYearsAgo: number, maxYearsAgo: number): string {
    const now = new Date();
    const yearsAgo = minYearsAgo + Math.random() * (maxYearsAgo - minYearsAgo);
    const date = new Date(now.getFullYear() - yearsAgo, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    return date.toISOString().split('T')[0];
}

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateMember(index: number): MemberData {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase().replace(' ', '.')}.${lastName.toLowerCase()}@email.com`;

    const categories: MemberData['category'][] = ['JUNIOR', 'ADULT', 'ADULT', 'ADULT', 'MASTER', 'HONORARY'];
    const category = randomElement(categories);

    const statuses: MemberData['status'][] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'PENDING'];
    const status = randomElement(statuses);

    const paymentStatuses: MemberData['paymentStatus'][] = ['CURRENT', 'CURRENT', 'CURRENT', 'PENDING', 'OVERDUE'];
    const paymentStatus = randomElement(paymentStatuses);

    const levels: MemberData['level'][] = ['BEGINNER', 'INTERMEDIATE', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];
    const level = randomElement(levels);

    const sportsOptions = ['Remo', 'Natação', 'Corrida', 'Musculação', 'Canoagem'];
    const numSports = 1 + Math.floor(Math.random() * 3);
    const sports = [...new Set(Array(numSports).fill(null).map(() => randomElement(sportsOptions)))];

    const numBadges = Math.floor(Math.random() * 6);
    const badges = [...new Set(Array(numBadges).fill(null).map(() => randomElement(badgeOptions)))];

    const birthYear = category === 'JUNIOR' ? { min: 10, max: 17 }
        : category === 'MASTER' ? { min: 40, max: 65 }
            : { min: 18, max: 45 };

    return {
        id: `member-${String(index + 1).padStart(3, '0')}`,
        name,
        email,
        phone: generatePhone(),
        cpf: generateCPF(),
        birthDate: generateDate(birthYear.min, birthYear.max),
        category,
        memberSince: generateDate(0.5, 8),
        status,
        paymentStatus,
        sports,
        level,
        xp: Math.floor(Math.random() * 15000),
        badges,
        stats: {
            totalTrainings: Math.floor(Math.random() * 300),
            totalDistance: Math.floor(Math.random() * 1500),
            avgPace: `${2 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            competitions: Math.floor(Math.random() * 15),
            medals: Math.floor(Math.random() * 8)
        },
        physicalData: {
            height: 155 + Math.floor(Math.random() * 40),
            weight: 50 + Math.floor(Math.random() * 40),
            armSpan: 160 + Math.floor(Math.random() * 40),
            heartRateMax: 170 + Math.floor(Math.random() * 25),
            vo2max: level === 'ELITE' || level === 'ADVANCED' ? 45 + Math.floor(Math.random() * 20) : undefined
        },
        address: {
            street: randomElement(streets),
            number: String(Math.floor(Math.random() * 2000) + 1),
            neighborhood: randomElement(neighborhoods),
            city: 'Natal',
            state: 'RN',
            zipCode: `59${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        },
        emergencyContact: {
            name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
            phone: generatePhone(),
            relation: randomElement(emergencyRelations)
        }
    };
}

export const MOCK_MEMBERS: MemberData[] = Array.from({ length: 30 }, (_, i) => generateMember(i));

// Dados de propostas de sócios pendentes
export interface MemberProposal {
    id: string;
    name: string;
    email: string;
    phone: string;
    submittedAt: string;
    category: MemberData['category'];
    motivation: string;
    referredBy?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const MOCK_PROPOSALS: MemberProposal[] = [
    {
        id: 'prop-001',
        name: 'Ricardo Albuquerque',
        email: 'ricardo.albuquerque@email.com',
        phone: '(84) 99876-5432',
        submittedAt: '2024-12-28',
        category: 'ADULT',
        motivation: 'Interesse em iniciar no remo para melhorar condicionamento físico e participar de competições amadoras.',
        referredBy: 'Carlos Silva (sócio)',
        status: 'PENDING'
    },
    {
        id: 'prop-002',
        name: 'Marina Costa',
        email: 'marina.costa@email.com',
        phone: '(84) 99123-4567',
        submittedAt: '2024-12-30',
        category: 'JUNIOR',
        motivation: 'Atleta de natação buscando esporte complementar. Indicada pelo técnico da escola.',
        status: 'PENDING'
    },
    {
        id: 'prop-003',
        name: 'Alberto Santos Filho',
        email: 'alberto.filho@email.com',
        phone: '(84) 98765-1234',
        submittedAt: '2024-12-25',
        category: 'MASTER',
        motivation: 'Ex-remador retornando ao esporte após 10 anos afastado.',
        referredBy: 'Ex-membro',
        status: 'PENDING'
    }
];

// Funções de busca
export function getMemberById(id: string): MemberData | undefined {
    return MOCK_MEMBERS.find(m => m.id === id);
}

export function getMembersByStatus(status: MemberData['status']): MemberData[] {
    return MOCK_MEMBERS.filter(m => m.status === status);
}

export function getMembersByCategory(category: MemberData['category']): MemberData[] {
    return MOCK_MEMBERS.filter(m => m.category === category);
}

export function getPendingPayments(): MemberData[] {
    return MOCK_MEMBERS.filter(m => m.paymentStatus !== 'CURRENT');
}
