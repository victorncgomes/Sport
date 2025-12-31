import { NextResponse } from 'next/server';
import { BOARD_MEMBERS } from '@/lib/data/simulated-board-members';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let users = BOARD_MEMBERS;

        if (role) {
            users = users.filter(u => u.role === role);
        }

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
