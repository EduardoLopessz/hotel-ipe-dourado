import "server-only"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { ROOM_TYPES } from "@/lib/constants"
import type { RoomType } from "@/lib/types"

/**
 * Busca os tipos de quarto no Firestore (Admin SDK). Sem credenciais reais
 * configuradas, ou em caso de falha na consulta, cai de volta para os
 * dados de exemplo (seed) — assim as páginas continuam funcionando antes
 * do primeiro `npm run seed` num projeto Firebase real.
 */
export async function getRoomTypes(): Promise<RoomType[]> {
  if (!isFirebaseAdminConfigured) {
    return ROOM_TYPES
  }

  try {
    const snapshot = await adminDb.collection("roomTypes").get()
    if (snapshot.empty) {
      return ROOM_TYPES
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RoomType)
  } catch (error) {
    console.warn("[room-types] Falha ao consultar Firestore, usando dados de exemplo:", error)
    return ROOM_TYPES
  }
}

export async function getRoomTypeBySlug(slug: string): Promise<RoomType | null> {
  const roomTypes = await getRoomTypes()
  return roomTypes.find((room) => room.slug === slug) ?? null
}

export async function getRoomTypeById(id: string): Promise<RoomType | null> {
  const roomTypes = await getRoomTypes()
  return roomTypes.find((room) => room.id === id) ?? null
}
