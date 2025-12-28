import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CartPage() {
    return (
        <div className="container mx-auto py-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <CardContent className="py-12 text-center text-gray-400 flex flex-col items-center">
                    <p className="mb-4 text-lg">Seu carrinho está vazio.</p>
                    <Link href="/store">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">Voltar para a Loja</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
