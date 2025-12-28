
export interface TechnicalAsset {
    id: string;
    name: string;
    category: 'Remo' | 'Ergômetro' | 'Colete' | 'Acessório';
    status: 'ok' | 'maintenance' | 'broken';
    usageHours: number;
    lastInspection: string;
    nextMaintenance: string;
    assignedTo?: string;
}

export const technicalInventory: TechnicalAsset[] = [
    {
        id: 'REM-001',
        name: 'Par de Remos Croker M4',
        category: 'Remo',
        status: 'ok',
        usageHours: 120,
        lastInspection: '2024-12-01',
        nextMaintenance: '2025-03-01'
    },
    {
        id: 'REM-002',
        name: 'Par de Remos Croker M4',
        category: 'Remo',
        status: 'maintenance',
        usageHours: 250,
        lastInspection: '2024-11-15',
        nextMaintenance: '2024-12-20'
    },
    {
        id: 'ERG-001',
        name: 'Concept2 Model D #1',
        category: 'Ergômetro',
        status: 'ok',
        usageHours: 1540,
        lastInspection: '2024-12-10',
        nextMaintenance: '2025-01-10'
    },
    {
        id: 'COL-015',
        name: 'Colete Salva-vidas Neoprene G',
        category: 'Colete',
        status: 'ok',
        usageHours: 45,
        lastInspection: '2024-10-20',
        nextMaintenance: '2025-04-20'
    }
];
