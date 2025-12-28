import type { Metadata, Viewport } from "next"
import { Outfit, Saira_Condensed } from "next/font/google"
import "./globals.css"
import { ClubHeader } from "@/components/club-header"
import { BottomNav } from "@/components/bottom-nav"
import { Providers } from "@/components/providers"

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
    display: 'swap',
})

const sairaCondensed = Saira_Condensed({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: '--font-saira-condensed',
    display: 'swap',
})

export const metadata: Metadata = {
    title: "Sport Club de Natal",
    description: "110 anos de tradição náutica no Rio Potengi - Sistema de Gestão",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#0A0A0A",
    colorScheme: "dark",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className="dark" suppressHydrationWarning>
            <body className={`${outfit.variable} ${sairaCondensed.variable} font-sans`}>
                <Providers>
                    <ClubHeader />
                    <main className="min-h-screen pb-20 lg:pb-0">
                        {children}
                    </main>
                    <BottomNav />
                </Providers>
            </body>
        </html>
    )
}

