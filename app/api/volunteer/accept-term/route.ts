import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import nodeCrypto from 'crypto';

// Conteúdo do termo (versão 1.0)
const TERM_VERSION = '1.0';
const TERM_CONTENT = `
TERMO DE ADESÃO AO SERVIÇO VOLUNTÁRIO
Sport Club de Natal

1. DEFINIÇÃO DE SERVIÇO VOLUNTÁRIO
O serviço voluntário é atividade não remunerada prestada por pessoa física...

[Conteúdo completo do termo seria inserido aqui]
`;

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticação
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        // 2. Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        // 3. Verificar se já aceitou
        const existing = await prisma.volunteerTermAcceptance.findUnique({
            where: { userId: user.id }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Você já aceitou o termo de voluntariado' },
                { status: 400 }
            );
        }

        // 4. Parsear body
        const body = await request.json();
        const { acceptedTerms, activities, availability } = body;

        if (!acceptedTerms) {
            return NextResponse.json(
                { error: 'Você deve aceitar os termos para continuar' },
                { status: 400 }
            );
        }

        if (!activities || !Array.isArray(activities) || activities.length === 0) {
            return NextResponse.json(
                { error: 'Selecione pelo menos uma área de interesse' },
                { status: 400 }
            );
        }

        // 5. Gerar hash SHA-256 do conteúdo do termo
        const termHash = nodeCrypto
            .createHash('sha256')
            .update(TERM_CONTENT)
            .digest('hex');

        // 6. Coletar evidências (LGPD)
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // 7. Registrar aceite no banco
        const acceptance = await prisma.volunteerTermAcceptance.create({
            data: {
                userId: user.id,
                termVersion: TERM_VERSION,
                termHash,
                termContentSnapshot: TERM_CONTENT,
                acceptedAt: new Date(),
                ipAddress,
                userAgent,
                areas: JSON.stringify(activities),
                availability: JSON.stringify(availability || {}),
                status: 'ACTIVE'
            }
        });

        // 8. Atualizar usuário como voluntário
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVolunteer: true,
                volunteerSince: new Date()
            }
        });

        // 9. Log de auditoria
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'VOLUNTEER_TERM_ACCEPTED',
                entity: 'VolunteerTermAcceptance',
                entityId: acceptance.id,
                details: JSON.stringify({
                    termVersion: TERM_VERSION,
                    termHash,
                    activities,
                    ipAddress
                }),
                ipAddress,
                userAgent
            }
        });

        // 10. Conceder pontos de bônus
        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: { increment: 150 }
            }
        });

        return NextResponse.json({
            success: true,
            pointsAwarded: 150,
            acceptance: {
                id: acceptance.id,
                acceptedAt: acceptance.acceptedAt,
                activities
            }
        });

    } catch (error) {
        console.error('Error accepting term:', error);
        return NextResponse.json(
            { error: 'Erro ao processar aceite do termo' },
            { status: 500 }
        );
    }
}
