
'use server';

import { prisma } from '@/lib/db';

export async function getSocialRanking() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                points: true,
                level: true,
                badges: {
                    include: { badge: true }
                },
                performanceRecords: {
                    select: {
                        metric: true,
                        value: true
                    }
                }
            },
            orderBy: { points: 'desc' },
            take: 20
        });

        // Map and aggregate data for the UI
        return users.map(user => {
            const meters = user.performanceRecords
                .filter(r => r.metric === 'METERS_ROWED')
                .reduce((sum, r) => sum + r.value, 0);

            const attendance = user.performanceRecords
                .filter(r => r.metric === 'ATTENDANCE')
                .length * 10; // Simple mock calculation: each record = 10%

            return {
                ...user,
                totalXP: user.points,
                socialPoints: Math.floor(user.points * 0.4), // Mock social points
                meters: meters || 0,
                attendance: Math.min(attendance || 0, 100),
                category: user.level > 5 ? 'Elite' : user.level > 2 ? 'Master' : 'Base',
                trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.7 ? 'down' : 'stable'
            };
        });
    } catch (error) {
        console.error('Error fetching social ranking:', error);
        return [];
    }
}

export async function getAthletePerformance(userId: string) {
    try {
        const records = await prisma.performanceRecord.findMany({
            where: { userId },
            orderBy: { date: 'asc' }
        });
        return records;
    } catch (error) {
        console.error('Error fetching performance records:', error);
        return [];
    }
}
