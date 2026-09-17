import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { HOTEL_ADDRESS, HOTEL_EMAIL, HOTEL_PHONE } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"
import { ContatoForm } from "@/components/contato/contato-form"

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do Hotel Ipê Dourado.",
}

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-12 max-w-2xl">
        <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
          Contato
        </p>
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Fale conosco</h1>
        <p className="mt-3 text-muted-foreground">
          Dúvidas sobre reservas, eventos ou parcerias? Nossa equipe está pronta para ajudar.
        </p>
      </AnimatedSection>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <AnimatedSection className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">{HOTEL_ADDRESS}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Telefone</p>
              <a href={`tel:${HOTEL_PHONE}`} className="text-sm text-muted-foreground hover:text-primary">
                {HOTEL_PHONE}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">E-mail</p>
              <a
                href={`mailto:${HOTEL_EMAIL}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {HOTEL_EMAIL}
              </a>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <ContatoForm />
        </AnimatedSection>
      </div>
    </div>
  )
}
