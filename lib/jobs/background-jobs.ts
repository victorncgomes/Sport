// Background Jobs - Sport Club de Natal
// Serviços que rodam em background para manutenção do sistema

import { prisma } from '@/lib/db';
import { POINT_RULES, getLevelByPoints, BADGES } from '@/lib/gamification/levels';

// Job 1: Verificar reservas atrasadas (Overdue Checker)
export async function checkOverdueReservations() {
    const now = new Date();

    // Buscar reservas que deveriam ter terminado mas não fizeram check-out
    const overdueReservations = await prisma.reservation.findMany({
        where: {
            status: 'CHECKED_IN',
            endTime: {
                lt: now
            }
        },
        include: {
            user: true,
            resource: true
        }
    });

    for (const reservation of overdueReservations) {
        // Marcar como atrasada
        await prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: 'OVERDUE' }
        });

        // Criar notificação
        await prisma.notification.create({
            data: {
                userId: reservation.userId,
                type: 'RESERVATION_OVERDUE',
                title: 'Reserva Atrasada',
                message: `Sua reserva do ${reservation.resource.name} está atrasada. Por favor, faça o check-out.`,
                read: false
            }
        });

        // Penalidade de pontos (opcional)
        // await prisma.user.update({
        //     where: { id: reservation.userId },
        //     data: { points: { decrement: 5 } }
        // });
    }

    return { processed: overdueReservations.length };
}

// Job 2: Calcular reputação de voluntários
export async function calculateVolunteerReputation() {
    const volunteers = await prisma.user.findMany({
        where: {
            volunteerTasks: {
                some: {
                    status: 'COMPLETED'
                }
            }
        },
        include: {
            volunteerTasks: {
                where: { status: 'COMPLETED' }
            }
        }
    });

    for (const volunteer of volunteers) {
        const completedTasks = volunteer.volunteerTasks;
        const totalHours = completedTasks.reduce((sum: number, t: any) => sum + (t.actualHours || t.estimatedHours), 0);
        const avgRating = completedTasks.filter(t => t.rating).reduce((sum: number, t: any) => sum + (t.rating || 0), 0) /
            (completedTasks.filter(t => t.rating).length || 1);

        // Calcular score de confiabilidade (tarefas no prazo / total * 100)
        const onTime = completedTasks.filter(t => t.completedAt && t.deadline && t.completedAt <= t.deadline).length;
        const reliabilityScore = completedTasks.length > 0 ? Math.round((onTime / completedTasks.length) * 100) : 0;

        await prisma.volunteerReputation.upsert({
            where: { userId: volunteer.id },
            update: {
                tasksCompleted: completedTasks.length,
                totalHours,
                averageRating: avgRating,
                reliabilityScore
            },
            create: {
                userId: volunteer.id,
                tasksCompleted: completedTasks.length,
                totalHours,
                averageRating: avgRating,
                reliabilityScore
            }
        });
    }

    return { processed: volunteers.length };
}

