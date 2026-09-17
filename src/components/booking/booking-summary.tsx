"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarDays, Loader2, LogIn, Users } from "lucide-react"
import { toast } from "sonner"

import { iniciarReserva } from "@/app/reservar/[roomTypeId]/actions"
import { useAuth } from "@/components/providers/auth-provider"
import { TAXA_LIMPEZA } from "@/lib/constants"
import type { RoomType } from "@/lib/types"
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BookingSummaryProps {
  room: RoomType
  checkIn: string
  checkOut: string
  hospedes: number
}

export function BookingSummary({ room, checkIn, checkOut, hospedes }: BookingSummaryProps) {
  const { user, configured } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = useState(false)

  const noites = nightsBetween(checkIn, checkOut)
  const subtotal = noites * room.precoDiaria
  const total = subtotal + TAXA_LIMPEZA

  async function handleConfirmar() {
    if (!user) return
    setSubmitting(true)
    try {
      const result = await iniciarReserva({
        userId: user.uid,
        roomTypeId: room.id,
        roomTypeNome: room.nome,
        valorDiaria: room.precoDiaria,
        totalQuartos: room.totalQuartos,
        checkIn,
        checkOut,
        hospedes,
      })

      if (!result.success || !result.redirectUrl) {
        toast.error(result.error ?? "Não foi possível concluir a reserva.")
        setSubmitting(false)
        return
      }

      router.push(result.redirectUrl)
    } catch {
      toast.error("Não foi possível concluir a reserva. Tente novamente.")
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="flex gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
              <Image src={room.fotos[0]} alt={room.nome} fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">{room.nome}</h2>
              <p className="text-sm text-muted-foreground">{room.descricaoCurta}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="size-4 text-primary" />
            <span>
              {formatDate(checkIn)} → {formatDate(checkOut)} ({noites} {noites === 1 ? "noite" : "noites"})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-primary" />
            <span>{hospedes} {hospedes === 1 ? "hóspede" : "hóspedes"}</span>
          </div>
        </div>

        <Separator className="my-6" />

        <h3 className="font-heading text-lg font-semibold">Política de cancelamento</h3>
        <p className="mt-2 text-sm text-muted-foreground">{room.politicaCancelamento}</p>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardContent className="space-y-3">
            <h3 className="font-heading text-lg font-semibold">Resumo do pedido</h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {formatCurrency(room.precoDiaria)} x {noites} {noites === 1 ? "noite" : "noites"}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxa de limpeza</span>
              <span>{formatCurrency(TAXA_LIMPEZA)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {!configured ? (
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Firebase não configurado neste ambiente — não é possível concluir reservas até que
                as credenciais sejam adicionadas.
              </p>
            ) : !user ? (
              <Button
                size="lg"
                className="w-full gap-2"
                render={
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`${pathname}?${searchParams.toString()}`)}`}
                  />
                }
                nativeButton={false}
              >
                <LogIn className="size-4" /> Entrar para reservar
              </Button>
            ) : (
              <Button size="lg" className="w-full" disabled={submitting} onClick={handleConfirmar}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Confirmar e pagar
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Pagamento processado em ambiente de testes (sandbox) do Mercado Pago.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
