import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hoverable?: boolean;
    variant?: "default" | "branded" | "outline" | "accent" | "secondary";
  }
>(({ className, hoverable = true, variant = "default", ...props }, ref) => {
  const baseClasses = "rounded-lg p-4 shadow-md transition-all duration-200"
  
  const hoverClasses = hoverable 
    ? "hover:shadow-card-hover hover:translate-y-[-3px]" 
    : ""
  
  const variantClasses = {
    default: "bg-background-card border border-gray-800",
    branded: "bg-background-card border border-brand/20 bg-gradient-to-b from-background-card to-background",
    outline: "bg-transparent border border-gray-800",
    secondary: "bg-background-card border border-secondary/20 bg-gradient-to-b from-background-card to-background",
    accent: "bg-background-card border border-accent/20 bg-gradient-to-b from-background-card to-background",
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        hoverClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-3", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-heading text-lg font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-3 mt-1 border-t border-gray-800", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
