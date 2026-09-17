import type { ViaCepResponse } from "@/lib/types"

export class CepInvalidoError extends Error {
  constructor() {
    super("CEP inválido ou não encontrado.")
    this.name = "CepInvalidoError"
  }
}

/**
 * Busca um CEP na API pública ViaCEP. Deve ser chamado sempre a partir do
 * navegador (client-side) — nunca de dentro de uma Cloud Function/Route
 * Handler, pois chamadas de rede externas em Cloud Functions do Firebase
 * exigem o plano pago (Blaze).
 */
export async function buscarCep(cep: string): Promise<ViaCepResponse> {
  const digits = cep.replace(/\D/g, "")

  if (digits.length !== 8) {
    throw new CepInvalidoError()
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)

  if (!response.ok) {
    throw new CepInvalidoError()
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    throw new CepInvalidoError()
  }

  return data
}
