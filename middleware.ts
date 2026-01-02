import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    // Public routes that don't need authentication
    const publicRoutes = [
        "/",
        "/about",
        "/contact",
        "/news",
        "/gallery",
        "/store",
        "/ranking",
        "/login",
        "/register",
        "/member/login",
        "/coach/login",
        "/trial-booking",
        "/competitions",
        "/tides",
        "/tides-weather",
        "/diretoria",
        "/coach",
        "/profile",
        "/member",
        "/events",
        "/social-actions",
        "/trainings",
        "/training",
        "/nautical",
        "/reservations",
        "/garage",
        "/finance",
        "/volunteer",
        "/voluntariado",
        "/notifications",
        "/boats",
        "/docs",
        "/changelog"
    ]

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some(route =>
        nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    )

    // API routes should pass through
    if (nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next()
    }

    // Static files and images should pass through
    if (
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.includes(".") // files with extensions
    ) {
        return NextResponse.next()
    }

    // NOTA: Removido redirecionamento de /login para /dashboard
    // Agora usuários podem acessar /login mesmo logados (para trocar de perfil/demonstração)

    // Protect private routes
    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = encodeURIComponent(nextUrl.pathname)
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
    }

    // Role-based access control
    if (isLoggedIn && req.auth?.user) {
        const userRole = req.auth.user.role

        // Admin routes
        if (nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }

        // Coach routes
        if (nextUrl.pathname.startsWith("/coach") && !["ADMIN", "COACH"].includes(userRole)) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }

        // Diretoria routes  
        if (nextUrl.pathname.startsWith("/diretoria") && !["ADMIN", "DIRETORIA"].includes(userRole)) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
