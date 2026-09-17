"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Minus, Plus, Search, Users } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn, formatDate, formatDateOnly } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BookingSearchBarProps {
  className?: string
  compact?: boolean
}

export function BookingSearchBar({ className, compact }: BookingSearchBarProps) {
  const router = useRouter()
  const [range, setRange] = useState<DateRange | undefined>()
  const [hospedes, setHospedes] = useState(2)

  function handleBuscar() {
    const params = new URLSearchParams()
    if (range?.from) params.set("checkIn", formatDateOnly(range.from))
    if (range?.to) params.set("checkOut", formatDateOnly(range.to))
    params.set("hospedes", String(hospedes))
    router.push(`/quartos?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md sm:flex-row sm:items-center",
        compact ? "sm:p-2" : "sm:p-3",
        className
      )}
      data-ph-mask
    >
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              className="h-12 flex-1 justify-start gap-2 rounded-xl border border-transparent text-left font-normal hover:border-border"
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-primary" />
          <span className="flex flex-col items-start text-xs leading-tight">
            <span className="text-muted-foreground">Check-in — Check-out</span>
            <span className="text-sm font-medium text-foreground">
              {range?.from
                ? `${formatDate(range.from)}${range.to ? ` → ${formatDate(range.to)}` : ""}`
                : "Selecione as datas"}
            </span>
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              className="h-12 justify-start gap-2 rounded-xl border border-transparent text-left font-normal hover:border-border sm:w-44"
            />
          }
        >
          <Users className="size-4 shrink-0 text-primary" />
          <span className="flex flex-col items-start text-xs leading-tight">
            <span className="text-muted-foreground">Hóspedes</span>
            <span className="text-sm font-medium text-foreground">
              {hospedes} {hospedes === 1 ? "hóspede" : "hóspedes"}
            </span>
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hóspedes</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setHospedes((h) => Math.max(1, h - 1))}
                aria-label="Diminuir hóspedes"
              >
                <Minus className="size-3" />
              </Button>
              <span className="w-4 text-center text-sm">{hospedes}</span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setHospedes((h) => Math.min(10, h + 1))}
                aria-label="Aumentar hóspedes"
              >
                <Plus className="size-3" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button size="lg" className="h-12 gap-2 rounded-xl" onClick={handleBuscar}>
        <Search className="size-4" />
        Buscar disponibilidade
      </Button>
    </div>
  )
}
