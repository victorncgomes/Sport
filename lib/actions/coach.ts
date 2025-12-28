'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
            throw new Error('Coach not found');
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
        return null;
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
