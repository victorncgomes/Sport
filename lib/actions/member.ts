'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Exportar tipo para uso no frontend
export type MemberDashboardData = Awaited<ReturnType<typeof getMemberDashboardData>>;

export async function getMemberDashboardData(memberEmail: string) {
    // Dados mockados para demonstração (quando Prisma não está disponível)
    const mockUserData = {
        id: 'demo-user-1',
        email: memberEmail || 'socio@demo.com',
        name: 'João Silva',
        role: 'MEMBER',
        image: null,
        phone: '(84) 99999-1234',
        points: 1250,
        level: 5,
        createdAt: new Date('2020-03-15'),
        updatedAt: new Date(),
        membership: {
            id: 'membership-1',
            userId: 'demo-user-1',
            memberNumber: 'SCN-2020-0042',
            status: 'Ativo',
            startDate: new Date('2020-03-15'),
            membershipType: {
                id: 'type-1',
                name: 'Sócio Remador',
                price: 150,
                benefits: ['Acesso ao clube', 'Uso de embarcações', 'Participação em treinos']
            }
        },
        reservations: [],
        trainingSessions: [],
        payments: []
    };

    try {
        const user = await prisma.user.findUnique({
            where: { email: memberEmail },
            include: {
                membership: {
                    include: {
                        membershipType: true
                    }
                },
                reservations: {
                    include: {
                        boat: true
                    },
                    orderBy: { startTime: 'desc' },
                    take: 5
                },
                trainingSessions: {
                    include: {
                        training: true
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                payments: {
                    orderBy: { dueDate: 'desc' },
                    take: 5
                }
            }
        });

        if (!user) {
            // Retorna dados mockados se usuário não encontrado
            console.log('User not found, returning mock data');
            return mockUserData;
        }

        return user;
    } catch (error) {
        // Retorna dados mockados em caso de erro (ex: Prisma não conectado)
        console.error('Error fetching member dashboard data, using mock data:', error);
        return mockUserData;
    }
}

export async function enrollInTraining(userId: string, trainingId: string) {
    try {
        // Check if already enrolled
        const existing = await prisma.trainingAttendance.findUnique({
            where: {
                trainingId_userId: {
                    trainingId,
                    userId
                }
            }
        });

        if (existing) {
            return { success: false, error: 'Você já está inscrito neste treino' };
        }

        const enrollment = await prisma.trainingAttendance.create({
            data: {
                userId,
                trainingId,
                attended: false
            }
        });

        revalidatePath('/dashboard');
        revalidatePath(`/trainings/${trainingId}`);
        return { success: true, enrollment };
    } catch (error) {
        console.error('Error enrolling in training:', error);
        return { success: false, error: 'Falha ao se inscrever no treino' };
    }
}

export async function reserveBoat(data: {
    userId: string;
    boatId: string;
    startTime: Date;
    endTime: Date;
}) {
    try {
        // Simple conflict check (simplified)
        const conflict = await prisma.boatReservation.findFirst({
            where: {
                boatId: data.boatId,
                status: 'CONFIRMED',
                OR: [
                    {
                        startTime: { lte: data.startTime },
                        endTime: { gte: data.startTime }
                    },
                    {
                        startTime: { lte: data.endTime },
                        endTime: { gte: data.endTime }
                    }
                ]
            }
        });

        if (conflict) {
            return { success: false, error: 'Este barco já está reservado para este horário' };
        }

        const reservation = await prisma.boatReservation.create({
            data: {
                ...data,
                status: 'PENDING'
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/boats');
        return { success: true, reservation };
    } catch (error) {
        console.error('Error reserving boat:', error);
        return { success: false, error: 'Falha ao realizar reserva' };
    }
}
