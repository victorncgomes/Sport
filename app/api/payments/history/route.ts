import { NextResponse } from 'next/server';
import { SIMULATED_PAYMENTS, UPCOMING_PAYMENTS } from '@/lib/data/simulated-payments';

export async function GET() {
    try {
        return NextResponse.json({
            history: SIMULATED_PAYMENTS,
            upcoming: UPCOMING_PAYMENTS,
            total: SIMULATED_PAYMENTS.reduce((sum, p) => sum + p.amount, 0)
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment history' },
            { status: 500 }
        );
    }
}
