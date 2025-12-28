// Tide Alerts Service - Check conditions and send notifications

import { PrismaClient } from '@prisma/client';
import { fetchWeatherData, parseWeatherCurrent } from '@/lib/api/weather';
import { generateMockTideData } from '@/lib/api/tides';

const prisma = new PrismaClient();

export interface NotificationPayload {
    userId: string;
    title: string;
    body: string;
    type: 'IDEAL_CONDITIONS' | 'HIGH_TIDE' | 'LOW_TIDE';
    data?: Record<string, any>;
}

/**
 * Check rowing conditions and determine if they're ideal
 */
export async function checkRowingConditions(): Promise<{
    isIdeal: boolean;
    score: number;
    bestTime: string | null;
    coefficient: number;
    windSpeed: number;
    waveHeight: number;
}> {
    // Get tide data
    const tideData = generateMockTideData(1);
    const today = tideData[0];

    // Get weather data
    let windSpeed = 15;
    try {
        const weather = await fetchWeatherData();
        const current = parseWeatherCurrent(weather);
        windSpeed = current.windSpeed;
    } catch (error) {
        console.error('Weather fetch error:', error);
    }

    // Mock wave height (TODO: integrate real API)
    const waveHeight = 0.5;

    // Calculate scores
    const coefficientScore = today.coefficient > 70 ? 50 : 100;
    const windScore = windSpeed < 15 ? 100 : windSpeed < 25 ? 70 : 40;
    const waveScore = waveHeight < 0.5 ? 100 : waveHeight < 1.0 ? 70 : 40;

    const score = Math.round((coefficientScore + windScore + waveScore) / 3);
    const isIdeal = score >= 70;

    return {
        isIdeal,
        score,
        bestTime: today.bestRowingTime,
        coefficient: today.coefficient,
        windSpeed,
        waveHeight
    };
}

/**
 * Check all users with enabled alerts and send notifications
 */
export async function checkAndSendAlerts(): Promise<number> {
    try {
        // Get all users with enabled alerts
        const users = await prisma.user.findMany({
            where: {
                tideAlerts: {
                    some: {
                        enabled: true
                    }
                }
            },
            include: {
                tideAlerts: {
                    where: { enabled: true }
                }
            }
        });

        let sentCount = 0;

        for (const user of users) {
            const conditions = await checkRowingConditions();

            for (const alert of user.tideAlerts) {
                let shouldNotify = false;
                let notificationTitle = '';
                let notificationBody = '';

                if (alert.alertType === 'IDEAL_CONDITIONS' && conditions.isIdeal) {
                    shouldNotify = true;
                    notificationTitle = 'Condições Ideais para Remo! 🚣';
                    notificationBody = `Score ${conditions.score}/100. Melhor horário: ${conditions.bestTime}`;
                } else if (alert.alertType === 'HIGH_TIDE' && conditions.coefficient > 70) {
                    shouldNotify = true;
                    notificationTitle = 'Maré Alta Intensa';
                    notificationBody = `Coeficiente ${conditions.coefficient}. Atenção às correntes!`;
                } else if (alert.alertType === 'LOW_TIDE' && conditions.coefficient < 40) {
                    shouldNotify = true;
                    notificationTitle = 'Maré Fraca';
                    notificationBody = `Coeficiente ${conditions.coefficient}. Condições calmas.`;
                }

                if (shouldNotify) {
                    await sendNotification({
                        userId: user.id,
                        title: notificationTitle,
                        body: notificationBody,
                        type: alert.alertType as any,
                        data: conditions
                    });
                    sentCount++;
                }
            }
        }

        console.log(`✅ ${sentCount} alertas enviados`);
        return sentCount;
    } catch (error) {
        console.error('Error checking alerts:', error);
        return 0;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Send notification to user
 * TODO: Implement with push notification service (e.g., Firebase, OneSignal)
 * or email service (e.g., SendGrid, Resend)
 */
async function sendNotification(payload: NotificationPayload): Promise<void> {
    console.log(`📧 Sending notification to user ${payload.userId}:`, {
        title: payload.title,
        body: payload.body,
        type: payload.type
    });

    // TODO: Integrate with real notification service
    // Example with email:
    // await sendEmail({
    //   to: user.email,
    //   subject: payload.title,
    //   html: generateEmailTemplate(payload)
    // });

    // Example with push:
    // await sendPushNotification({
    //   to: user.deviceToken,
    //   notification: {
    //     title: payload.title,
    //     body: payload.body
    //   },
    //   data: payload.data
    // });
}

/**
 * Create or update tide alert for user
 */
export async function upsertTideAlert(
    userId: string,
    alertType: 'IDEAL_CONDITIONS' | 'HIGH_TIDE' | 'LOW_TIDE',
    enabled: boolean = true,
    threshold?: any
): Promise<void> {
    await prisma.tideAlert.upsert({
        where: {
            userId_alertType: {
                userId,
                alertType
            }
        },
        update: {
            enabled,
            threshold: threshold ? JSON.stringify(threshold) : null
        },
        create: {
            userId,
            alertType,
            enabled,
            threshold: threshold ? JSON.stringify(threshold) : null
        }
    });
}

/**
 * Get user's alerts
 */
export async function getUserAlerts(userId: string) {
    return await prisma.tideAlert.findMany({
        where: { userId }
    });
}
