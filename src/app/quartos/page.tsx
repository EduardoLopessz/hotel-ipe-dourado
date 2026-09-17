import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchX } from "lucide-react"

import { getRoomTypesWithAvailability } from "@/lib/data/availability"
import { getRoomTypes } from "@/lib/data/room-types"
import { RoomCard } from "@/components/rooms/room-card"
import { RoomFilters } from "@/components/rooms/room-filters"
import { SearchSummaryBar } from "@/components/rooms/search-summary-bar"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Quartos e Suítes",
  description:
    "Conheça as suítes e bangalôs do Hotel Ipê Dourado: vista mar, vista serra, piscina privativa e muito mais.",
}

interface QuartosPageProps {
  searchParams: Promise<{
    vista?: string
    capacidade?: string
    precoMax?: string
    checkIn?: string
    checkOut?: string
    hospedes?: string
  }>
}

export default async function QuartosPage({ searchParams }: QuartosPageProps) {
  const params = await searchParams
  const buscandoDatas = Boolean(params.checkIn && params.checkOut)

  const roomTypes = await getRoomTypes()
  const comDisponibilidade = await getRoomTypesWithAvailability(
    roomTypes,
    params.checkIn,
    params.checkOut
  )

  const hospedesNum = Number(params.hospedes) || 1

  const filtrados = comDisponibilidade.filter((room) => {
    if (params.vista && room.vista !== params.vista) return false
    if (params.capacidade && room.capacidade < Number(params.capacidade)) return false
    if (params.precoMax && room.precoDiaria > Number(params.precoMax)) return false
    if (buscandoDatas && room.capacidade < hospedesNum) return false
    return true
  })

  const searchQuery = buscandoDatas
    ? new URLSearchParams({
        checkIn: params.checkIn!,
        checkOut: params.checkOut!,
        hospedes: String(hospedesNum),
      }).toString()
    : undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-8 max-w-2xl">
        <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
          Acomodações
        </p>
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Quartos e Suítes</h1>
        <p className="mt-3 text-muted-foreground">
          De suítes românticas a bangalôs com piscina privativa — encontre a acomodação perfeita.
        </p>
      </AnimatedSection>

      {buscandoDatas && (
        <SearchSummaryBar
          checkIn={params.checkIn!}
          checkOut={params.checkOut!}
          hospedes={hospedesNum}
        />
      )}

      <Suspense>
        <RoomFilters />
      </Suspense>

      {filtrados.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="font-medium">Nenhum quarto encontrado com esses filtros</p>
          <p className="text-sm text-muted-foreground">
            {buscandoDatas
              ? "Não há quartos disponíveis para esses critérios nas datas selecionadas."
              : "Tente ajustar os filtros de busca."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filtrados.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              delay={i * 0.06}
              quartosDisponiveis={buscandoDatas ? room.quartosDisponiveis : undefined}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}
