import { BedDouble, CalendarCheck, DollarSign, Users } from "lucide-react"

import { getAllReservations } from "@/lib/data/reservations"
import { getRoomTypes } from "@/lib/data/room-types"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const [reservations, roomTypes] = await Promise.all([getAllReservations(), getRoomTypes()])

  const confirmadas = reservations.filter((r) => r.status === "confirmada")
  const receita = confirmadas.reduce((sum, r) => sum + r.valorTotal, 0)
  const hospedesTotal = confirmadas.reduce((sum, r) => sum + r.hospedes, 0)

  const stats = [
    { label: "Reservas totais", value: reservations.length, icon: CalendarCheck },
    { label: "Receita confirmada", value: formatCurrency(receita), icon: DollarSign },
    { label: "Hóspedes (confirmadas)", value: hospedesTotal, icon: Users },
    { label: "Tipos de quarto", value: roomTypes.length, icon: BedDouble },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reservations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma reserva encontrada ainda — assim que os hóspedes começarem a reservar, os dados
          aparecerão aqui.
        </p>
      )}
    </div>
  )
}
