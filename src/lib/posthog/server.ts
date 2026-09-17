import "server-only"

import { PostHog } from "posthog-node"

let client: PostHog | null = null

export function getPostHogServerClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    return null
  }

  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  }

  return client
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const posthogClient = getPostHogServerClient()
  if (!posthogClient) {
    return
  }

  posthogClient.capture({ distinctId, event, properties })
  await posthogClient.shutdown()
}
