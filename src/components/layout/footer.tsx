import Link from "next/link"
import { Palmtree, Mail, Phone, MapPin } from "lucide-react"

import { HOTEL_ADDRESS, HOTEL_EMAIL, HOTEL_PHONE } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4H13V7a1 1 0 0 1 1-1h2z" />
    </svg>
  )
}

const COLUNAS = [
  {
    titulo: "Hospedagem",
    links: [
      { href: "/quartos", label: "Quartos e Suítes" },
      { href: "/comodidades", label: "Comodidades" },
      { href: "/quartos?vista=mar", label: "Vista Mar" },
      { href: "/quartos?vista=montanha", label: "Vista Serra" },
    ],
  },
  {
    titulo: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre o hotel" },
      { href: "/contato", label: "Contato" },
      { href: "/minha-conta", label: "Minha conta" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
            <Palmtree className="size-5" />
            Hotel Ipê Dourado
          </Link>
          <p className="mt-3 max-w-xs text-sm text-secondary-foreground/70">
            Um resort de padrão internacional onde a serra encontra o mar. Hospitalidade,
            natureza e conforto em perfeita harmonia.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-secondary-foreground/70 transition hover:text-secondary-foreground"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-secondary-foreground/70 transition hover:text-secondary-foreground"
            >
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>

        {COLUNAS.map((coluna) => (
          <div key={coluna.titulo}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
              {coluna.titulo}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/70">
              {coluna.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-secondary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Contato</h3>
          <ul className="mt-3 space-y-3 text-sm text-secondary-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{HOTEL_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${HOTEL_PHONE}`} className="hover:text-secondary-foreground">
                {HOTEL_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${HOTEL_EMAIL}`} className="hover:text-secondary-foreground">
                {HOTEL_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="bg-secondary-foreground/10" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-secondary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Hotel Ipê Dourado. Projeto fictício para fins de demonstração.</p>
        <p>Pagamentos processados em ambiente de testes (sandbox) do Mercado Pago.</p>
      </div>
    </footer>
  )
}
