import { NextRequest, NextResponse } from 'next/server';
import { runAllBackgroundJobs } from '@/lib/jobs/background-jobs';

// API para executar background jobs manualmente (ou via cron)
export async function POST(request: NextRequest) {
    try {
        // Verificar autenticação (apenas ADMIN)
        // const session = await auth();
        // if (!session || session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // Verificar secret key para cron jobs
        const { searchParams } = new URL(request.url);
        const cronSecret = searchParams.get('secret');

        // Em produção, verificar a secret key
        // if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        //     return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
        // }

        const results = await runAllBackgroundJobs();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            results
        });
    } catch (error) {
        console.error('❌ Erro nos background jobs:', error);
        return NextResponse.json(
            { error: 'Erro ao executar background jobs' },
            { status: 500 }
        );
    }
}

// GET para verificar status dos jobs
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        jobs: [
            'checkOverdueReservations',
            'calculateVolunteerReputation',
            'sendNotificationReminders',
            'autoUnlockBadges',
            'updateLeaderboardCache',
            'checkOverduePayments'
        ],
        lastRun: null, // Em produção, armazenar isso no banco
        nextRun: null
    });
}
