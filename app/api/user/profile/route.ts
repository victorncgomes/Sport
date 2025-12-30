import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                anamnese: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
        }

        // Combinar dados do usuário e anamnese para o formulário de dados pessoais
        const personalData = {
            fullName: user.name,
            email: user.email,
            phone: user.anamnese?.phone || "",
            cpf: user.anamnese?.cpf || "",
            rg: user.anamnese?.rg || "",
            birthDate: user.anamnese?.birthDate ? new Date(user.anamnese.birthDate).toISOString().split('T')[0] : "",
            address: {
                street: user.anamnese?.address || "",
                number: "", // O schema atual tem um campo único 'address', vamos simular a separação se necessário ou usar o campo inteiro
                complement: "",
                neighborhood: "",
                city: user.anamnese?.city || "",
                state: user.anamnese?.state || "",
                zipCode: user.anamnese?.zipCode || ""
            },
            emergencyContact: {
                name: user.anamnese?.emergencyContact || "",
                phone: user.anamnese?.emergencyPhone || "",
                relation: user.anamnese?.emergencyRelation || ""
            },
            swimLevel: user.anamnese?.swimLevel || "NONE",
            canFlipBoat: user.anamnese?.canSwim || false // canSwim sendo usado como proxy para canFlipBoat se não houver campo específico
        }

        return NextResponse.json(personalData)
    } catch (error) {
        console.error("Erro ao buscar perfil:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { fullName, email, phone, cpf, rg, birthDate, address, emergencyContact, swimLevel, canFlipBoat } = body

        // Atualizar Nome do Usuário
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: fullName }
        })

        // Atualizar ou criar Anamnese
        const addressString = `${address.street}${address.number ? ', ' + address.number : ''}${address.complement ? ' - ' + address.complement : ''}`

        await prisma.anamneseForm.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                fullName,
                phone,
                cpf,
                rg,
                birthDate: new Date(birthDate),
                address: addressString,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                emergencyContact: emergencyContact.name,
                emergencyPhone: emergencyContact.phone,
                emergencyRelation: emergencyContact.relation,
                swimLevel,
                canSwim: canFlipBoat,
                goals: "Atualização de dados pessoais" // Campo obrigatório no schema
            },
            update: {
                fullName,
                phone,
                cpf,
                rg,
                birthDate: new Date(birthDate),
                address: addressString,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                emergencyContact: emergencyContact.name,
                emergencyPhone: emergencyContact.phone,
                emergencyRelation: emergencyContact.relation,
                swimLevel,
                canSwim: canFlipBoat
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
