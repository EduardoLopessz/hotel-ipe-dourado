"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Minus, Plus } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { TAXA_LIMPEZA } from "@/lib/constants"
import type { RoomType } from "@/lib/types"
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export function RoomBookingWidget({ room }: { room: RoomType }) {
  const router = useRouter()
  const [range, setRange] = useState<DateRange | undefined>()
  const [hospedes, setHospedes] = useState(Math.min(2, room.capacidade))

  const noites = useMemo(() => {
    if (!range?.from || !range?.to) return 0
    return nightsBetween(range.from.toISOString(), range.to.toISOString())
  }, [range])

  const subtotal = noites * room.precoDiaria
  const total = noites > 0 ? subtotal + TAXA_LIMPEZA : 0

  function handleReservar() {
    const params = new URLSearchParams()
    if (range?.from) params.set("checkIn", range.from.toISOString().slice(0, 10))
    if (range?.to) params.set("checkOut", range.to.toISOString().slice(0, 10))
    params.set("hospedes", String(hospedes))
    router.push(`/reservar/${room.id}?${params.toString()}`)
  }

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-semibold">{formatCurrency(room.precoDiaria)}</span>
            <span className="text-sm text-muted-foreground"> /diária</span>
          </div>
        </div>

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="h-12 w-full justify-start gap-2 text-left font-normal"
              />
            }
          >
            <CalendarIcon className="size-4 text-primary" />
            <span className="text-sm">
              {range?.from
                ? `${formatDate(range.from)}${range.to ? ` → ${formatDate(range.to)}` : ""}`
                : "Selecionar datas"}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <span className="text-sm font-medium">Hóspedes</span>
          <div className="flex items-center gap-3">
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
              onClick={() => setHospedes((h) => Math.min(room.capacidade, h + 1))}
              aria-label="Aumentar hóspedes"
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>

        {noites > 0 && (
          <div className="space-y-2 text-sm">
            <Separator />
            <div className="flex justify-between text-muted-foreground">
              <span>
                {formatCurrency(room.precoDiaria)} x {noites} {noites === 1 ? "noite" : "noites"}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de limpeza</span>
              <span>{formatCurrency(TAXA_LIMPEZA)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        <Button size="lg" className="w-full" disabled={noites === 0} onClick={handleReservar}>
          {noites === 0 ? "Selecione as datas" : "Reservar agora"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">{room.politicaCancelamento}</p>
      </CardContent>
    </Card>
  )
}
