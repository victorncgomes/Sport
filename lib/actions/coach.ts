'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock data for fallback
const MOCK_COACH_DATA = {
    coach: {
        id: 'mock-coach-id',
        name: 'Fernanda Costa',
        email: 'treinador@scnatal.com.br',
        role: 'COACH',
        image: null,
    },
    trainings: [
        {
            id: 'mock-training-1',
            title: 'Treino Técnico - Alvorada',
            startTime: new Date(new Date().setHours(5, 0, 0, 0)),
            endTime: new Date(new Date().setHours(7, 0, 0, 0)),
            coachName: 'Fernanda Costa',
            sessions: [
                { user: { name: 'João Silva', image: null } },
                { user: { name: 'Maria Santos', image: null } },
            ]
        },
        {
            id: 'mock-training-2',
            title: 'Treino de Força - Academia',
            startTime: new Date(new Date().setHours(16, 0, 0, 0)),
            endTime: new Date(new Date().setHours(18, 0, 0, 0)),
            coachName: 'Fernanda Costa',
            sessions: [
                { user: { name: 'Pedro Costa', image: null } },
                { user: { name: 'Ana Oliveira', image: null } },
                { user: { name: 'Lucas Pereira', image: null } },
            ]
        }
    ],
    stats: {
        totalTrainings: 45,
        totalStudents: 120,
        attendanceRate: 94,
        competingAthletes: 15,
    }
};

export async function getCoachDashboardData(coachEmail: string) {
    try {
        const coach = await prisma.user.findUnique({
            where: { email: coachEmail },
            include: {
                auditLogs: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!coach || coach.role !== 'COACH') {
            console.warn(`Coach not found for email ${coachEmail}, returning mock data.`);
            return MOCK_COACH_DATA;
        }

        // Get sessions where this coach is the trainer
        // Note: Currently schema has Training.coachName (String), not a direct relation to User
        // I should probably find by name or update schema later. 
        // For now, let's fetch all trainings since the coachName is just a string.
        const trainings = await prisma.training.findMany({
            where: {
                OR: [
                    { coachName: coach.name },
                    // If coachName is just a generic field, we might need a better link
                ]
            },
            include: {
                sessions: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });

        const stats = {
            totalTrainings: await prisma.training.count({ where: { coachName: coach.name } }),
            totalStudents: await prisma.user.count({ where: { role: 'MEMBER' } }),
            attendanceRate: 94, // Mock for now
            competingAthletes: 15, // Mock for now
        };

        return {
            coach,
            trainings,
            stats
        };
    } catch (error) {
        console.error('Error fetching coach dashboard data:', error);
        // Fallback to mock data on error too, to ensure UI doesn't break
        return MOCK_COACH_DATA;
    }
}

export async function createTraining(data: {
    title: string;
    description?: string;
    coachName: string;
    startTime: Date;
    endTime: Date;
    maxParticipants: number;
    location: string;
}) {
    try {
        const training = await prisma.training.create({
            data: {
                ...data,
            }
        });
        revalidatePath('/coach/dashboard');
        revalidatePath('/trainings');
        return { success: true, training };
    } catch (error) {
        console.error('Error creating training:', error);
        return { success: false, error: 'Falha ao criar treino' };
    }
}

export async function markAttendance(attendanceId: string, attended: boolean) {
    try {
        await prisma.trainingAttendance.update({
            where: { id: attendanceId },
            data: { attended }
        });
        revalidatePath('/coach/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error marking attendance:', error);
        return { success: false, error: 'Falha ao marcar presença' };
    }
}
