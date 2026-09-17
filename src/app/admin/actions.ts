"use server"

import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import type { ReservationStatus } from "@/lib/types"

async function assertIsAdmin(idToken: string) {
  if (!isFirebaseAdminConfigured) {
    throw new Error("Firebase Admin não configurado.")
  }
  const decoded = await adminAuth.verifyIdToken(idToken)
  if (decoded.admin !== true) {
    throw new Error("Acesso restrito a administradores.")
  }
  return decoded
}

export async function atualizarStatusReserva(
  idToken: string,
  reservationId: string,
  status: ReservationStatus
) {
  await assertIsAdmin(idToken)
  await adminDb.collection("reservations").doc(reservationId).update({
    status,
    atualizadoEm: new Date().toISOString(),
  })
  return { success: true }
}

export async function atualizarTipoQuarto(
  idToken: string,
  roomTypeId: string,
  dados: { precoDiaria: number; totalQuartos: number }
) {
  await assertIsAdmin(idToken)
  await adminDb.collection("roomTypes").doc(roomTypeId).set(dados, { merge: true })
  return { success: true }
}
