import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-club-red text-white hover:bg-club-red-700 hover:shadow-glow-red",
                destructive: "bg-red-600 text-white hover:bg-red-700",
                outline: "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-club-red/50",
                secondary: "bg-club-black-50 text-white border border-club-red/30 hover:bg-club-red/20 hover:border-club-red",
                ghost: "text-white/70 hover:text-white hover:bg-white/5",
                link: "text-club-red underline-offset-4 hover:underline",
                gold: "bg-club-gold text-club-black font-bold hover:bg-club-gold-600 hover:shadow-glow-gold",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
