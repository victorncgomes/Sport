import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { XP_ACTIONS } from '@/lib/utils/xp-system';

// GET /api/gamification/streak - Obter streak do usuário
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Buscar treinos dos últimos 100 dias
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 100);

        const workouts = await prisma.workoutSession.findMany({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                completedAt: { gte: startDate }
            },
            orderBy: { completedAt: 'desc' },
            select: { completedAt: true }
        });

        // Calcular streak atual (dias consecutivos)
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const workoutDates = new Set(
            workouts.map(w => {
                const d = new Date(w.completedAt!);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        );

        // Verificar se treinou hoje ou ontem para manter streak
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (workoutDates.has(today.getTime()) || workoutDates.has(yesterday.getTime())) {
            // Contar dias consecutivos para trás
            let checkDate = workoutDates.has(today.getTime()) ? today : yesterday;

            while (workoutDates.has(checkDate.getTime())) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }

        // Calcular maior streak histórico
        const sortedDates = Array.from(workoutDates).sort((a, b) => b - a);
        for (let i = 0; i < sortedDates.length; i++) {
            const currentDate = sortedDates[i];
            const nextDate = sortedDates[i + 1];

            if (nextDate && currentDate - nextDate === 86400000) {
                tempStreak++;
            } else {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        // Calcular próximo milestone
        const milestones = [3, 7, 14, 30, 100];
        const nextMilestone = milestones.find(m => m > currentStreak) || null;
        const daysToNextMilestone = nextMilestone ? nextMilestone - currentStreak : null;

        // Verificar conquistas de streak
        const achievements = [];
        if (currentStreak >= 3) achievements.push({ name: 'Consistente', days: 3, xp: XP_ACTIONS.STREAK_3_DIAS });
        if (currentStreak >= 7) achievements.push({ name: 'Dedicado', days: 7, xp: XP_ACTIONS.STREAK_7_DIAS });
        if (currentStreak >= 14) achievements.push({ name: 'Comprometido', days: 14, xp: XP_ACTIONS.STREAK_14_DIAS });
        if (currentStreak >= 30) achievements.push({ name: 'Imparável', days: 30, xp: XP_ACTIONS.STREAK_30_DIAS });
        if (currentStreak >= 100) achievements.push({ name: 'Lenda', days: 100, xp: XP_ACTIONS.STREAK_100_DIAS });

        // Verificar se treinou hoje
        const trainedToday = workoutDates.has(today.getTime());

        return NextResponse.json({
            currentStreak,
            longestStreak,
            trainedToday,
            nextMilestone,
            daysToNextMilestone,
            achievements,
            totalWorkoutDays: workoutDates.size
        });

    } catch (error) {
        console.error('Error getting streak:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar streak' },
            { status: 500 }
        );
    }
}
