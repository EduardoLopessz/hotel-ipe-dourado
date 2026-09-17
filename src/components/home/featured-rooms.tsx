import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Maximize, Users } from "lucide-react"

import { ROOM_TYPES } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const VISTA_LABEL: Record<string, string> = {
  mar: "Vista mar",
  montanha: "Vista serra",
  jardim: "Vista jardim",
  piscina: "Vista piscina",
}

export function FeaturedRooms() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-10 max-w-2xl">
        <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
          Acomodações
        </p>
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
          Quartos e suítes para cada tipo de viagem
        </h2>
        <p className="mt-3 text-muted-foreground">
          Da suíte romântica com vista mar ao bangalô com piscina privativa — encontre a
          acomodação perfeita para sua estadia.
        </p>
      </AnimatedSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ROOM_TYPES.map((room, i) => (
          <AnimatedSection key={room.id} delay={i * 0.08} as="div">
            <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-xl">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={room.fotos[0]}
                  alt={room.nome}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
                  {VISTA_LABEL[room.vista]}
                </Badge>
              </div>
              <CardContent className="px-4">
                <h3 className="font-heading text-lg font-semibold">{room.nome}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {room.descricaoCurta}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> Até {room.capacidade}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="size-3.5" /> {room.metragem}m²
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between px-4 pb-4">
                <div>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(room.precoDiaria)}
                  </span>
                  <span className="text-xs text-muted-foreground"> /diária</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  render={<Link href={`/quartos/${room.slug}`} />}
                  nativeButton={false}
                >
                  Ver quarto <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          render={<Link href="/quartos" />}
          nativeButton={false}
        >
          Ver todos os quartos e suítes <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}
