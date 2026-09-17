"use client"

import posthog from "posthog-js"

let initialized = false

export function initPostHog() {
  if (initialized || typeof window === "undefined") {
    return
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    return
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    session_recording: {
      // Mascara campos sensíveis (CEP, endereço, telefone) no session replay.
      maskTextSelector: "[data-ph-mask]",
      maskAllInputs: false,
    },
  })

  initialized = true
}

export { posthog }
