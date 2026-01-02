import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const publicRoutes = [
                "/", "/about", "/contact", "/news", "/gallery", "/store", "/ranking",
                "/login", "/register", "/member/login", "/coach/login", "/trial-booking",
                "/competitions", "/tides", "/tides-weather", "/diretoria", "/coach",
                "/profile", "/member", "/events", "/social-actions", "/trainings",
                "/training", "/nautical", "/reservations", "/garage", "/finance",
                "/volunteer", "/voluntariado", "/notifications", "/boats", "/docs",
                "/changelog"
            ]

            const isPublicRoute = publicRoutes.some(route =>
                nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
            )

            if (nextUrl.pathname.startsWith("/api")) return true
            if (nextUrl.pathname.startsWith("/_next")) return true
            if (nextUrl.pathname.includes(".")) return true

            if (!isLoggedIn && !isPublicRoute) return false
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    providers: [], // Add empty providers array here, credentials will be added in auth.ts
} satisfies NextAuthConfig
