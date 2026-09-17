import "server-only"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import type { RoomType } from "@/lib/types"

export interface RoomTypeAvailability extends RoomType {
  quartosDisponiveis: number
}

/**
 * Calcula, para cada tipo de quarto, quantas unidades continuam livres no
 * período informado — consultando de uma só vez as reservas ativas
 * (pendente/confirmada) que se sobrepõem às datas e contando quantas
 * pertencem a cada tipo de quarto. Mesma regra de sobreposição usada na
 * transação atômica de criação de reserva (src/lib/booking.ts), garantindo
 * que a busca de disponibilidade reflita exatamente o que será travado na
 * hora de reservar.
 *
 * Sem datas informadas (ou sem Firebase Admin configurado), retorna a
 * capacidade total de cada tipo de quarto, sem checar reservas.
 */
export async function getRoomTypesWithAvailability(
  roomTypes: RoomType[],
  checkIn?: string,
  checkOut?: string
): Promise<RoomTypeAvailability[]> {
  if (!checkIn || !checkOut || !isFirebaseAdminConfigured) {
    return roomTypes.map((room) => ({ ...room, quartosDisponiveis: room.totalQuartos }))
  }

  try {
    const snapshot = await adminDb
      .collection("reservations")
      .where("status", "in", ["pendente", "confirmada"])
      .where("checkIn", "<", checkOut)
      .get()

    const conflitantesPorTipo = new Map<string, number>()
    for (const doc of snapshot.docs) {
      const data = doc.data()
      if (data.checkOut > checkIn) {
        conflitantesPorTipo.set(
          data.roomTypeId,
          (conflitantesPorTipo.get(data.roomTypeId) ?? 0) + 1
        )
      }
    }

    return roomTypes.map((room) => ({
      ...room,
      quartosDisponiveis: Math.max(
        0,
        room.totalQuartos - (conflitantesPorTipo.get(room.id) ?? 0)
      ),
    }))
  } catch (error) {
    console.warn("[availability] Falha ao consultar disponibilidade:", error)
    return roomTypes.map((room) => ({ ...room, quartosDisponiveis: room.totalQuartos }))
  }
}
