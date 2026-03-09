import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "brutal";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-white hover:bg-primary/90": variant === "default",
            "border-2 border-foreground bg-transparent hover:bg-foreground hover:text-white": variant === "outline",
            "hover:bg-muted hover:text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "border-4 border-foreground bg-primary text-white shadow-[4px_4px_0_0_#111] hover:translate-y-1 hover:shadow-none transition-all active:translate-y-2 active:shadow-none": variant === "brutal",
            "h-12 px-6 py-2": size === "default",
            "h-10 px-4": size === "sm",
            "h-16 px-10 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
