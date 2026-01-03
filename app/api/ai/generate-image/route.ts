import { NextRequest, NextResponse } from 'next/server';

/**
 * API de Geração de Imagens com IA (Gemini/Imagen)
 * POST /api/ai/generate-image
 * 
 * Gera imagens baseadas em texto usando a API do Gemini.
 * 
 * Configuração:
 * 1. Adicionar GEMINI_API_KEY no .env
 * 2. A API usará o modelo Imagen quando disponível
 * 
 * Prompt Engineering para o clube:
 * - Cores: vermelho (#DC2626) e preto
 * - Estilo: esportivo, remo, náutico
 * - Localização: Nordeste brasileiro, Rio Potengi, Natal-RN
 * - Pessoas: traços brasileiros/sul-americanos
 */

interface GenerateImageRequest {
    prompt: string;
    context?: 'news' | 'gallery' | 'event';
    style?: 'photo' | 'illustration' | 'artistic';
    aspectRatio?: '16:9' | '1:1' | '4:3';
}

interface GenerateImageResponse {
    success: boolean;
    imageUrl?: string;
    prompt?: string;
    error?: string;
}

// Contexto do clube para enriquecer prompts
const CLUB_CONTEXT = {
    colors: 'vermelho rubro (#DC2626) e preto',
    location: 'Natal, Rio Grande do Norte, Brasil, às margens do Rio Potengi',
    climate: 'tropical, sol forte, céu azul',
    sport: 'remo olímpico, canoagem',
    people: 'brasileiros com traços típicos do nordeste',
    founded: '1915',
    style: 'esportivo, elegante, tradição com modernidade'
};

// Construir prompt otimizado para o contexto do clube
function buildEnhancedPrompt(request: GenerateImageRequest): string {
    let enhancedPrompt = request.prompt;

    // Adicionar contexto do clube
    const contextAdditions: string[] = [];

    if (request.context === 'news') {
        contextAdditions.push('fotojornalismo esportivo');
        contextAdditions.push('iluminação natural');
    } else if (request.context === 'gallery') {
        contextAdditions.push('foto artística de alta qualidade');
        contextAdditions.push('composição profissional');
    } else if (request.context === 'event') {
        contextAdditions.push('evento esportivo');
        contextAdditions.push('atmosfera vibrante');
    }

    // Adicionar estilo visual
    if (request.style === 'photo') {
        contextAdditions.push('fotografia realista, DSLR, 4K');
    } else if (request.style === 'illustration') {
        contextAdditions.push('ilustração digital moderna');
    } else if (request.style === 'artistic') {
        contextAdditions.push('arte conceitual, estilizado');
    }

    // Adicionar contexto do clube quando relevante
    if (!enhancedPrompt.toLowerCase().includes('remo') &&
        !enhancedPrompt.toLowerCase().includes('barco')) {
        // Prompt genérico - adicionar contexto do clube
        contextAdditions.push(`cores ${CLUB_CONTEXT.colors}`);
        contextAdditions.push(`localização: ${CLUB_CONTEXT.location}`);
    }

    // Garantir representação adequada de pessoas
    if (enhancedPrompt.toLowerCase().includes('pessoa') ||
        enhancedPrompt.toLowerCase().includes('atleta') ||
        enhancedPrompt.toLowerCase().includes('remador')) {
        contextAdditions.push(`pessoas com ${CLUB_CONTEXT.people}`);
    }

    // Combinar prompt original com contexto
    if (contextAdditions.length > 0) {
        enhancedPrompt = `${enhancedPrompt}. Estilo: ${contextAdditions.join(', ')}.`;
    }

    return enhancedPrompt;
}

export async function POST(request: NextRequest) {
    try {
        const body: GenerateImageRequest = await request.json();

        if (!body.prompt || body.prompt.trim().length < 10) {
            return NextResponse.json(
                { success: false, error: 'Prompt deve ter pelo menos 10 caracteres' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Retornar placeholder quando API não configurada
            console.warn('[AI Generate] GEMINI_API_KEY não configurada, retornando placeholder');

            return NextResponse.json({
                success: true,
                imageUrl: '/images/gallery/placeholder-generated.jpg',
                prompt: buildEnhancedPrompt(body),
                warning: 'API Gemini não configurada. Configure GEMINI_API_KEY para geração real.',
            } as GenerateImageResponse);
        }

        // Construir prompt otimizado
        const enhancedPrompt = buildEnhancedPrompt(body);

        // Chamar API Gemini (Imagen)
        // Nota: A API Imagen do Google pode ter endpoints diferentes
        // Este é um exemplo de estrutura - ajustar conforme documentação atual
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: enhancedPrompt,
                        numberOfImages: 1,
                        aspectRatio: body.aspectRatio || '16:9',
                        safetyFilterLevel: 'block_medium_and_above',
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[AI Generate] Erro na API Gemini:', errorData);

                // Fallback para placeholder
                return NextResponse.json({
                    success: true,
                    imageUrl: '/images/gallery/placeholder-generated.jpg',
                    prompt: enhancedPrompt,
                    warning: 'Erro na geração, usando placeholder',
                });
            }

            const result = await response.json();

            // Extrair URL da imagem gerada
            const imageUrl = result.generatedImages?.[0]?.image?.imageBytes
                ? `data:image/png;base64,${result.generatedImages[0].image.imageBytes}`
                : result.generatedImages?.[0]?.url;

            if (!imageUrl) {
                return NextResponse.json({
                    success: true,
                    imageUrl: '/images/gallery/placeholder-generated.jpg',
                    prompt: enhancedPrompt,
                    warning: 'Imagem não retornada, usando placeholder',
                });
            }

            return NextResponse.json({
                success: true,
                imageUrl,
                prompt: enhancedPrompt,
            } as GenerateImageResponse);

        } catch (apiError) {
            console.error('[AI Generate] Erro ao chamar Gemini:', apiError);

            return NextResponse.json({
                success: true,
                imageUrl: '/images/gallery/placeholder-generated.jpg',
                prompt: enhancedPrompt,
                warning: 'Erro na API, usando placeholder',
            });
        }

    } catch (error) {
        console.error('[AI Generate] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno ao gerar imagem' },
            { status: 500 }
        );
    }
}

// GET para verificar status da API
export async function GET() {
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    return NextResponse.json({
        available: hasApiKey,
        model: 'imagen-3.0-generate-001',
        clubContext: CLUB_CONTEXT,
        supportedStyles: ['photo', 'illustration', 'artistic'],
        supportedContexts: ['news', 'gallery', 'event'],
    });
}
