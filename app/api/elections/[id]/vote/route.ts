import { NextRequest, NextResponse } from 'next/server';

// POST - Votar em uma eleição
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { candidateId } = await request.json();
        const electionId = params.id;

        // Em produção, verificar se usuário já votou
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // const existingVote = await prisma.vote.findFirst({
        //     where: {
        //         electionId,
        //         userId: session.user.id
        //     }
        // });

        // if (existingVote) {
        //     return NextResponse.json(
        //         { error: 'Você já votou nesta eleição' },
        //         { status: 400 }
        //     );
        // }

        // Registrar voto
        // await prisma.vote.create({
        //     data: {
        //         electionId,
        //         candidateId,
        //         userId: session.user.id
        //     }
        // });

        console.log(`Vote registered: Election ${electionId}, Candidate ${candidateId}`);

        return NextResponse.json({
            success: true,
            message: 'Voto registrado com sucesso!'
        });
    } catch (error) {
        console.error('Error voting:', error);
        return NextResponse.json(
            { error: 'Failed to register vote' },
            { status: 500 }
        );
    }
}
