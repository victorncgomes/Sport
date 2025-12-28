'use client';

import { Waves, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-club-black flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <WifiOff className="w-12 h-12 text-white/30" />
                    </div>
                    <Waves className="w-8 h-8 text-club-red absolute bottom-0 right-1/3 animate-bounce" />
                </div>

                {/* Message */}
                <h1 className="text-2xl font-bold text-white mb-4">
                    Você está offline
                </h1>
                <p className="text-white/60 mb-8">
                    Não se preocupe! Você ainda pode visualizar dados em cache e continuar navegando.
                    Quando a conexão voltar, sincronizaremos automaticamente suas atividades.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={handleRetry}
                        className="w-full bg-club-red hover:bg-club-red/90"
                    >
                        Tentar Novamente
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="w-full"
                    >
                        Voltar ao Início
                    </Button>
                </div>

                {/* Info */}
                <div className="mt-12 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/40">
                        <strong>Modo Offline Ativo</strong><br />
                        Seus treinos e reservas serão sincronizados assim que você se conectar novamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
