"use server"

import { contatoSchema } from "@/lib/validations"

interface ContatoResult {
  success: boolean
  error?: string
}

export async function enviarMensagemContato(input: {
  nome: string
  email: string
  mensagem: string
}): Promise<ContatoResult> {
  const parsed = contatoSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: "Verifique os campos preenchidos." }
  }

  // Projeto fictício: aqui entraria o envio real (e-mail transacional, CRM, etc.).
  console.log("[contato] Nova mensagem recebida:", parsed.data)

  return { success: true }
}
