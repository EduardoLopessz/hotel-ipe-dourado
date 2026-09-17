import { NextResponse } from "next/server"

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { buscarPagamento, isMercadoPagoConfigured } from "@/lib/mercadopago"

/**
 * Webhook de notificações do Mercado Pago (Checkout Pro, sandbox).
 * Ao receber uma notificação de pagamento, busca os detalhes junto à API
 * do Mercado Pago e atualiza a reserva correspondente (via
 * external_reference) com o status do pagamento.
 */
export async function POST(request: Request) {
  if (!isMercadoPagoConfigured || !isFirebaseAdminConfigured) {
    return NextResponse.json({ ignored: true }, { status: 200 })
  }

  let body: { type?: string; data?: { id?: string } } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const topic = body.type ?? searchParams.get("type") ?? searchParams.get("topic")
  const paymentId = body.data?.id ?? searchParams.get("id") ?? searchParams.get("data.id")

  if (topic !== "payment" || !paymentId) {
    return NextResponse.json({ ignored: true }, { status: 200 })
  }

  try {
    const payment = await buscarPagamento(String(paymentId))
    const reservationId = payment.external_reference
    if (!reservationId) {
      return NextResponse.json({ ignored: true }, { status: 200 })
    }

    const statusMap: Record<string, { status: string; paymentStatus: string }> = {
      approved: { status: "confirmada", paymentStatus: "aprovado" },
      pending: { status: "pendente", paymentStatus: "pendente" },
      in_process: { status: "pendente", paymentStatus: "pendente" },
      rejected: { status: "cancelada", paymentStatus: "recusado" },
      refunded: { status: "cancelada", paymentStatus: "reembolsado" },
      cancelled: { status: "cancelada", paymentStatus: "recusado" },
    }

    const mapped = statusMap[payment.status ?? ""] ?? {
      status: "pendente",
      paymentStatus: "pendente",
    }

    await adminDb
      .collection("reservations")
      .doc(reservationId)
      .update({
        paymentId: String(paymentId),
        status: mapped.status,
        paymentStatus: mapped.paymentStatus,
        atualizadoEm: new Date().toISOString(),
      })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[webhook mercadopago] erro ao processar notificação:", error)
    return NextResponse.json({ error: "Erro ao processar notificação" }, { status: 500 })
  }
}
