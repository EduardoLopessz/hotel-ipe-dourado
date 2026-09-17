import "server-only"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import type { Reservation } from "@/lib/types"

export async function getReservationByCode(codigo: string): Promise<Reservation | null> {
  if (!isFirebaseAdminConfigured) {
    return null
  }

  try {
    const snapshot = await adminDb
      .collection("reservations")
      .where("codigoLocalizador", "==", codigo)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Reservation
  } catch (error) {
    console.warn("[reservations] Falha ao buscar reserva:", error)
    return null
  }
}
