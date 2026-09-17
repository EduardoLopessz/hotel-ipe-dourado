import Link from "next/link"
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

const ICONS: Record<string, LucideIcon> = {
  Waves,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Umbrella,
  Mountain,
}

export function AmenitiesSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10 max-w-2xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
            Comodidades
          </p>
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Lazer e bem-estar em cada detalhe
          </h2>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((amenity, i) => {
            const Icon = ICONS[amenity.icone] ?? Sparkles
            return (
              <AnimatedSection key={amenity.id} delay={i * 0.06} as="div">
                <Link
                  href="/comodidades"
                  className="group relative block h-64 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={amenity.imagem}
                    alt={amenity.nome}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <Icon className="mb-2 size-6 text-primary" />
                    <h3 className="font-heading text-lg font-semibold">{amenity.nome}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">
                      {amenity.descricao}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
