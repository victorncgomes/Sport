
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getInventoryItems() {
    try {
        const items = await prisma.inventoryItem.findMany({
            orderBy: { name: 'asc' }
        });
        return items;
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        return [];
    }
}

export async function updateInventoryStatus(itemId: string, status: string) {
    try {
        await prisma.inventoryItem.update({
            where: { id: itemId },
            data: {
                status,
                lastInspection: status === 'OPERATIONAL' ? new Date() : undefined
            }
        });
        revalidatePath('/admin/inventory');
        return { success: true };
    } catch (error) {
        console.error('Error updating inventory status:', error);
        return { success: false };
    }
}

export async function addInventoryItem(data: { name: string, type: string, description?: string, serialNumber?: string }) {
    try {
        const item = await prisma.inventoryItem.create({
            data: {
                ...data,
                status: 'OPERATIONAL'
            }
        });
        revalidatePath('/admin/inventory');
        return item;
    } catch (error) {
        console.error('Error adding inventory item:', error);
        return null;
    }
}
