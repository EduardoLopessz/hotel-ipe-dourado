import "server-only"

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const isUpstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

/** Limite para tentativas de login: 5 tentativas a cada 60s por IP. */
export const loginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "ratelimit:login",
      analytics: true,
    })
  : null

/** Limite para criação de reservas: 8 tentativas a cada 60s por usuário/IP. */
export const bookingRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "60 s"),
      prefix: "ratelimit:booking",
      analytics: true,
    })
  : null

interface RatelimitCheck {
  success: boolean
  remaining: number
}

/**
 * Aplica rate limiting se o Upstash estiver configurado. Sem credenciais
 * (ambiente de desenvolvimento/placeholder), a checagem é ignorada e a
 * requisição sempre passa — evita quebrar o fluxo antes da configuração.
 */
export async function checkRatelimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RatelimitCheck> {
  if (!limiter) {
    return { success: true, remaining: 999 }
  }

  const result = await limiter.limit(identifier)
  return { success: result.success, remaining: result.remaining }
}
