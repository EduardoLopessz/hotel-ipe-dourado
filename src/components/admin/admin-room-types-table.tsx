"use client"

import { useState } from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { atualizarTipoQuarto } from "@/app/admin/actions"
import { useAuth } from "@/components/providers/auth-provider"
import type { RoomType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AdminRoomTypesTable({ roomTypes }: { roomTypes: RoomType[] }) {
  const { user } = useAuth()
  const [values, setValues] = useState(
    Object.fromEntries(
      roomTypes.map((r) => [r.id, { precoDiaria: r.precoDiaria, totalQuartos: r.totalQuartos }])
    )
  )
  const [saving, setSaving] = useState<string | null>(null)

  function updateField(id: string, field: "precoDiaria" | "totalQuartos", value: number) {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function handleSalvar(id: string) {
    if (!user) return
    setSaving(id)
    try {
      const idToken = await user.getIdToken()
      await atualizarTipoQuarto(idToken, id, values[id])
      toast.success("Tipo de quarto atualizado.")
    } catch {
      toast.error("Não foi possível salvar as alterações.")
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quarto</TableHead>
            <TableHead>Diária (R$)</TableHead>
            <TableHead>Unidades disponíveis</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomTypes.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.nome}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  className="w-28"
                  value={values[room.id]?.precoDiaria ?? room.precoDiaria}
                  onChange={(e) =>
                    updateField(room.id, "precoDiaria", Number(e.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  className="w-24"
                  value={values[room.id]?.totalQuartos ?? room.totalQuartos}
                  onChange={(e) =>
                    updateField(room.id, "totalQuartos", Number(e.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving === room.id}
                  onClick={() => handleSalvar(room.id)}
                >
                  {saving === room.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Salvar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
