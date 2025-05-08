import { cn } from "@/lib/utils"

interface TagBadgeProps {
  label: string
  type?: "default" | "success" | "warning" | "error" | "info" | "brand" | "secondary" | "accent"
  className?: string
  pulse?: boolean
}

export function TagBadge({ label, type = "default", className, pulse = false }: TagBadgeProps) {
  const typeClasses = {
    default: "bg-gray-800 text-gray-200 border-gray-700",
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    warning: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    brand: "bg-brand/20 text-brand border-brand/30",
    secondary: "bg-secondary/20 text-secondary border-secondary/30",
    accent: "bg-accent/20 text-accent border-accent/30"
  }

  const typeGlow = {
    default: "",
    success: "shadow-green-500/20",
    warning: "shadow-orange-500/20",
    error: "shadow-red-500/20",
    info: "shadow-blue-500/20",
    brand: "shadow-brand/30",
    secondary: "shadow-secondary/30",
    accent: "shadow-accent/30"
  }
  
  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-medium rounded-full border shadow-sm transition-all duration-200",
      typeClasses[type],
      pulse ? "animate-pulse" : "",
      type !== "default" ? "hover:shadow-md" : "",
      type === "brand" ? "hover:shadow-glow" : "",
      type === "secondary" ? "hover:shadow-secondary-glow" : "",
      type === "accent" ? "hover:shadow-accent-glow" : "",
      className
    )}>
      {label}
    </span>
  )
} 