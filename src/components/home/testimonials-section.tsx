import { Quote } from "lucide-react"

import { TESTIMONIALS } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"
import { StarRating } from "@/components/shared/star-rating"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-10 max-w-2xl">
        <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
          Hóspedes
        </p>
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
          O que dizem sobre o Ipê Dourado
        </h2>
      </AnimatedSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <AnimatedSection key={t.id} delay={i * 0.08} as="div">
            <Card className="h-full">
              <CardContent className="flex h-full flex-col">
                <Quote className="size-6 text-primary/60" />
                <p className="mt-3 flex-1 text-sm text-muted-foreground">&ldquo;{t.texto}&rdquo;</p>
                <StarRating value={t.avaliacao} className="mt-4" />
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={t.foto} alt={t.nome} />
                    <AvatarFallback>{t.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.nome}</p>
                    <p className="text-xs text-muted-foreground">{t.origem}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}
