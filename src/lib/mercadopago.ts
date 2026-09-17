import "server-only"

import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

export const isMercadoPagoConfigured = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN)

const client = isMercadoPagoConfigured
  ? new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })
  : null

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

interface CriarPreferenciaParams {
  reservationId: string
  titulo: string
  valorTotal: number
  codigoLocalizador: string
}

/**
 * Cria uma preferência de pagamento no Mercado Pago (Checkout Pro), sempre
 * em modo sandbox/teste — nunca deve ser usado com credenciais de produção
 * neste projeto fictício.
 */
export async function criarPreferenciaPagamento(params: CriarPreferenciaParams) {
  if (!client) {
    throw new Error("Mercado Pago não configurado neste ambiente.")
  }

  const baseUrl = getBaseUrl()
  const preference = new Preference(client)

  return preference.create({
    body: {
      items: [
        {
          id: params.reservationId,
          title: params.titulo,
          quantity: 1,
          unit_price: params.valorTotal,
          currency_id: "BRL",
        },
      ],
      external_reference: params.reservationId,
      back_urls: {
        success: `${baseUrl}/reservar/confirmacao/${params.codigoLocalizador}`,
        failure: `${baseUrl}/reservar/confirmacao/${params.codigoLocalizador}?status=failure`,
        pending: `${baseUrl}/reservar/confirmacao/${params.codigoLocalizador}?status=pending`,
      },
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "HOTEL IPE DOURADO",
    },
  })
}

export async function buscarPagamento(paymentId: string) {
  if (!client) {
    throw new Error("Mercado Pago não configurado neste ambiente.")
  }

  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}
