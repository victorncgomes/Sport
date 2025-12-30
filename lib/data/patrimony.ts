// Dados simulados de acervo/patrimônio do Sport Club de Natal
// 40+ itens incluindo barcos, equipamentos, móveis e outros

export type PatrimonyCategory =
    | 'BOAT'           // Barcos
    | 'EQUIPMENT'      // Equipamentos de treino
    | 'FURNITURE'      // Móveis
    | 'ELECTRONICS'    // Eletrônicos
    | 'VEHICLE'        // Veículos (lancha, motor)
    | 'KITCHEN'        // Cozinha/Copa
    | 'TOOLS'          // Ferramentas
    | 'SAFETY'         // Equipamentos de segurança
    | 'OTHER';         // Outros

export type PatrimonyStatus =
    | 'GOOD'           // Em bom estado
    | 'REGULAR'        // Regular
    | 'MAINTENANCE'    // Em manutenção
    | 'DAMAGED'        // Danificado
    | 'DISPOSED';      // Baixado/Descartado

export interface PatrimonyItem {
    id: string;
    name: string;
    description: string;
    category: PatrimonyCategory;
    status: PatrimonyStatus;
    acquisitionDate: string;
    acquisitionValue: number;
    currentValue?: number;
    location: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    notes?: string;
    tombNumber: string; // Número de tombamento
    responsiblePerson?: string;
}

const categoryLabels: Record<PatrimonyCategory, string> = {
    BOAT: 'Embarcação',
    EQUIPMENT: 'Equipamento',
    FURNITURE: 'Mobiliário',
    ELECTRONICS: 'Eletrônico',
    VEHICLE: 'Veículo',
    KITCHEN: 'Copa/Cozinha',
    TOOLS: 'Ferramenta',
    SAFETY: 'Segurança',
    OTHER: 'Outros'
};

const statusLabels: Record<PatrimonyStatus, string> = {
    GOOD: 'Bom Estado',
    REGULAR: 'Regular',
    MAINTENANCE: 'Em Manutenção',
    DAMAGED: 'Avariado',
    DISPOSED: 'Baixado'
};

export { categoryLabels, statusLabels };

