/**
 * Regras de Recursos - Sport Club de Natal
 * Validações para reserva de barcos e tanque
 */

import { prisma } from '@/lib/db';

interface CanReserveResult {
    allowed: boolean;
    reason?: string;
    progress?: {
        current: number;
        required: number;
    };
}

/**
 * Verifica se o usuário pode reservar o tanque
 * REGRA: Precisa ter completado 5 treinos no tanque antes de poder reservá-lo
 */
export async function canReserveTank(userId: string): Promise<CanReserveResult> {
    const REQUIRED_TANK_WORKOUTS = 5;

    try {
        // Contar treinos INDOOR_TANK concluídos pelo usuário
        const tankWorkouts = await prisma.workoutSession.count({
            where: {
                userId,
                mode: 'INDOOR_TANK',
                status: 'COMPLETED'
            }
        });

        if (tankWorkouts < REQUIRED_TANK_WORKOUTS) {
            return {
                allowed: false,
                reason: `Você precisa completar ${REQUIRED_TANK_WORKOUTS} treinos no tanque antes de poder reservá-lo. Você tem ${tankWorkouts} treino(s) concluído(s).`,
                progress: {
                    current: tankWorkouts,
                    required: REQUIRED_TANK_WORKOUTS
                }
            };
        }

        return {
            allowed: true,
            progress: {
                current: tankWorkouts,
                required: REQUIRED_TANK_WORKOUTS
            }
        };
    } catch (error) {
        console.error('Erro ao verificar elegibilidade para tanque:', error);
        // Em caso de erro, permitir (fail-open) mas logar
        return { allowed: true };
    }
}

/**
 * Verifica se há conflito de horário para uma reserva
 */
export async function checkReservationConflict(
    resourceId: string,
    startAt: Date,
    expectedEndAt: Date,
    excludeReservationId?: string
): Promise<{ hasConflict: boolean; conflictingReservation?: any }> {
    try {
        const whereClause: any = {
            resourceId,
            status: { in: ['CONFIRMED', 'IN_USE', 'PENDING'] },
            OR: [
                // Nova reserva começa durante reserva existente
                {
                    startAt: { lte: startAt },
                    expectedEndAt: { gt: startAt }
                },
                // Nova reserva termina durante reserva existente
                {
                    startAt: { lt: expectedEndAt },
                    expectedEndAt: { gte: expectedEndAt }
                },
                // Nova reserva engloba reserva existente
                {
                    startAt: { gte: startAt },
                    expectedEndAt: { lte: expectedEndAt }
                }
            ]
        };

        // Excluir a própria reserva se estiver editando
        if (excludeReservationId) {
            whereClause.id = { not: excludeReservationId };
        }

        const conflictingReservation = await prisma.reservation.findFirst({
            where: whereClause,
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        return {
            hasConflict: !!conflictingReservation,
            conflictingReservation
        };
    } catch (error) {
        console.error('Erro ao verificar conflito de reserva:', error);
        return { hasConflict: false };
    }
}

/**
 * Verifica todas as regras para reservar um recurso
 */
export async function canReserveResource(
    resourceId: string,
    userId: string,
    startAt: Date,
    expectedEndAt: Date
): Promise<CanReserveResult> {
    try {
        // Buscar recurso com regras
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId }
        });

        if (!resource) {
            return { allowed: false, reason: 'Recurso não encontrado' };
        }

        // Verificar status do recurso
        if (resource.status === 'MAINTENANCE') {
            return { allowed: false, reason: 'Recurso em manutenção' };
        }

        if (resource.status === 'BLOCKED') {
            return { allowed: false, reason: 'Recurso bloqueado' };
        }

        // Regra especial para TANQUE
        if (resource.type === 'TANK') {
            const tankCheck = await canReserveTank(userId);
            if (!tankCheck.allowed) {
                return tankCheck;
            }
        }

        // Verificar conflito de horário
        const conflictCheck = await checkReservationConflict(
            resourceId,
            startAt,
            expectedEndAt
        );

        if (conflictCheck.hasConflict) {
            const conflicting = conflictCheck.conflictingReservation;
            return {
                allowed: false,
                reason: `Recurso já reservado neste horário por ${conflicting?.user?.name || 'outro usuário'}`
            };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Erro ao verificar reserva:', error);
        return { allowed: false, reason: 'Erro ao verificar disponibilidade' };
    }
}

/**
 * Calcula pontos para check-out de reserva
 */
export function calculateCheckoutPoints(checklist: {
    stored: boolean;
    washed: boolean;
    onTime: boolean;
    damageReported: boolean;
}): number {
    let points = 0;

    // Guardou barco: +5
    if (checklist.stored) points += 5;

    // Lavou barco: +5
    if (checklist.washed) points += 5;

    // Devolveu no prazo: +3
    if (checklist.onTime) points += 3;

    // Reportou avaria (se houver): +3
    if (checklist.damageReported) points += 3;

    return points;
}

/**
 * Calcula penalidades por problemas na devolução
 */
export function calculateCheckoutPenalties(issues: {
    notStored: boolean;
    notWashed: boolean;
    overdueMinutes: number;
}): number {
    let penalty = 0;

    // Não guardou: -5
    if (issues.notStored) penalty += 5;

    // Não lavou: -5
    if (issues.notWashed) penalty += 5;

    // Atraso: -5 a cada 30 minutos
    if (issues.overdueMinutes > 0) {
        penalty += Math.floor(issues.overdueMinutes / 30) * 5;
    }

    return penalty;
}
