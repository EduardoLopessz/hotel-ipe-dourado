export { cn } from "cn"

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Converte uma string "YYYY-MM-DD" num Date à meia-noite no fuso horário
 * LOCAL (em vez de UTC, que é o que `new Date("YYYY-MM-DD")` faz por
 * padrão) — evita que a data "volte" um dia ao formatar/exibir.
 */
function parseLocalDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseLocalDateOnly(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

/**
 * Formata uma data como "YYYY-MM-DD" usando o fuso horário LOCAL do
 * navegador/servidor — ao contrário de `date.toISOString().slice(0, 10)`,
 * que converte para UTC e pode "voltar" um dia dependendo do fuso e do
 * horário (ex: selecionar 1º de outubro à noite no Brasil vira
 * "2026-09-30" em UTC).
 */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end.getTime() - start.getTime()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export function generateLocatorCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `IPD-${code}`
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}
