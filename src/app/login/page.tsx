import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta do Hotel Ipê Dourado.",
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <AnimatedSection>
        <h1 className="font-heading text-3xl font-semibold">Bem-vindo(a) de volta</h1>
        <p className="mt-2 text-muted-foreground">Entre para acessar suas reservas.</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  )
}
