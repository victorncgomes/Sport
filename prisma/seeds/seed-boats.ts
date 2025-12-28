import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBoats() {
    console.log('🚤 Seeding boats...');

    const boats = [
        {
            name: 'Single 1',
            type: 'SINGLE',
            status: 'AVAILABLE',
            capacity: 1,
            description: 'Barco individual de alta performance para remadores experientes',
            serialNumber: 'SCN-S1-001'
        },
        {
            name: 'Single 2',
            type: 'SINGLE',
            status: 'AVAILABLE',
            capacity: 1,
            description: 'Barco individual para treinos técnicos',
            serialNumber: 'SCN-S1-002'
        },
        {
            name: 'Double 1',
            type: 'DOUBLE',
            status: 'AVAILABLE',
            capacity: 2,
            description: 'Barco duplo sem timoneiro',
            serialNumber: 'SCN-D2-001'
        },
        {
            name: 'Double 2',
            type: 'DOUBLE',
            status: 'MAINTENANCE',
            capacity: 2,
            description: 'Barco duplo em manutenção',
            serialNumber: 'SCN-D2-002'
        },
        {
            name: 'Quad 1',
            type: 'QUAD',
            status: 'AVAILABLE',
            capacity: 4,
            description: 'Barco quádruplo com timoneiro',
            serialNumber: 'SCN-Q4-001'
        },
        {
            name: 'Quad 2',
            type: 'QUAD',
            status: 'AVAILABLE',
            capacity: 4,
            description: 'Barco quádruplo para treinamento',
            serialNumber: 'SCN-Q4-002'
        },
        {
            name: 'Eight 1',
            type: 'EIGHT',
            status: 'AVAILABLE',
            capacity: 8,
            description: 'Barco oito com timoneiro',
            serialNumber: 'SCN-E8-001'
        }
    ];

    for (const boat of boats) {
        await prisma.boat.upsert({
            where: { serialNumber: boat.serialNumber },
            update: boat,
            create: boat,
        });
        console.log(`  ✓ ${boat.name} (${boat.type})`);
    }

    console.log('✅ Boats seeded successfully!');
}

async function main() {
    try {
        await seedBoats();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
