"use client"

import { useState } from "react"
import { toast } from "sonner"

import { atualizarStatusReserva } from "@/app/admin/actions"
import { useAuth } from "@/components/providers/auth-provider"
import type { Reservation, ReservationStatus } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "concluida", label: "Concluída" },
]

const STATUS_VARIANT: Record<ReservationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pendente: "outline",
  confirmada: "default",
  cancelada: "destructive",
  concluida: "secondary",
}

export function AdminReservationsTable({ reservations }: { reservations: Reservation[] }) {
  const { user } = useAuth()
  const [items, setItems] = useState(reservations)
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleStatusChange(reservationId: string, status: ReservationStatus) {
    if (!user) return
    setUpdating(reservationId)
    try {
      const idToken = await user.getIdToken()
      await atualizarStatusReserva(idToken, reservationId, status)
      setItems((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
      )
      toast.success("Status atualizado.")
    } catch {
      toast.error("Não foi possível atualizar o status.")
    } finally {
      setUpdating(null)
    }
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma reserva encontrada.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Localizador</TableHead>
            <TableHead>Quarto</TableHead>
            <TableHead>Datas</TableHead>
            <TableHead>Hóspedes</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-mono text-xs">{reservation.codigoLocalizador}</TableCell>
              <TableCell>{reservation.roomTypeNome}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)}
              </TableCell>
              <TableCell>{reservation.hospedes}</TableCell>
              <TableCell>{formatCurrency(reservation.valorTotal)}</TableCell>
              <TableCell>
                <Select
                  items={STATUS_OPTIONS}
                  value={reservation.status}
                  disabled={updating === reservation.id}
                  onValueChange={(value) =>
                    handleStatusChange(reservation.id, value as ReservationStatus)
                  }
                >
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue>
                      <Badge variant={STATUS_VARIANT[reservation.status]}>
                        {STATUS_OPTIONS.find((o) => o.value === reservation.status)?.label}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
