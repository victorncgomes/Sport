import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { suggestBoats, canUserReserveBoat, BoatCategory } from '@/lib/utils/boat-suggestion';

// GET /api/garage/suggest - Obter sugestões de barcos para o usuário
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                workoutSessions: {
                    where: { status: 'COMPLETED' },
                    select: { mode: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Buscar recursos disponíveis
        const resources = await prisma.resource.findMany({
            where: {
                type: 'BOAT',
                status: 'AVAILABLE'
            }
        });

        // Contar treinos por tipo
        const outdoorWorkouts = user.workoutSessions.filter(s => s.mode === 'OUTDOOR').length;
        const tankWorkouts = user.workoutSessions.filter(s => s.mode === 'INDOOR_TANK').length;

        // Preparar perfil do usuário
        const userProfile = {
            id: user.id,
            level: user.level,
            totalOutdoorWorkouts: outdoorWorkouts,
            totalTankWorkouts: tankWorkouts,
            preferredBoatCategories: undefined, // Pode ser adicionado nas preferências do usuário
            lastBoatUsed: undefined
        };

        // Preparar informações dos recursos
        const resourceInfos = resources.map(r => ({
            id: r.id,
            name: r.name,
            category: (r.category || '1x') as BoatCategory,
            status: r.status as 'AVAILABLE',
            usageCount: r.usageCount,
            lastMaintenanceAt: r.lastMaintenanceAt ?? undefined,
            nextMaintenanceAt: r.nextMaintenanceAt ?? undefined
        }));

        // Obter sugestões
        const suggestions = suggestBoats(userProfile, resourceInfos);

        return NextResponse.json({
            suggestions,
            userStats: {
                level: user.level,
                outdoorWorkouts,
                tankWorkouts
            }
        });
    } catch (error) {
        console.error('Error getting boat suggestions:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// POST /api/garage/suggest - Verificar se pode reservar um barco específico
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                workoutSessions: {
                    where: { status: 'COMPLETED' },
                    select: { mode: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const { boatCategory } = body;

        // Contar treinos
        const outdoorWorkouts = user.workoutSessions.filter(s => s.mode === 'OUTDOOR').length;
        const tankWorkouts = user.workoutSessions.filter(s => s.mode === 'INDOOR_TANK').length;

        const userProfile = {
            id: user.id,
            level: user.level,
            totalOutdoorWorkouts: outdoorWorkouts,
            totalTankWorkouts: tankWorkouts
        };

        const result = canUserReserveBoat(userProfile, boatCategory);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error checking boat eligibility:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
