import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < value ? "fill-primary text-primary" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}
