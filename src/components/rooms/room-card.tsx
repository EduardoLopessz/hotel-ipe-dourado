import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Maximize, Users } from "lucide-react"

import type { RoomType } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const VISTA_LABEL: Record<RoomType["vista"], string> = {
  mar: "Vista mar",
  montanha: "Vista serra",
  jardim: "Vista jardim",
  piscina: "Vista piscina",
}

export function RoomCard({ room, delay = 0 }: { room: RoomType; delay?: number }) {
  return (
    <AnimatedSection delay={delay} as="div">
      <Card className="group h-full overflow-hidden py-0 sm:flex-row sm:items-stretch transition-shadow hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:w-2/5">
          <Image
            src={room.fotos[0]}
            alt={room.nome}
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
            {VISTA_LABEL[room.vista]}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col">
          <CardContent className="flex-1 px-5 pt-5">
            <h3 className="font-heading text-xl font-semibold">{room.nome}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{room.descricaoCurta}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> Até {room.capacidade} hóspedes
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="size-3.5" /> {room.metragem}m²
              </span>
              <span>{room.camas}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between px-5 pb-5">
            <div>
              <span className="text-xl font-semibold text-foreground">
                {formatCurrency(room.precoDiaria)}
              </span>
              <span className="text-xs text-muted-foreground"> /diária</span>
            </div>
            <Button size="sm" className="gap-1" render={<Link href={`/quartos/${room.slug}`} />} nativeButton={false}>
              Ver detalhes <ArrowRight className="size-3.5" />
            </Button>
          </CardFooter>
        </div>
      </Card>
    </AnimatedSection>
  )
}
