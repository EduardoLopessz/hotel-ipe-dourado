"use client"

import { useState } from "react"
import { CalendarDays, Loader2, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

import type { Reservation } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const STATUS_LABEL: Record<Reservation["status"], string> = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  concluida: "Concluída",
}

const STATUS_VARIANT: Record<Reservation["status"], "default" | "secondary" | "destructive" | "outline"> = {
  pendente: "outline",
  confirmada: "default",
  cancelada: "destructive",
  concluida: "secondary",
}

interface ReservationCardProps {
  reservation: Reservation
  onCancelar: (id: string) => Promise<void>
}

export function ReservationCard({ reservation, onCancelar }: ReservationCardProps) {
  const [cancelando, setCancelando] = useState(false)
  const podeCancel = reservation.status === "pendente" || reservation.status === "confirmada"

  async function handleCancelar() {
    setCancelando(true)
    try {
      await onCancelar(reservation.id)
      toast.success("Reserva cancelada.")
    } catch {
      toast.error("Não foi possível cancelar a reserva.")
    } finally {
      setCancelando(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-semibold">{reservation.roomTypeNome}</h3>
            <Badge variant={STATUS_VARIANT[reservation.status]}>
              {STATUS_LABEL[reservation.status]}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Localizador: <span className="font-mono">{reservation.codigoLocalizador}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> {reservation.hospedes} hóspedes
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {reservation.noites} noites
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-lg font-semibold">{formatCurrency(reservation.valorTotal)}</span>
          {podeCancel && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="outline" size="sm" disabled={cancelando} />
                }
              >
                {cancelando && <Loader2 className="size-3.5 animate-spin" />}
                Cancelar reserva
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar esta reserva?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Verifique a política de cancelamento antes de confirmar. Esta ação não pode
                    ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelar}>
                    Confirmar cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
