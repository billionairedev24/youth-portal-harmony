import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-primary-foreground hover:from-gold-500 hover:to-gold-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-gold-200 bg-gradient-to-br from-gold-400/10 via-gold-500/10 to-gold-600/10 hover:from-gold-400/20 hover:to-gold-600/20 hover:border-gold-300 hover:text-gold-800",
        secondary:
          "bg-gradient-to-br from-gold-200/80 via-gold-300/80 to-gold-400/80 text-secondary-foreground hover:from-gold-300 hover:to-gold-500",
        ghost: "hover:bg-gradient-to-br hover:from-gold-400/10 hover:to-gold-600/10 hover:text-gold-900",
        link: "text-gold-600 underline-offset-4 hover:underline decoration-gold-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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