import { NextResponse } from 'next/server';
import { getDocumentationSyncStatus, getPendingDocumentation, CHANGELOG_SUMMARY } from '@/lib/config/documentation-sync';

/**
 * GET /api/docs/sync
 * 
 * Retorna o status de sincronização da documentação de ajuda.
 * Útil para verificar se há funcionalidades não documentadas.
 */
export async function GET() {
    try {
        const syncStatus = getDocumentationSyncStatus();
        const pending = getPendingDocumentation();

        return NextResponse.json({
            success: true,
            data: {
                ...syncStatus,
                pendingDocumentation: pending,
                changelog: CHANGELOG_SUMMARY.slice(0, 5), // Últimas 5 versões
                lastCheck: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('[API] Erro ao verificar sync da documentação:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno ao verificar documentação' },
            { status: 500 }
        );
    }
}
