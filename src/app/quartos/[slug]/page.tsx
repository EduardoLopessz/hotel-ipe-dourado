import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Check, Maximize, Users } from "lucide-react"

import { getRoomTypeBySlug, getRoomTypes } from "@/lib/data/room-types"
import { AnimatedSection } from "@/components/shared/animated-section"
import { RoomGallery } from "@/components/rooms/room-gallery"
import { RoomBookingWidget } from "@/components/rooms/room-booking-widget"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface RoomPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; hospedes?: string }>
}

const VISTA_LABEL: Record<string, string> = {
  mar: "Vista mar",
  montanha: "Vista serra",
  jardim: "Vista jardim",
  piscina: "Vista piscina",
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoomTypeBySlug(slug)
  if (!room) return {}
  return {
    title: room.nome,
    description: room.descricaoCurta,
  }
}

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { slug } = await params
  const { checkIn, checkOut, hospedes } = await searchParams
  const room = await getRoomTypeBySlug(slug)

  if (!room) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimatedSection>
        <RoomGallery fotos={room.fotos} nome={room.nome} />
      </AnimatedSection>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatedSection>
            <Badge variant="secondary" className="mb-3">
              {VISTA_LABEL[room.vista]}
            </Badge>
            <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{room.nome}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-4" /> Até {room.capacidade} hóspedes
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize className="size-4" /> {room.metragem}m²
              </span>
              <span>{room.camas}</span>
            </div>

            <Separator className="my-6" />

            <p className="leading-relaxed text-foreground/90">{room.descricao}</p>

            <Separator className="my-6" />

            <h2 className="font-heading text-xl font-semibold">Comodidades do quarto</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {room.comodidades.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <Separator className="my-6" />

            <h2 className="font-heading text-xl font-semibold">Política de cancelamento</h2>
            <p className="mt-3 text-sm text-muted-foreground">{room.politicaCancelamento}</p>
          </AnimatedSection>
        </div>

        <div>
          <RoomBookingWidget
            room={room}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialHospedes={hospedes ? Number(hospedes) : undefined}
          />
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const roomTypes = await getRoomTypes()
  return roomTypes.map((room) => ({ slug: room.slug }))
}
