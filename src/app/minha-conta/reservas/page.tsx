"use client"

import Link from "next/link"
import { CalendarX, Loader2 } from "lucide-react"

import { useReservations } from "@/hooks/use-reservations"
import { AccountNav } from "@/components/account/account-nav"
import { ReservationCard } from "@/components/account/reservation-card"
import { Button } from "@/components/ui/button"

export default function MinhasReservasPage() {
  const { reservations, loading, cancelarReserva } = useReservations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold">Minha conta</h1>
        <p className="mt-1 text-muted-foreground">Acompanhe o histórico e status das suas reservas.</p>
      </div>

      <AccountNav />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <CalendarX className="size-8 text-muted-foreground" />
          <p className="font-medium">Você ainda não tem reservas</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Explore nossos quartos e suítes e reserve sua próxima estadia no Ipê Dourado.
          </p>
          <Button render={<Link href="/quartos" />} nativeButton={false}>
            Ver quartos e suítes
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancelar={cancelarReserva}
            />
          ))}
        </div>
      )}
    </div>
  )
}
