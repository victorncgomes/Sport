
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getClubEvents() {
    try {
        const events = await prisma.clubEvent.findMany({
            include: {
                _count: {
                    select: { rsvps: true }
                }
            },
            orderBy: { date: 'asc' }
        });
        return events;
    } catch (error) {
        console.error('Error fetching club events:', error);
        return [];
    }
}

export async function toggleRSVP(eventId: string, userId: string) {
    try {
        const existing = await prisma.eventRSVP.findUnique({
            where: {
                eventId_userId: { eventId, userId }
            }
        });

        if (existing) {
            await prisma.eventRSVP.delete({
                where: { id: existing.id }
            });
        } else {
            await prisma.eventRSVP.create({
                data: { eventId, userId }
            });
        }

        revalidatePath('/events');
        return { success: true };
    } catch (error) {
        console.error('Error toggling RSVP:', error);
        return { success: false };
    }
}
