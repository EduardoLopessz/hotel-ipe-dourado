import { MapPin, Phone, Mail } from "lucide-react"

import { HOTEL_ADDRESS, HOTEL_EMAIL, HOTEL_PHONE } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"

export function LocationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <AnimatedSection>
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
            Localização
          </p>
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Entre a Mata Atlântica e o litoral fluminense
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            O Hotel Ipê Dourado fica a 15 minutos do centro histórico de Paraty, cercado por
            trilhas na Mata Atlântica e a poucos passos de praias preservadas.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{HOTEL_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${HOTEL_PHONE}`} className="hover:underline">
                {HOTEL_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${HOTEL_EMAIL}`} className="hover:underline">
                {HOTEL_EMAIL}
              </a>
            </li>
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="overflow-hidden rounded-2xl border border-border shadow-lg">
          <iframe
            title="Localização do Hotel Ipê Dourado em Paraty, RJ"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-44.735%2C-23.245%2C-44.655%2C-23.185&layer=mapnik&marker=-23.215%2C-44.695"
            className="h-96 w-full grayscale-[15%]"
            loading="lazy"
          />
        </AnimatedSection>
      </div>
    </section>
  )
}