// Barcos (20 itens)
const boats: PatrimonyItem[] = [
    { id: 'B001', tombNumber: 'SCN-2015-001', name: 'Potengi I', description: 'Single Skiff para competição', category: 'BOAT', status: 'GOOD', acquisitionDate: '2015-03-10', acquisitionValue: 18000, currentValue: 12000, location: 'Garagem de Barcos', manufacturer: 'Empacher', model: 'Single A', responsiblePerson: 'Treinador Roberto' },
    { id: 'B002', tombNumber: 'SCN-2015-002', name: 'Potengi II', description: 'Single Skiff para treinamento', category: 'BOAT', status: 'GOOD', acquisitionDate: '2015-03-10', acquisitionValue: 18000, currentValue: 11500, location: 'Garagem de Barcos', manufacturer: 'Empacher', model: 'Single A' },
    { id: 'B003', tombNumber: 'SCN-2016-001', name: 'Natal', description: 'Quadruple Sculling (4x)', category: 'BOAT', status: 'GOOD', acquisitionDate: '2016-06-15', acquisitionValue: 45000, currentValue: 35000, location: 'Garagem de Barcos', manufacturer: 'Filippi', model: 'F14', responsiblePerson: 'Treinador Roberto' },
    { id: 'B004', tombNumber: 'SCN-2017-001', name: 'Macaíba', description: 'Eight with Coxswain (8+)', category: 'BOAT', status: 'MAINTENANCE', acquisitionDate: '2017-02-20', acquisitionValue: 85000, currentValue: 60000, location: 'Garagem de Barcos', manufacturer: 'WinTech Racing', model: 'Cobra', notes: 'Reparo no banco 3 em andamento', lastMaintenanceDate: '2024-12-01' },
    { id: 'B005', tombNumber: 'SCN-2018-001', name: 'Pitimbu', description: 'Double Sculling (2x)', category: 'BOAT', status: 'GOOD', acquisitionDate: '2018-04-12', acquisitionValue: 28000, currentValue: 22000, location: 'Garagem de Barcos', manufacturer: 'Filippi', model: 'F12' },
    { id: 'B006', tombNumber: 'SCN-2018-002', name: 'Jundiaí', description: 'Single Skiff Júnior', category: 'BOAT', status: 'GOOD', acquisitionDate: '2018-08-05', acquisitionValue: 14000, currentValue: 10000, location: 'Garagem de Barcos', manufacturer: 'Concept2', model: 'Jr Single' },
    { id: 'B007', tombNumber: 'SCN-2019-001', name: 'Ceará-Mirim', description: 'Coxless Pair (2-)', category: 'BOAT', status: 'GOOD', acquisitionDate: '2019-01-15', acquisitionValue: 32000, currentValue: 26000, location: 'Garagem de Barcos', manufacturer: 'Hudson', model: 'Super Predator' },
    { id: 'B008', tombNumber: 'SCN-2019-002', name: 'Parnamirim', description: 'Coxless Four (4-)', category: 'BOAT', status: 'REGULAR', acquisitionDate: '2019-03-20', acquisitionValue: 52000, currentValue: 38000, location: 'Garagem de Barcos', manufacturer: 'Vespoli', model: 'D-Series' },
    { id: 'B009', tombNumber: 'SCN-2020-001', name: 'Maxaranguape', description: 'Single Skiff Treinamento', category: 'BOAT', status: 'GOOD', acquisitionDate: '2020-02-10', acquisitionValue: 12000, currentValue: 9500, location: 'Garagem de Barcos', manufacturer: 'WinTech Racing', model: 'Trainer' },
    { id: 'B010', tombNumber: 'SCN-2020-002', name: 'Touros', description: 'Single Skiff Treinamento', category: 'BOAT', status: 'GOOD', acquisitionDate: '2020-02-10', acquisitionValue: 12000, currentValue: 9500, location: 'Garagem de Barcos', manufacturer: 'WinTech Racing', model: 'Trainer' },
    { id: 'B011', tombNumber: 'SCN-2021-001', name: 'São Miguel do Gostoso', description: 'Double Sculling Júnior', category: 'BOAT', status: 'GOOD', acquisitionDate: '2021-05-18', acquisitionValue: 22000, currentValue: 19000, location: 'Garagem de Barcos', manufacturer: 'Fluidesign', model: 'Jr Double' },
    { id: 'B012', tombNumber: 'SCN-2021-002', name: 'Pipa', description: 'Single Skiff Competição', category: 'BOAT', status: 'GOOD', acquisitionDate: '2021-08-25', acquisitionValue: 24000, currentValue: 21000, location: 'Garagem de Barcos', manufacturer: 'Empacher', model: 'Single B' },
    { id: 'B013', tombNumber: 'SCN-2022-001', name: 'Galinhos', description: 'Quadruple Sculling Júnior', category: 'BOAT', status: 'GOOD', acquisitionDate: '2022-03-12', acquisitionValue: 38000, currentValue: 34000, location: 'Garagem de Barcos', manufacturer: 'WinTech Racing', model: 'Jr Quad' },
    { id: 'B014', tombNumber: 'SCN-2022-002', name: 'Tibau', description: 'Coxed Four (4+)', category: 'BOAT', status: 'REGULAR', acquisitionDate: '2022-06-30', acquisitionValue: 48000, currentValue: 42000, location: 'Garagem de Barcos', manufacturer: 'Filippi', model: 'F15' },
    { id: 'B015', tombNumber: 'SCN-2023-001', name: 'Areia Branca', description: 'Single Skiff Feminino', category: 'BOAT', status: 'GOOD', acquisitionDate: '2023-02-14', acquisitionValue: 20000, currentValue: 19000, location: 'Garagem de Barcos', manufacturer: 'Empacher', model: 'Single Fem' },
    { id: 'B016', tombNumber: 'SCN-2023-002', name: 'Mossoró', description: 'Double Sculling Competição', category: 'BOAT', status: 'GOOD', acquisitionDate: '2023-05-20', acquisitionValue: 35000, currentValue: 33000, location: 'Garagem de Barcos', manufacturer: 'Filippi', model: 'F14 Elite' },
    { id: 'B017', tombNumber: 'SCN-2023-003', name: 'Caicó', description: 'Single Skiff Master', category: 'BOAT', status: 'GOOD', acquisitionDate: '2023-09-10', acquisitionValue: 16000, currentValue: 15000, location: 'Garagem de Barcos', manufacturer: 'Hudson', model: 'Master Single' },
    { id: 'B018', tombNumber: 'SCN-2024-001', name: 'Currais Novos', description: 'Coxless Pair Leve', category: 'BOAT', status: 'GOOD', acquisitionDate: '2024-01-25', acquisitionValue: 30000, currentValue: 29000, location: 'Garagem de Barcos', manufacturer: 'Vespoli', model: 'LW Pair' },
    { id: 'B019', tombNumber: 'SCN-2024-002', name: 'Açu', description: 'Double Sculling Leve', category: 'BOAT', status: 'GOOD', acquisitionDate: '2024-04-18', acquisitionValue: 28000, currentValue: 27500, location: 'Garagem de Barcos', manufacturer: 'Fluidesign', model: 'LW Double' },
    { id: 'B020', tombNumber: 'SCN-2024-003', name: 'Apodi', description: 'Single Skiff Treinamento Novo', category: 'BOAT', status: 'GOOD', acquisitionDate: '2024-08-05', acquisitionValue: 15000, currentValue: 15000, location: 'Garagem de Barcos', manufacturer: 'WinTech Racing', model: 'FRP Single' },
];

