"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"

export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/login")
    }
  }, [loading, configured, user, router])

  if (!configured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-semibold">Firebase não configurado</h1>
        <p className="mt-3 text-muted-foreground">
          Esta área exige autenticação via Firebase. Configure as variáveis{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">NEXT_PUBLIC_FIREBASE_*</code>{" "}
          no ambiente para habilitar login, cadastro e o painel da conta.
        </p>
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">{children}</div>
}
