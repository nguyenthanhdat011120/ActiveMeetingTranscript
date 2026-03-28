import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[2.5rem] border p-6 flex gap-5 items-center shadow-2xl transition-all duration-500",
  {
    variants: {
      variant: {
        default: "bg-surface-container-high text-white border-white/10",
        destructive:
          "border-red-500/30 text-red-500 bg-red-500/10",
        vortex: 
          "bg-white/5 text-primary border-primary/20 shadow-neon animate-pulse-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    <div className="flex items-center gap-4 w-full">
      {children}
    </div>
  </div>
))
Alert.displayName = "Alert"

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showPing?: boolean }
>(({ className, showPing, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex-shrink-0", className)} {...props}>
    {children}
    {showPing && (
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
    )}
  </div>
))
AlertIcon.displayName = "AlertIcon"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-headline font-bold uppercase tracking-[0.3em] text-[10px] text-primary neon-text mb-0.5", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[11px] font-medium text-white/50 leading-tight", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, AlertIcon }
