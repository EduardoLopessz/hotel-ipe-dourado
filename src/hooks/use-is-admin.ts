"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/components/providers/auth-provider"

export function useIsAdmin() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(() => loading || Boolean(user))

  useEffect(() => {
    if (loading || !user) {
      return
    }

    let cancelled = false
    user
      .getIdTokenResult()
      .then((token) => {
        if (!cancelled) setIsAdmin(token.claims.admin === true)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, loading])

  return { isAdmin, checking: checking || loading }
}
