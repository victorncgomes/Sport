import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        // Mobile-first breakpoints
        screens: {
            'xs': '375px',   // iPhone SE
            'sm': '390px',   // iPhone 14
            'md': '768px',   // iPad
            'lg': '992px',   // Desktop (menu transition)
            'xl': '1280px',  // Large desktop
            '2xl': '1536px', // Ultra wide
        },
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1rem",
                md: "1.5rem",
                lg: "2rem",
            },
            screens: {
                sm: "100%",
                md: "100%",
                lg: "1024px",
                xl: "1280px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                'saira-condensed': ['var(--font-saira-condensed)', 'Saira Condensed', 'sans-serif'],
            },
            fontSize: {
                // Mobile-optimized sizes
                'xxs': ['0.625rem', { lineHeight: '0.875rem' }],  // 10px
                'xs': ['0.6875rem', { lineHeight: '1rem' }],     // 11px
                'sm': ['0.8125rem', { lineHeight: '1.25rem' }],  // 13px
                'base': ['0.9375rem', { lineHeight: '1.5rem' }], // 15px
                'lg': ['1.0625rem', { lineHeight: '1.625rem' }], // 17px
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
                '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
                '5xl': ['3rem', { lineHeight: '1' }],            // 48px
                '6xl': ['3.75rem', { lineHeight: '1' }],         // 60px
            },
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
                'nav': '56px',    // Mobile nav height
                'nav-md': '64px', // Tablet nav height
                'bottom': '80px', // Bottom nav height with safe area
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                // Sport Club Colors - Premium Palette
                'club-black': {
                    DEFAULT: '#0A0A0A',
                    50: '#1A1A1A',
                    100: '#151515',
                    200: '#121212',
                    300: '#0F0F0F',
                    400: '#0C0C0C',
                    500: '#0A0A0A',
                    600: '#080808',
                    700: '#050505',
                    800: '#030303',
                    900: '#000000',
                },
                'club-red': {
                    DEFAULT: '#DC2626',
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                    900: '#7F1D1D',
                },
                'club-gold': {
                    DEFAULT: '#FFD700',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                    800: '#92400E',
                    900: '#78350F',
                },

                // Surfaces for cards and overlays
                'surface': {
                    dark: '#111111',
                    light: '#1A1A1A',
                    overlay: 'rgba(0, 0, 0, 0.7)',
                },

                // Text colors
                'text': {
                    primary: '#FFFFFF',
                    secondary: '#A0A0A0',
                    muted: '#666666',
                    inverse: '#0A0A0A',
                },

                primary: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#0A0A0A',
                    foreground: '#FFFFFF',
                },
                accent: {
                    DEFAULT: '#FFD700',
                    foreground: '#0A0A0A',
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                'none': '0',
                'sm': '0.375rem',
                'DEFAULT': '0.5rem',
                'md': '0.75rem',
                'lg': '1rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                'full': '9999px',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-down": {
                    "0%": { opacity: "0", transform: "translateY(-20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-right": {
                    "0%": { opacity: "0", transform: "translateX(-100px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "slide-in-left": {
                    "0%": { opacity: "0", transform: "translateX(100px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.9)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(220, 38, 38, 0.6)" },
                },
                "glow-gold": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(255, 215, 0, 0.6)" },
                },
                "pulse-red": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "typewriter": {
                    "0%": { width: "0" },
                    "100%": { width: "100%" },
                },
                "blink": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                "wave": {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "25%": { transform: "rotate(20deg)" },
                    "75%": { transform: "rotate(-20deg)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in-up": "fade-in-up 0.6s ease-out",
                "fade-in-down": "fade-in-down 0.6s ease-out",
                "slide-in-right": "slide-in-right 0.5s ease-out",
                "slide-in-left": "slide-in-left 0.5s ease-out",
                "scale-in": "scale-in 0.4s ease-out",
                "float": "float 3s ease-in-out infinite",
                "glow": "glow 2s ease-in-out infinite",
                "glow-gold": "glow-gold 2s ease-in-out infinite",
                "pulse-red": "pulse-red 2s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
                "typewriter": "typewriter 2s steps(20) forwards",
                "blink": "blink 1s step-end infinite",
                "wave": "wave 1s ease-in-out",
                "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-club': 'linear-gradient(135deg, #DC2626 0%, #0A0A0A 100%)',
                'gradient-club-reverse': 'linear-gradient(135deg, #0A0A0A 0%, #DC2626 100%)',
                'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #B45309 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
                'gradient-overlay': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)',
                'gradient-overlay-top': 'linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
                'gradient-hero': 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.5) 40%, #0A0A0A 100%)',
            },
            boxShadow: {
                'glow-red': '0 0 20px rgba(220, 38, 38, 0.4)',
                'glow-gold': '0 0 20px rgba(255, 215, 0, 0.4)',
                'glow-red-lg': '0 0 40px rgba(220, 38, 38, 0.6)',
                'glow-gold-lg': '0 0 40px rgba(255, 215, 0, 0.6)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
                'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionDuration: {
                '400': '400ms',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
