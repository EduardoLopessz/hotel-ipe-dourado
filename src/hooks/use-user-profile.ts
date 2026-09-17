"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import { useAuth } from "@/components/providers/auth-provider"
import type { Address, HotelUser } from "@/lib/types"

interface UseUserProfileResult {
  profile: HotelUser | null
  address: Address | null
  loading: boolean
  atualizarPerfil: (dados: { nome: string; telefone: string }) => Promise<void>
  atualizarEndereco: (endereco: Address) => Promise<void>
}

export function useUserProfile(): UseUserProfileResult {
  const { user } = useAuth()
  const [profile, setProfile] = useState<HotelUser | null>(null)
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(() => Boolean(user && db))

  useEffect(() => {
    if (!user || !db) {
      return
    }

    let cancelled = false

    async function load() {
      if (!db || !user) return
      setLoading(true)
      const [userSnap, addressSnap] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDoc(doc(db, "users", user.uid, "addresses", "principal")),
      ])

      if (cancelled) return

      if (userSnap.exists()) {
        setProfile(userSnap.data() as HotelUser)
      }
      if (addressSnap.exists()) {
        setAddress(addressSnap.data() as Address)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user])

  async function atualizarPerfil(dados: { nome: string; telefone: string }) {
    if (!db || !user) return
    await setDoc(doc(db, "users", user.uid), dados, { merge: true })
    setProfile((prev) => (prev ? { ...prev, ...dados } : prev))
  }

  async function atualizarEndereco(endereco: Address) {
    if (!db || !user) return
    await setDoc(doc(db, "users", user.uid, "addresses", "principal"), endereco)
    setAddress(endereco)
  }

  return { profile, address, loading, atualizarPerfil, atualizarEndereco }
}
