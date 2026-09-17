"use server"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { criarReservaAtomica, DisponibilidadeError } from "@/lib/booking"
import { getClientIp } from "@/lib/get-client-ip"
import { isMercadoPagoConfigured, criarPreferenciaPagamento } from "@/lib/mercadopago"
import { checkRatelimit, bookingRatelimit } from "@/lib/upstash"
import { bookingSchema } from "@/lib/validations"

interface IniciarReservaInput {
  userId: string
  roomTypeId: string
  roomTypeNome: string
  valorDiaria: number
  totalQuartos: number
  checkIn: string
  checkOut: string
  hospedes: number
}

interface IniciarReservaResult {
  success: boolean
  error?: string
  redirectUrl?: string
}

export async function iniciarReserva(input: IniciarReservaInput): Promise<IniciarReservaResult> {
  const parsed = bookingSchema.safeParse({
    roomTypeId: input.roomTypeId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    hospedes: input.hospedes,
  })

  if (!parsed.success) {
    return { success: false, error: "Dados de reserva inválidos." }
  }

  if (!input.userId) {
    return { success: false, error: "Faça login para continuar com a reserva." }
  }

  const ip = await getClientIp()
  const { success: dentroDoLimite } = await checkRatelimit(
    bookingRatelimit,
    `${input.userId}:${ip}`
  )
  if (!dentroDoLimite) {
    return {
      success: false,
      error: "Muitas tentativas de reserva. Aguarde um minuto e tente novamente.",
    }
  }

  try {
    const { id: reservationId, codigoLocalizador, valorTotal } = await criarReservaAtomica({
      userId: input.userId,
      roomTypeId: input.roomTypeId,
      roomTypeNome: input.roomTypeNome,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      hospedes: input.hospedes,
      valorDiaria: input.valorDiaria,
      totalQuartos: input.totalQuartos,
    })

    if (isMercadoPagoConfigured) {
      const preference = await criarPreferenciaPagamento({
        reservationId,
        titulo: `${input.roomTypeNome} — Hotel Ipê Dourado`,
        valorTotal,
        codigoLocalizador,
      })

      return { success: true, redirectUrl: preference.init_point ?? preference.sandbox_init_point }
    }

    // Sem credenciais reais do Mercado Pago configuradas: simula a
    // aprovação do pagamento para que o fluxo de reserva possa ser
    // demonstrado de ponta a ponta neste ambiente.
    if (isFirebaseAdminConfigured) {
      await adminDb.collection("reservations").doc(reservationId).update({
        status: "confirmada",
        paymentId: `SIMULADO-${reservationId.slice(0, 8).toUpperCase()}`,
        paymentStatus: "aprovado",
        atualizadoEm: new Date().toISOString(),
      })
    }

    return { success: true, redirectUrl: `/reservar/confirmacao/${codigoLocalizador}` }
  } catch (error) {
    if (error instanceof DisponibilidadeError) {
      return { success: false, error: error.message }
    }
    console.error("[iniciarReserva] erro inesperado:", error)
    return { success: false, error: "Não foi possível concluir a reserva. Tente novamente." }
  }
}