// Veículos (2 itens)
const vehicles: PatrimonyItem[] = [
    { id: 'V001', tombNumber: 'SCN-2018-V01', name: 'Lancha Apoio', description: 'Lancha para acompanhamento de treinos no rio', category: 'VEHICLE', status: 'GOOD', acquisitionDate: '2018-11-20', acquisitionValue: 65000, currentValue: 45000, location: 'Pier', manufacturer: 'Boston Whaler', model: '130 Super Sport', serialNumber: 'BWH-2018-45632', responsiblePerson: 'Treinador Roberto', lastMaintenanceDate: '2024-11-15', nextMaintenanceDate: '2025-05-15' },
    { id: 'V002', tombNumber: 'SCN-2020-V01', name: 'Motor de Popa Yamaha', description: 'Motor sobressalente para lancha', category: 'VEHICLE', status: 'GOOD', acquisitionDate: '2020-03-10', acquisitionValue: 12000, currentValue: 8500, location: 'Depósito', manufacturer: 'Yamaha', model: '25HP 2T', serialNumber: 'YMH-25-98765' },
];

// Eletrônicos (6 itens)
const electronics: PatrimonyItem[] = [
    { id: 'E001', tombNumber: 'SCN-2021-E01', name: 'TV Smart Sala Principal', description: 'Televisão para exibição de competições', category: 'ELECTRONICS', status: 'GOOD', acquisitionDate: '2021-12-10', acquisitionValue: 4500, currentValue: 3000, location: 'Sala Principal', manufacturer: 'Samsung', model: '55" Crystal UHD' },
    { id: 'E002', tombNumber: 'SCN-2022-E01', name: 'TV Smart Sala de Treino', description: 'Televisão para análise de vídeos', category: 'ELECTRONICS', status: 'GOOD', acquisitionDate: '2022-03-15', acquisitionValue: 3800, currentValue: 2800, location: 'Sala de Treino', manufacturer: 'LG', model: '50" 4K' },
    { id: 'E003', tombNumber: 'SCN-2023-E01', name: 'Computador Desktop', description: 'Computador para administração', category: 'ELECTRONICS', status: 'GOOD', acquisitionDate: '2023-01-20', acquisitionValue: 4200, currentValue: 3200, location: 'Secretaria', manufacturer: 'Dell', model: 'Vostro 3000' },
    { id: 'E004', tombNumber: 'SCN-2023-E02', name: 'Notebook Coach', description: 'Notebook para análise de treinos', category: 'ELECTRONICS', status: 'GOOD', acquisitionDate: '2023-06-10', acquisitionValue: 5500, currentValue: 4500, location: 'Sala do Treinador', manufacturer: 'Lenovo', model: 'ThinkPad E14' },
    { id: 'E005', tombNumber: 'SCN-2020-E01', name: 'Sistema de Som', description: 'Sistema de som para eventos', category: 'ELECTRONICS', status: 'REGULAR', acquisitionDate: '2020-08-25', acquisitionValue: 2800, currentValue: 1500, location: 'Salão de Festas', manufacturer: 'JBL', model: 'PartyBox 310' },
    { id: 'E006', tombNumber: 'SCN-2024-E01', name: 'Projetor', description: 'Projetor para apresentações e reuniões', category: 'ELECTRONICS', status: 'GOOD', acquisitionDate: '2024-02-28', acquisitionValue: 3200, currentValue: 3000, location: 'Sala de Reuniões', manufacturer: 'Epson', model: 'PowerLite X39' },
];