// Job 3: Enviar lembretes de notificação
export async function sendNotificationReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Lembretes de reservas
    const upcomingReservations = await prisma.reservation.findMany({
        where: {
            status: 'CONFIRMED',
            startTime: {
                gte: tomorrow,
                lte: endOfTomorrow
            }
        },
        include: {
            user: true,
            resource: true
        }
    });

    for (const reservation of upcomingReservations) {
        await prisma.notification.create({
            data: {
                userId: reservation.userId,
                type: 'RESERVATION_REMINDER',
                title: 'Lembrete de Reserva',
                message: `Sua reserva do ${reservation.resource.name} é amanhã às ${new Date(reservation.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
                read: false
            }
        });
    }

    // Lembretes de tarefas voluntárias
    const upcomingTasks = await prisma.volunteerTask.findMany({
        where: {
            status: 'IN_PROGRESS',
            deadline: {
                gte: tomorrow,
                lte: endOfTomorrow
            }
        },
        include: {
            assignedTo: true
        }
    });

    for (const task of upcomingTasks) {
        if (task.assignedToId) {
            await prisma.notification.create({
                data: {
                    userId: task.assignedToId,
                    type: 'TASK_DEADLINE_REMINDER',
                    title: 'Prazo de Tarefa',
                    message: `A tarefa "${task.title}" vence amanhã!`,
                    read: false
                }
            });
        }
    }

    return {
        reservationReminders: upcomingReservations.length,
        taskReminders: upcomingTasks.length
    };
}

// Job 4: Desbloquear badges automaticamente
export async function autoUnlockBadges() {
    const users = await prisma.user.findMany({
        include: {
            badges: true,
            _count: {
                select: {
                    workoutSessions: true,
                    volunteerTasks: true
                }
            }
        }
    });

    let badgesUnlocked = 0;

    for (const user of users) {
        const unlockedBadgeIds = user.badges.map((b: any) => b.badgeId);

        // Verificar cada badge
        for (const badge of BADGES) {
            if (unlockedBadgeIds.includes(badge.id)) continue;

            let shouldUnlock = false;

            switch (badge.id) {
                case 'first_workout':
                    shouldUnlock = user._count.workoutSessions >= 1;
                    break;
                case 'helping_hand':
                    shouldUnlock = user._count.volunteerTasks >= 1;
                    break;
                case 'super_volunteer':
                    shouldUnlock = user._count.volunteerTasks >= 10;
                    break;
                case 'one_year':
                    const memberSinceDate = user.createdAt;
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    shouldUnlock = memberSinceDate <= oneYearAgo;
                    break;
                case 'diamond_member':
                    shouldUnlock = getLevelByPoints(user.points).id >= 5;
                    break;
            }

            if (shouldUnlock) {
                await prisma.userBadge.create({
                    data: {
                        userId: user.id,
                        badgeId: badge.id
                    }
                });

                // Conceder pontos do badge
                await prisma.user.update({
                    where: { id: user.id },
                    data: { points: { increment: badge.points } }
                });

                // Notificar usuário
                await prisma.notification.create({
                    data: {
                        userId: user.id,
                        type: 'BADGE_UNLOCKED',
                        title: 'Novo Badge Desbloqueado!',
                        message: `Você conquistou o badge "${badge.name}"! +${badge.points} pontos`,
                        read: false
                    }
                });

                badgesUnlocked++;
            }
        }
    }

    return { badgesUnlocked };
}

// Job 5: Atualizar rankings/leaderboard (cache)
export async function updateLeaderboardCache() {
    // Buscar top 100 usuários por pontos
    const topUsers = await prisma.user.findMany({
        orderBy: { points: 'desc' },
        take: 100,
        select: {
            id: true,
            name: true,
            points: true,
            level: true
        }
    });

    // Atualizar ranking de cada usuário
    for (let i = 0; i < topUsers.length; i++) {
        await prisma.user.update({
            where: { id: topUsers[i].id },
            data: { rank: i + 1 }
        });
    }

    return { updated: topUsers.length };
}

// Job 6: Decaimento de pontos (opcional - para manter engajamento)
export async function applyPointsDecay() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Usuários inativos por mais de 3 meses
    const inactiveUsers = await prisma.user.findMany({
        where: {
            lastLoginAt: {
                lt: threeMonthsAgo
            },
            points: {
                gt: 0
            }
        }
    });

    for (const user of inactiveUsers) {
        // Decair 5% dos pontos
        const decayAmount = Math.floor(user.points * 0.05);

        if (decayAmount > 0) {
            await prisma.user.update({
                where: { id: user.id },
                data: { points: { decrement: decayAmount } }
            });

            await prisma.notification.create({
                data: {
                    userId: user.id,
                    type: 'POINTS_DECAY',
                    title: 'Pontos Expirando',
                    message: `Você perdeu ${decayAmount} pontos por inatividade. Volte a participar!`,
                    read: false
                }
            });
        }
    }

    return { processed: inactiveUsers.length };
}

// Job 7: Verificar pagamentos atrasados
export async function checkOverduePayments() {
    const now = new Date();

    const overduePayments = await prisma.payment.findMany({
        where: {
            status: 'PENDING',
            dueDate: {
                lt: now
            }
        },
        include: {
            user: true
        }
    });

    for (const payment of overduePayments) {
        // Marcar como atrasado
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'OVERDUE' }
        });

        // Notificar usuário
        await prisma.notification.create({
            data: {
                userId: payment.userId,
                type: 'PAYMENT_OVERDUE',
                title: 'Pagamento Atrasado',
                message: `Seu pagamento de ${payment.description} está atrasado. Regularize sua situação.`,
                read: false
            }
        });
    }

    return { processed: overduePayments.length };
}

// Função para rodar todos os jobs
export async function runAllBackgroundJobs() {
    console.log('🔄 Iniciando Background Jobs...');

    const results = {
        overdueReservations: await checkOverdueReservations(),
        volunteerReputation: await calculateVolunteerReputation(),
        notificationReminders: await sendNotificationReminders(),
        badgesUnlocked: await autoUnlockBadges(),
        leaderboardUpdated: await updateLeaderboardCache(),
        overduePayments: await checkOverduePayments()
    };

    console.log('✅ Background Jobs concluídos:', results);
    return results;
}

// Exports para uso individual
export default {
    checkOverdueReservations,
    calculateVolunteerReputation,
    sendNotificationReminders,
    autoUnlockBadges,
    updateLeaderboardCache,
    applyPointsDecay,
    checkOverduePayments,
    runAllBackgroundJobs
};
