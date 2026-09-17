import type { Metadata } from "next"

import { CadastroForm } from "@/components/auth/cadastro-form"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta no Hotel Ipê Dourado para reservar e acompanhar suas estadias.",
}

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <AnimatedSection>
        <h1 className="font-heading text-3xl font-semibold">Criar sua conta</h1>
        <p className="mt-2 text-muted-foreground">
          Cadastre-se para reservar sua estadia no Ipê Dourado e acompanhar suas reservas.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <CadastroForm />
        </div>
      </AnimatedSection>
    </div>
  )
}
