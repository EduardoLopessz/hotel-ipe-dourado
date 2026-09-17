import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AlertTriangle } from "lucide-react"

import { getRoomTypeById } from "@/lib/data/room-types"
import { AnimatedSection } from "@/components/shared/animated-section"
import { BookingSummary } from "@/components/booking/booking-summary"

export const metadata: Metadata = {
  title: "Confirmar reserva",
}

interface ReservarPageProps {
  params: Promise<{ roomTypeId: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; hospedes?: string }>
}

export default async function ReservarPage({ params, searchParams }: ReservarPageProps) {
  const { roomTypeId } = await params
  const { checkIn, checkOut, hospedes } = await searchParams

  const room = await getRoomTypeById(roomTypeId)
  if (!room) {
    notFound()
  }

  const hospedesNum = Number(hospedes) || 1

  if (!checkIn || !checkOut) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="size-8 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-semibold">Selecione as datas da estadia</h1>
        <p className="text-muted-foreground">
          Volte para a página do quarto e escolha as datas de check-in e check-out antes de
          continuar com a reserva.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <AnimatedSection>
        <h1 className="font-heading text-3xl font-semibold">Confirmar reserva</h1>
        <p className="mt-1 text-muted-foreground">Revise os detalhes antes de finalizar o pagamento.</p>

        <div className="mt-8">
          <Suspense>
            <BookingSummary
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              hospedes={hospedesNum}
            />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  )
}
