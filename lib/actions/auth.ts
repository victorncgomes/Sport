'use server';

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginWithCredentials(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard"
        });
    } catch (error: any) {
        if (error?.type === "CredentialsSignin") {
            return { error: "Credenciais inválidas" };
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: "/" });
}

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "Todos os campos são obrigatórios" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Este email já está cadastrado" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "VISITOR"
            }
        });

        redirect("/login?registered=true");
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Erro ao criar conta" };
    }
}
