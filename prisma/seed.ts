import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados (SQLite)...')

    // Limpar dados existentes
    await prisma.userSocialAction.deleteMany()
    await prisma.socialAction.deleteMany()
    await prisma.performanceRecord.deleteMany()
    await prisma.eventRSVP.deleteMany()
    await prisma.clubEvent.deleteMany()
    await prisma.inventoryItem.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.user.deleteMany()

    // Criar tipos de membership
    const membershipTypes = await Promise.all([
        prisma.membershipType.create({
            data: {
                name: 'Sócio Atleta',
                description: 'Acesso completo a treinos e barcos',
                monthlyFee: 150.00,
                benefits: JSON.stringify(['Treinos ilimitados', 'Reserva de barcos', 'Participação em competições']),
            },
        }),
        prisma.membershipType.create({
            data: {
                name: 'Sócio Recreativo',
                description: 'Acesso recreativo aos barcos',
                monthlyFee: 80.00,
                benefits: JSON.stringify(['Reserva de barcos', 'Acesso ao clube']),
            },
        }),
    ])

    // Criar usuários
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const hashedPasswordMember = await bcrypt.hash('member123', 10)
    const hashedPasswordCoach = await bcrypt.hash('coach123', 10)

    const admin = await prisma.user.create({
        data: {
            name: 'Administrador',
            email: 'admin@scnatal.com.br',
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    })

    const coach = await prisma.user.create({
        data: {
            name: 'Carlos Treinador',
            email: 'treinador@scnatal.com.br',
            password: hashedPasswordCoach,
            role: 'COACH',
            emailVerified: new Date(),
        },
    })

    const member1 = await prisma.user.create({
        data: {
            name: 'João Silva',
            email: 'socio1@email.com',
            password: hashedPasswordMember,
            role: 'MEMBER',
            emailVerified: new Date(),
            membership: {
                create: {
                    membershipTypeId: membershipTypes[0].id,
                    status: 'ACTIVE',
                    memberNumber: 'SCN-2024-001',
                    qrCode: 'QR-SCN-2024-001',
                },
            },
            points: 1250,
            level: 3,
        },
    })

    console.log('✅ Usuários criados')

    // Criar barcos
    await Promise.all([
        prisma.boat.create({
            data: {
                name: 'Potengi I',
                type: 'SINGLE',
                status: 'AVAILABLE',
                capacity: 1,
                description: 'Barco single para treino individual',
                serialNumber: 'BOAT-001',
            },
        }),
        prisma.boat.create({
            data: {
                name: 'Potengi II',
                type: 'DOUBLE',
                status: 'AVAILABLE',
                capacity: 2,
                description: 'Barco double para duplas',
                serialNumber: 'BOAT-002',
            },
        }),
        prisma.boat.create({
            data: {
                name: 'Natal',
                type: 'QUAD',
                status: 'AVAILABLE',
                capacity: 4,
                description: 'Barco quad para equipes',
                serialNumber: 'BOAT-003',
            },
        }),
    ])

    console.log('✅ Barcos criados')

    // Gamification Badges
    const badgeFirstRow = await prisma.badge.create({
        data: {
            name: 'Primeira Remada',
            description: 'Completou o primeiro treino',
            imageUrl: 'https://placehold.co/100x100?text=Badge1',
            condition: '1 treino',
        }
    })

    const badgeCompetitor = await prisma.badge.create({
        data: {
            name: 'Competidor Nato',
            description: 'Participou de 3 competições',
            imageUrl: 'https://placehold.co/100x100?text=Badge2',
            condition: '3 competições',
        }
    })

    await prisma.userBadge.create({
        data: {
            userId: member1.id,
            badgeId: badgeFirstRow.id,
        }
    })

    console.log('✅ Badges criados')

    // Store - Categorias
    const catUniforms = await prisma.category.create({
        data: { name: 'Uniformes', description: 'Roupas oficiais do clube' }
    })
    const catAccessories = await prisma.category.create({
        data: { name: 'Acessórios', description: 'Bonés, garrafas, etc' }
    })

    // Store - Produtos
    await prisma.product.create({
        data: {
            name: 'Camisa Oficial 2025',
            description: 'Camisa de competição oficial, tecido tecnológico.',
            price: 120.00,
            stock: 50,
            categoryId: catUniforms.id,
            images: JSON.stringify(['https://placehold.co/400x400?text=Camisa']),
        }
    })
    await prisma.product.create({
        data: {
            name: 'Boné SCN',
            description: 'Boné bordado com o brasão.',
            price: 60.00,
            stock: 30,
            categoryId: catAccessories.id,
            images: JSON.stringify(['https://placehold.co/400x400?text=Bone']),
        }
    })

    console.log('✅ Loja populada')

    // Mais produtos
    await prisma.product.create({
        data: {
            name: 'Unisuit Elite Pro',
            description: 'Macacão de competição profissional, aerodinâmico.',
            price: 280.00,
            stock: 15,
            categoryId: catUniforms.id,
            images: JSON.stringify(['https://placehold.co/400x400?text=Unisuit']),
        }
    })
    await prisma.product.create({
        data: {
            name: 'Garrafa Térmica SCN',
            description: 'Garrafa térmica 750ml com logo do clube.',
            price: 45.00,
            stock: 40,
            categoryId: catAccessories.id,
            images: JSON.stringify(['https://placehold.co/400x400?text=Garrafa']),
        }
    })

    console.log('✅ Produtos adicionais criados')

    // Notificações
    await prisma.notification.createMany({
        data: [
            { userId: member1.id, title: 'Treino de Remo Confirmado', message: 'Seu treino para amanhã às 06:00 foi confirmado.', type: 'SUCCESS' },
            { userId: member1.id, title: 'Mensalidade Pendente', message: 'Sua mensalidade de Janeiro vence em breve.', type: 'WARNING' },
            { userId: member1.id, title: 'Aviso da Diretoria', message: 'Nova AGO agendada para o próximo mês.', type: 'INFO', link: '/events' }
        ]
    })

    // Inventário Técnico
    await prisma.inventoryItem.createMany({
        data: [
            { name: 'Remo Carbono Pro', type: 'Oar', status: 'OPERATIONAL', usageHours: 120, serialNumber: 'RE-001' },
            { name: 'Ergômetro Concept2 #1', type: 'Ergometer', status: 'MAINTENANCE', usageHours: 1450, serialNumber: 'ER-001' },
            { name: 'Colete Náutico XP', type: 'Lifevest', status: 'OPERATIONAL', usageHours: 45, serialNumber: 'LV-001' }
        ]
    })

    // Eventos do Clube
    const event1 = await prisma.clubEvent.create({
        data: {
            title: 'Feijoada do Centenário',
            description: 'Grande confraternização de aniversário do clube.',
            date: new Date(2025, 3, 7),
            location: 'Sede Social SCN',
            type: 'SOCIAL'
        }
    })

    // Ranking & Performance
    await prisma.performanceRecord.createMany({
        data: [
            { userId: member1.id, metric: 'METERS_ROWED', value: 5000 },
            { userId: member1.id, metric: 'METERS_ROWED', value: 7500 },
            { userId: member1.id, metric: 'ATTENDANCE', value: 1 }
        ]
    })

    const socialAction = await prisma.socialAction.create({
        data: {
            title: 'Limpeza do Rio Potengi',
            description: 'Mutirão para limpeza das margens do rio.',
            points: 500,
            type: 'VOLUNTEER'
        }
    })

    await prisma.userSocialAction.create({
        data: {
            userId: member1.id,
            socialActionId: socialAction.id
        }
    })

    console.log('🎉 Seed concluído com sucesso!')
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