// Cozinha/Copa (5 itens)
const kitchen: PatrimonyItem[] = [
    { id: 'K001', tombNumber: 'SCN-2019-K01', name: 'Geladeira Duplex', description: 'Refrigerador para copa', category: 'KITCHEN', status: 'GOOD', acquisitionDate: '2019-05-18', acquisitionValue: 3200, currentValue: 1800, location: 'Copa', manufacturer: 'Electrolux', model: 'DF44' },
    { id: 'K002', tombNumber: 'SCN-2021-K01', name: 'Bebedouro Industrial', description: 'Bebedouro com filtro para atletas', category: 'KITCHEN', status: 'GOOD', acquisitionDate: '2021-02-10', acquisitionValue: 1800, currentValue: 1200, location: 'Área de Treino', manufacturer: 'Libell', model: 'Master CGA' },
    { id: 'K003', tombNumber: 'SCN-2022-K01', name: 'Bebedouro Copa', description: 'Bebedouro para uso geral', category: 'KITCHEN', status: 'GOOD', acquisitionDate: '2022-04-05', acquisitionValue: 1500, currentValue: 1100, location: 'Copa', manufacturer: 'Colormaq', model: 'Premium' },
    { id: 'K004', tombNumber: 'SCN-2020-K01', name: 'Micro-ondas', description: 'Micro-ondas para copa', category: 'KITCHEN', status: 'GOOD', acquisitionDate: '2020-07-12', acquisitionValue: 650, currentValue: 350, location: 'Copa', manufacturer: 'Panasonic', model: 'NN-ST25L' },
    { id: 'K005', tombNumber: 'SCN-2023-K01', name: 'Cafeteira Industrial', description: 'Cafeteira para eventos', category: 'KITCHEN', status: 'GOOD', acquisitionDate: '2023-03-22', acquisitionValue: 890, currentValue: 700, location: 'Copa', manufacturer: 'Marchesoni', model: 'CF.3.602' },
];

