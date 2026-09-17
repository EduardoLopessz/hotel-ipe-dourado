"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Loader2, LayoutDashboard, CalendarCheck, BedDouble } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarCheck },
  { href: "/admin/quartos", label: "Quartos e Suítes", icon: BedDouble },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { configured } = useAuth()
  const { isAdmin, checking } = useIsAdmin()
  const pathname = usePathname()

  if (!configured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold">Firebase não configurado</h1>
        <p className="mt-3 text-muted-foreground">
          O painel administrativo exige autenticação via Firebase com uma custom claim{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">admin</code>.
        </p>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold">Acesso restrito</h1>
        <p className="mt-3 text-muted-foreground">
          Esta área é exclusiva para administradores do Hotel Ipê Dourado. Se você deveria ter
          acesso, peça para um administrador conceder a claim <code>admin</code> à sua conta.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold">Painel administrativo</h1>
      <nav className="mt-6 flex gap-2 border-b border-border pb-1">
        {LINKS.map((link) => {
          const active = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  )
}
