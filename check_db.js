const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const data = await prisma.tideData.findMany({
        take: 5,
        orderBy: { date: 'asc' }
    });
    console.log('TideData samples:', JSON.stringify(data, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
