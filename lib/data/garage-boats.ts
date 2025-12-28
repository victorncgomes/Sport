export type BoatStatus = 'available' | 'in-use' | 'maintenance' | 'reserved';
export type BoatType = '1x' | '2-' | '2x' | '4-' | '4x' | '8+';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface Boat {
    id: string;
    name: string;
    type: BoatType;
    category: string; // e.g., "Single Skiff", "Double Skiff"
    status: BoatStatus;
    skillLevel: SkillLevel;
    capacity: number;
    manufacturer: string;
    year: number;
    image: string;
    lastMaintenance?: string;
}

export const garageBoats: Boat[] = [
    {
        id: '1',
        name: 'Rio Potengi',
        type: '1x',
        category: 'Single Skiff',
        status: 'available',
        skillLevel: 'intermediate',
        capacity: 1,
        manufacturer: 'Empacher',
        year: 2022,
        image: '/images/boats/single-1.jpg'
    },
    {
        id: '2',
        name: 'Forte dos Reis Magos',
        type: '1x',
        category: 'Single Skiff',
        status: 'in-use',
        skillLevel: 'advanced',
        capacity: 1,
        manufacturer: 'Filippi',
        year: 2023,
        image: '/images/boats/single-2.jpg'
    },
    {
        id: '3',
        name: 'Dunas de Genipabu',
        type: '2x',
        category: 'Double Skiff',
        status: 'available',
        skillLevel: 'beginner',
        capacity: 2,
        manufacturer: 'WinTech',
        year: 2020,
        image: '/images/boats/double-1.jpg'
    },
    {
        id: '4',
        name: 'Ponta Negra',
        type: '4-',
        category: 'Quatro Sem',
        status: 'maintenance',
        skillLevel: 'elite',
        capacity: 4,
        manufacturer: 'Hudson',
        year: 2019,
        image: '/images/boats/four-1.jpg',
        lastMaintenance: '2024-05-15'
    },
    {
        id: '5',
        name: 'Natal 400 Anos',
        type: '8+',
        category: 'Oito Com',
        status: 'reserved',
        skillLevel: 'elite',
        capacity: 9, // 8 remadores + 1 timoneiro
        manufacturer: 'Empacher',
        year: 2021,
        image: '/images/boats/eight-1.jpg'
    },
    {
        id: '6',
        name: 'Morro do Careca',
        type: '1x',
        category: 'Single Skiff',
        status: 'available',
        skillLevel: 'beginner',
        capacity: 1,
        manufacturer: 'WinTech',
        year: 2018,
        image: '/images/boats/single-3.jpg'
    },
    {
        id: '7',
        name: 'Cajueiro',
        type: '2-',
        category: 'Dois Sem',
        status: 'available',
        skillLevel: 'advanced',
        capacity: 2,
        manufacturer: 'Filippi',
        year: 2022,
        image: '/images/boats/pair-1.jpg'
    },
    {
        id: '8',
        name: 'Redinha',
        type: '1x',
        category: 'Single Skiff',
        status: 'maintenance',
        skillLevel: 'intermediate',
        capacity: 1,
        manufacturer: 'Pei Sheng',
        year: 2017,
        image: '/images/boats/single-4.jpg',
        lastMaintenance: '2024-05-18'
    }
];
