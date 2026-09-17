import type { Metadata } from "next"
import Image from "next/image"
import {
  Dumbbell,
  Mountain,
  Sparkles,
  Umbrella,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react"

import { AMENITIES } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Comodidades",
  description:
    "Piscina infinita, spa, restaurante autoral, academia 24h, praia privativa e trilhas na Mata Atlântica.",
}

const ICONS: Record<string, LucideIcon> = {
  Waves,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Umbrella,
  Mountain,
}

export default function ComodidadesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-12 max-w-2xl">
        <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
          Comodidades
        </p>
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Lazer e bem-estar em cada detalhe
        </h1>
        <p className="mt-3 text-muted-foreground">
          Do nascer ao pôr do sol, o Ipê Dourado reúne experiências para relaxar, se exercitar e
          se reconectar com a natureza.
        </p>
      </AnimatedSection>

      <div className="space-y-16">
        {AMENITIES.map((amenity, i) => {
          const Icon = ICONS[amenity.icone] ?? Sparkles
          const invert = i % 2 === 1
          return (
            <AnimatedSection key={amenity.id} delay={0.05}>
              <div
                className={`grid items-center gap-8 lg:grid-cols-2 ${invert ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={amenity.imagem}
                    alt={amenity.nome}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <Icon className="mb-3 size-8 text-primary" />
                  <h2 className="font-heading text-2xl font-semibold">{amenity.nome}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {amenity.descricao}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </div>
  )
}
