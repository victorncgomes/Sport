import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { convertToTideDay, saveTideDataToDatabase } from '@/lib/api/tides';

interface TideCSVRow {
    date: string;
    highTide1Time?: string;
    highTide1Height?: number;
    lowTide1Time?: string;
    lowTide1Height?: number;
    highTide2Time?: string;
    highTide2Height?: number;
    lowTide2Time?: string;
    lowTide2Height?: number;
}

export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json() as { data: TideCSVRow[] };

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        // Convert and save each day
        for (const row of data) {
            const tideDay = convertToTideDay(row);
            await saveTideDataToDatabase(tideDay);
        }

        return NextResponse.json({
            success: true,
            count: data.length,
            message: `${data.length} dias de dados salvos com sucesso`
        });
    } catch (error) {
        console.error('Error uploading tide data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch saved tide data
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');

        const tideData = await prisma.tideData.findMany({
            where: {
                date: {
                    gte: new Date(),
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: days
        });

        return NextResponse.json(tideData);
    } catch (error) {
        console.error('Error fetching tide data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