// Móveis (8 itens)
const furniture: PatrimonyItem[] = [
    { id: 'F001', tombNumber: 'SCN-2015-F01', name: 'Mesa de Reuniões', description: 'Mesa grande para reuniões de diretoria', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2015-06-20', acquisitionValue: 2500, currentValue: 1200, location: 'Sala de Reuniões' },
    { id: 'F002', tombNumber: 'SCN-2015-F02', name: 'Cadeiras de Reunião (12un)', description: 'Conjunto de 12 cadeiras estofadas', category: 'FURNITURE', status: 'REGULAR', acquisitionDate: '2015-06-20', acquisitionValue: 3600, currentValue: 1500, location: 'Sala de Reuniões', notes: '2 cadeiras com estofado danificado' },
    { id: 'F003', tombNumber: 'SCN-2018-F01', name: 'Armário de Troféus', description: 'Armário de vidro para exposição de troféus', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2018-12-05', acquisitionValue: 1800, currentValue: 1200, location: 'Sala Principal' },
    { id: 'F004', tombNumber: 'SCN-2019-F01', name: 'Mesas Área Externa (6un)', description: 'Mesas plásticas para área de convivência', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2019-09-15', acquisitionValue: 1200, currentValue: 600, location: 'Área Externa' },
    { id: 'F005', tombNumber: 'SCN-2019-F02', name: 'Cadeiras Plásticas (24un)', description: 'Cadeiras para área externa e eventos', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2019-09-15', acquisitionValue: 1920, currentValue: 800, location: 'Área Externa' },
    { id: 'F006', tombNumber: 'SCN-2021-F01', name: 'Estante da Secretaria', description: 'Estante para documentos', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2021-04-10', acquisitionValue: 850, currentValue: 550, location: 'Secretaria' },
    { id: 'F007', tombNumber: 'SCN-2022-F01', name: 'Sofá Recepção', description: 'Sofá 3 lugares para recepção', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2022-08-18', acquisitionValue: 2200, currentValue: 1600, location: 'Recepção' },
    { id: 'F008', tombNumber: 'SCN-2023-F01', name: 'Mesa da Secretaria', description: 'Mesa em L para trabalho administrativo', category: 'FURNITURE', status: 'GOOD', acquisitionDate: '2023-02-28', acquisitionValue: 1500, currentValue: 1300, location: 'Secretaria' },
];

// Equipamentos de Treino (6 itens)
const equipment: PatrimonyItem[] = [
    { id: 'EQ001', tombNumber: 'SCN-2019-EQ01', name: 'Remo Indoor Concept2', description: 'Ergômetro para treino indoor', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2019-02-15', acquisitionValue: 8500, currentValue: 5500, location: 'Sala de Treino', manufacturer: 'Concept2', model: 'Model D', serialNumber: 'C2-2019-12345' },
    { id: 'EQ002', tombNumber: 'SCN-2020-EQ01', name: 'Remo Indoor Concept2 #2', description: 'Ergômetro para treino indoor', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2020-04-20', acquisitionValue: 8500, currentValue: 6000, location: 'Sala de Treino', manufacturer: 'Concept2', model: 'Model D', serialNumber: 'C2-2020-23456' },
    { id: 'EQ003', tombNumber: 'SCN-2021-EQ01', name: 'Remo Indoor Concept2 #3', description: 'Ergômetro para treino indoor', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2021-06-10', acquisitionValue: 9000, currentValue: 7000, location: 'Sala de Treino', manufacturer: 'Concept2', model: 'Model D', serialNumber: 'C2-2021-34567' },
    { id: 'EQ004', tombNumber: 'SCN-2022-EQ01', name: 'Estação de Musculação', description: 'Estação multiuso para musculação', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2022-01-25', acquisitionValue: 12000, currentValue: 9000, location: 'Academia', manufacturer: 'Movement', model: 'W8 Pro' },
    { id: 'EQ005', tombNumber: 'SCN-2023-EQ01', name: 'Banco Supino', description: 'Banco para treino de supino', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2023-03-15', acquisitionValue: 2500, currentValue: 2200, location: 'Academia', manufacturer: 'Kikos', model: 'BF-1403' },
    { id: 'EQ006', tombNumber: 'SCN-2024-EQ01', name: 'Kit de Halteres', description: 'Conjunto de halteres 2-20kg', category: 'EQUIPMENT', status: 'GOOD', acquisitionDate: '2024-01-10', acquisitionValue: 3500, currentValue: 3400, location: 'Academia', manufacturer: 'Polimet', model: 'Kit Pro' },
];

// Segurança (4 itens)
const safety: PatrimonyItem[] = [
    { id: 'S001', tombNumber: 'SCN-2020-S01', name: 'Coletes Salva-Vidas (20un)', description: 'Coletes para segurança nos treinos', category: 'SAFETY', status: 'GOOD', acquisitionDate: '2020-01-15', acquisitionValue: 2000, currentValue: 1200, location: 'Garagem de Barcos' },
    { id: 'S002', tombNumber: 'SCN-2021-S01', name: 'Boia Salva-Vidas (4un)', description: 'Boias circulares para emergência', category: 'SAFETY', status: 'GOOD', acquisitionDate: '2021-03-20', acquisitionValue: 400, currentValue: 300, location: 'Pier' },
    { id: 'S003', tombNumber: 'SCN-2022-S01', name: 'Kit Primeiros Socorros', description: 'Kit completo de primeiros socorros', category: 'SAFETY', status: 'GOOD', acquisitionDate: '2022-02-10', acquisitionValue: 350, currentValue: 250, location: 'Secretaria', notes: 'Renovar itens vencidos' },
    { id: 'S004', tombNumber: 'SCN-2023-S01', name: 'DEA - Desfibrilador', description: 'Desfibrilador externo automático', category: 'SAFETY', status: 'GOOD', acquisitionDate: '2023-08-15', acquisitionValue: 8500, currentValue: 8000, location: 'Recepção', manufacturer: 'Philips', model: 'HeartStart HS1', serialNumber: 'DEA-2023-78901' },
];

// Ferramentas (3 itens)
const tools: PatrimonyItem[] = [
    { id: 'T001', tombNumber: 'SCN-2018-T01', name: 'Caixa de Ferramentas Completa', description: 'Kit de ferramentas para manutenção básica', category: 'TOOLS', status: 'GOOD', acquisitionDate: '2018-05-10', acquisitionValue: 800, currentValue: 400, location: 'Depósito' },
    { id: 'T002', tombNumber: 'SCN-2020-T01', name: 'Kit Manutenção de Barcos', description: 'Ferramentas específicas para manutenção de embarcações', category: 'TOOLS', status: 'GOOD', acquisitionDate: '2020-09-22', acquisitionValue: 1500, currentValue: 1000, location: 'Garagem de Barcos' },
    { id: 'T003', tombNumber: 'SCN-2022-T01', name: 'Lavadora de Alta Pressão', description: 'Lavadora para limpeza de barcos e área externa', category: 'TOOLS', status: 'GOOD', acquisitionDate: '2022-11-05', acquisitionValue: 1800, currentValue: 1400, location: 'Depósito', manufacturer: 'Karcher', model: 'K5 Premium' },
];

// Combinar todos os itens
export const MOCK_PATRIMONY: PatrimonyItem[] = [
    ...boats,
    ...vehicles,
    ...electronics,
    ...kitchen,
    ...furniture,
    ...equipment,
    ...safety,
    ...tools
];

// Funções auxiliares
export function getPatrimonyByCategory(category: PatrimonyCategory): PatrimonyItem[] {
    return MOCK_PATRIMONY.filter(item => item.category === category);
}

export function getPatrimonyById(id: string): PatrimonyItem | undefined {
    return MOCK_PATRIMONY.find(item => item.id === id);
}

export function getPatrimonyByStatus(status: PatrimonyStatus): PatrimonyItem[] {
    return MOCK_PATRIMONY.filter(item => item.status === status);
}

export function getTotalPatrimonyValue(): number {
    return MOCK_PATRIMONY.reduce((acc, item) => acc + (item.currentValue || item.acquisitionValue), 0);
}

export function getPatrimonyStats() {
    const total = MOCK_PATRIMONY.length;
    const totalValue = getTotalPatrimonyValue();
    const byCategory = Object.keys(categoryLabels).reduce((acc, cat) => {
        acc[cat as PatrimonyCategory] = getPatrimonyByCategory(cat as PatrimonyCategory).length;
        return acc;
    }, {} as Record<PatrimonyCategory, number>);
    const byStatus = Object.keys(statusLabels).reduce((acc, status) => {
        acc[status as PatrimonyStatus] = getPatrimonyByStatus(status as PatrimonyStatus).length;
        return acc;
    }, {} as Record<PatrimonyStatus, number>);

    return { total, totalValue, byCategory, byStatus };
}
