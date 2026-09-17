"use server"

import { getClientIp } from "@/lib/get-client-ip"
import { checkRatelimit, loginRatelimit } from "@/lib/upstash"

export async function verificarLimiteLogin(
  email: string
): Promise<{ permitido: boolean }> {
  const ip = await getClientIp()
  const { success } = await checkRatelimit(loginRatelimit, `${ip}:${email.toLowerCase()}`)
  return { permitido: success }
}
