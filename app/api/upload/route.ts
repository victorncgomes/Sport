import { NextRequest, NextResponse } from 'next/server';

/**
 * API de Upload de Imagens
 * POST /api/upload
 * 
 * Aceita:
 * - URL de imagem externa (para referenciar)
 * - Base64 (para upload futuro com Cloudinary/S3)
 * 
 * Para integração com Cloudinary:
 * 1. npm install cloudinary
 * 2. Adicionar CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * 3. Descomentar código de upload
 */

interface UploadRequest {
    type: 'url' | 'base64';
    data: string; // URL ou base64 string
    folder?: string; // pasta no storage (gallery, news, etc)
    filename?: string;
}

interface UploadResponse {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

// Validar URL de imagem
function isValidImageUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext =>
            parsed.pathname.toLowerCase().endsWith(ext)
        );
        // Aceitar URLs que parecem ser de serviços de imagem conhecidos
        const trustedDomains = ['unsplash.com', 'pexels.com', 'cloudinary.com', 'imgur.com', 'githubusercontent.com'];
        const isTrustedDomain = trustedDomains.some(domain => parsed.hostname.includes(domain));

        return hasImageExtension || isTrustedDomain || parsed.pathname.includes('/image');
    } catch {
        return false;
    }
}

// Para futuro: Upload para Cloudinary
// async function uploadToCloudinary(base64: string, folder: string): Promise<{url: string, publicId: string}> {
//     const cloudinary = require('cloudinary').v2;
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//     
//     const result = await cloudinary.uploader.upload(base64, {
//         folder: `sport-club-natal/${folder}`,
//         resource_type: 'auto',
//     });
//     
//     return { url: result.secure_url, publicId: result.public_id };
// }

export async function POST(request: NextRequest) {
    try {
        const body: UploadRequest = await request.json();

        if (!body.type || !body.data) {
            return NextResponse.json(
                { success: false, error: 'Tipo e dados são obrigatórios' },
                { status: 400 }
            );
        }

        // Tipo URL: apenas validar e retornar
        if (body.type === 'url') {
            if (!isValidImageUrl(body.data)) {
                return NextResponse.json(
                    { success: false, error: 'URL de imagem inválida' },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success: true,
                url: body.data,
                publicId: undefined,
            } as UploadResponse);
        }

        // Tipo base64: preparado para Cloudinary (por enquanto retorna erro)
        if (body.type === 'base64') {
            // Verificar se é base64 válido
            if (!body.data.startsWith('data:image/')) {
                return NextResponse.json(
                    { success: false, error: 'Base64 deve começar com data:image/' },
                    { status: 400 }
                );
            }

            // TODO: Descomentar quando Cloudinary estiver configurado
            // const result = await uploadToCloudinary(body.data, body.folder || 'uploads');
            // return NextResponse.json({
            //     success: true,
            //     url: result.url,
            //     publicId: result.publicId,
            // });

            // Por enquanto, retornar que upload direto não está disponível
            return NextResponse.json(
                {
                    success: false,
                    error: 'Upload direto ainda não configurado. Use URL externa por enquanto.',
                    hint: 'Configure CLOUDINARY_* env vars para habilitar upload direto'
                },
                { status: 501 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Tipo de upload inválido. Use "url" ou "base64"' },
            { status: 400 }
        );

    } catch (error) {
        console.error('[Upload API] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno ao processar upload' },
            { status: 500 }
        );
    }
}
