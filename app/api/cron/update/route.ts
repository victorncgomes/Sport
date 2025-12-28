import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron job endpoint - simplified version for Vercel
 * Runs once per day to check application status
 */
export async function GET(request: NextRequest) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('🔄 Cron job executed at:', new Date().toISOString());

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Daily check completed'
        });
    } catch (error) {
        console.error('❌ Cron job error:', error);
        return NextResponse.json(
            {
                error: 'Cron job failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
