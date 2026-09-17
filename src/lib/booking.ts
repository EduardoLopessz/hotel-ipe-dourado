import "server-only"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { TAXA_LIMPEZA } from "@/lib/constants"
import { generateLocatorCode, nightsBetween } from "@/lib/utils"
import type { Reservation } from "@/lib/types"

export class DisponibilidadeError extends Error {
  constructor() {
    super("Não há disponibilidade para este quarto nas datas selecionadas.")
    this.name = "DisponibilidadeError"
  }
}

interface CriarReservaParams {
  userId: string
  roomTypeId: string
  roomTypeNome: string
  checkIn: string
  checkOut: string
  hospedes: number
  valorDiaria: number
  totalQuartos: number
}

/**
 * Cria uma reserva verificando e travando a disponibilidade do tipo de
 * quarto na MESMA transação do Firestore: conta as reservas ativas
 * (pendente/confirmada) que se sobrepõem ao período solicitado e só
 * confirma a escrita se ainda houver unidades livres. Isso evita que duas
 * pessoas reservem o último quarto disponível ao mesmo tempo (overbooking).
 */
export async function criarReservaAtomica(
  params: CriarReservaParams
): Promise<Pick<Reservation, "id" | "codigoLocalizador" | "valorTotal">> {
  if (!isFirebaseAdminConfigured) {
    throw new Error(
      "Firebase Admin não configurado neste ambiente. Configure as variáveis FIREBASE_ADMIN_* para habilitar o motor de reservas."
    )
  }

  const noites = nightsBetween(params.checkIn, params.checkOut)
  if (noites <= 0) {
    throw new Error("Datas de check-in e check-out inválidas.")
  }

  const valorTotal = noites * params.valorDiaria + TAXA_LIMPEZA
  const codigoLocalizador = generateLocatorCode()
  const reservationsRef = adminDb.collection("reservations")
  const newReservationRef = reservationsRef.doc()
  const agora = new Date().toISOString()

  await adminDb.runTransaction(async (tx) => {
    // Reservas ativas do mesmo tipo de quarto cujo check-in é anterior ao
    // check-out solicitado — o filtro de sobreposição é concluído em
    // memória logo abaixo, pois o Firestore só permite range-filter em um
    // único campo por consulta.
    const candidatas = await tx.get(
      reservationsRef
        .where("roomTypeId", "==", params.roomTypeId)
        .where("status", "in", ["pendente", "confirmada"])
        .where("checkIn", "<", params.checkOut)
    )

    const reservasConflitantes = candidatas.docs.filter(
      (doc) => doc.data().checkOut > params.checkIn
    )

    if (reservasConflitantes.length >= params.totalQuartos) {
      throw new DisponibilidadeError()
    }

    const reservation: Omit<Reservation, "id"> = {
      codigoLocalizador,
      userId: params.userId,
      roomTypeId: params.roomTypeId,
      roomTypeNome: params.roomTypeNome,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      hospedes: params.hospedes,
      noites,
      valorDiaria: params.valorDiaria,
      valorTotal,
      taxaLimpeza: TAXA_LIMPEZA,
      status: "pendente",
      paymentId: null,
      paymentStatus: "pendente",
      criadoEm: agora,
      atualizadoEm: agora,
    }

    tx.set(newReservationRef, reservation)
  })

  return { id: newReservationRef.id, codigoLocalizador, valorTotal }
}
