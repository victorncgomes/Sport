import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Construction } from 'lucide-react'

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <Construction className="h-16 w-16 text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Em Construção</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Esta funcionalidade faz parte da Fase 2 (Visual e Conteúdo) e será implementada em breve pelo especialista em Design (Claude).
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">Voltar ao Início</Button>
                </Link>
                <Link href="/dashboard">
                    <Button>Ir para o Dashboard</Button>
                </Link>
            </div>
        </div>
    )
}
