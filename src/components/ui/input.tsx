import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full border-4 border-foreground bg-transparent px-4 py-2 text-base font-bold transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-[&:not(:focus-visible)]:outline-none focus-visible:shadow-[4px_4px_0_0_#D81176] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
