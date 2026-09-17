import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, CheckCircle2, Clock, Users, XCircle } from "lucide-react"

import { getReservationByCode } from "@/lib/data/reservations"
import { formatCurrency, formatDate } from "@/lib/utils"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Confirmação de reserva",
}

interface ConfirmacaoPageProps {
  params: Promise<{ codigo: string }>
  searchParams: Promise<{ status?: string }>
}

export default async function ConfirmacaoPage({ params, searchParams }: ConfirmacaoPageProps) {
  const { codigo } = await params
  const { status } = await searchParams

  const reservation = await getReservationByCode(codigo)
  const pagamentoRecusado = status === "failure"

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <AnimatedSection className="flex flex-col items-center text-center">
        {pagamentoRecusado ? (
          <XCircle className="size-14 text-destructive" />
        ) : (
          <CheckCircle2 className="size-14 text-primary" />
        )}

        <h1 className="mt-4 font-heading text-3xl font-semibold">
          {pagamentoRecusado ? "Pagamento não aprovado" : "Reserva confirmada!"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {pagamentoRecusado
            ? "Não foi possível processar o pagamento. Tente novamente pelo painel da sua conta."
            : "Enviamos os detalhes da sua reserva para o seu e-mail (simulado)."}
        </p>

        <div className="mt-6 rounded-full border border-border bg-muted px-5 py-2 font-mono text-lg font-semibold tracking-wide">
          {codigo}
        </div>

        {reservation ? (
          <Card className="mt-8 w-full text-left">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold">{reservation.roomTypeNome}</h2>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {reservation.status === "confirmada" ? "Confirmada" : "Pendente"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)} (
                {reservation.noites} {reservation.noites === 1 ? "noite" : "noites"})
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" /> {reservation.hospedes} hóspedes
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total pago</span>
                <span>{formatCurrency(reservation.valorTotal)}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Não encontramos os detalhes desta reserva neste ambiente — se você acabou de
            configurar o Firebase, verifique se a coleção <code>reservations</code> está correta.
          </p>
        )}

        <Button className="mt-8" render={<Link href="/minha-conta/reservas" />} nativeButton={false}>
          Ver minhas reservas
        </Button>
      </AnimatedSection>
    </div>
  )
}
