import Link from "next/link"
import { CalendarDays, Users, X } from "lucide-react"

import { formatDate } from "@/lib/utils"

interface SearchSummaryBarProps {
  checkIn: string
  checkOut: string
  hospedes: number
}

export function SearchSummaryBar({ checkIn, checkOut, hospedes }: SearchSummaryBarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      <span className="flex items-center gap-1.5 font-medium">
        <CalendarDays className="size-4 text-primary" />
        {formatDate(checkIn)} → {formatDate(checkOut)}
      </span>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Users className="size-4 text-primary" />
        {hospedes} {hospedes === 1 ? "hóspede" : "hóspedes"}
      </span>
      <Link
        href="/quartos"
        className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" /> Limpar busca
      </Link>
    </div>
  )
}
