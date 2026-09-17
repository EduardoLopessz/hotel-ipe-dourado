"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarCheck, User } from "lucide-react"

import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/minha-conta", label: "Dados pessoais", icon: User },
  { href: "/minha-conta/reservas", label: "Minhas reservas", icon: CalendarCheck },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 border-b border-border pb-1">
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
  )
}
