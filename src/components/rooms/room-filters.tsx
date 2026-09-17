"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VISTA_OPTIONS = [
  { value: "mar", label: "Vista mar" },
  { value: "montanha", label: "Vista serra" },
  { value: "jardim", label: "Vista jardim" },
  { value: "piscina", label: "Vista piscina" },
]

const CAPACIDADE_OPTIONS = [
  { value: "1", label: "1+ hóspede" },
  { value: "2", label: "2+ hóspedes" },
  { value: "3", label: "3+ hóspedes" },
  { value: "4", label: "4+ hóspedes" },
]

const PRECO_OPTIONS = [
  { value: "1000", label: "Até R$ 1.000" },
  { value: "2000", label: "Até R$ 2.000" },
  { value: "3000", label: "Até R$ 3.000" },
  { value: "999999", label: "Qualquer preço" },
]

export function RoomFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const vista = searchParams.get("vista") ?? ""
  const capacidade = searchParams.get("capacidade") ?? ""
  const precoMax = searchParams.get("precoMax") ?? ""

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters = vista || capacidade || precoMax

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        items={VISTA_OPTIONS}
        value={vista || undefined}
        onValueChange={(v) => updateParam("vista", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Vista" />
        </SelectTrigger>
        <SelectContent>
          {VISTA_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={CAPACIDADE_OPTIONS}
        value={capacidade || undefined}
        onValueChange={(v) => updateParam("capacidade", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Hóspedes" />
        </SelectTrigger>
        <SelectContent>
          {CAPACIDADE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={PRECO_OPTIONS}
        value={precoMax || undefined}
        onValueChange={(v) => updateParam("precoMax", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Preço máximo" />
        </SelectTrigger>
        <SelectContent>
          {PRECO_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push(pathname)}>
          <X className="size-3.5" /> Limpar filtros
        </Button>
      )}
    </div>
  )
}
