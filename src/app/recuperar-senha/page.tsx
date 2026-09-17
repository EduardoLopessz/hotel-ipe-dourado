import type { Metadata } from "next"

import { RecuperarSenhaForm } from "@/components/auth/recuperar-senha-form"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Redefina a senha da sua conta no Hotel Ipê Dourado.",
}

export default function RecuperarSenhaPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <AnimatedSection>
        <h1 className="font-heading text-3xl font-semibold">Recuperar senha</h1>
        <p className="mt-2 text-muted-foreground">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <RecuperarSenhaForm />
        </div>
      </AnimatedSection>
    </div>
  )
}
