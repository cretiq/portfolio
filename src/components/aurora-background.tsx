"use client"

import { cn } from "@/lib/utils"

export function AuroraBackground({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-background", className)}>
      <div className="aurora-bg absolute inset-0 opacity-80 will-change-auto" />
      <div className="absolute inset-0 bg-background/20" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
