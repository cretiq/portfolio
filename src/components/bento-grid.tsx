import { cn } from "@/lib/utils"

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  children,
  className,
  gridSpan = "1x1",
}: {
  children: React.ReactNode
  className?: string
  gridSpan?: "1x1" | "2x1" | "1x2" | "2x2"
}) {
  const spanClasses = {
    "1x1": "",
    "2x1": "sm:col-span-2",
    "1x2": "sm:row-span-2",
    "2x2": "sm:col-span-2 sm:row-span-2",
  }

  return (
    <div className={cn(spanClasses[gridSpan], className)}>
      {children}
    </div>
  )
}
