"use client"

import { useCallback, useEffect, useState } from "react"
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import { useAuth } from "@/components/providers/auth-provider"
import type { Reservation } from "@/lib/types"

export function useReservations() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const recarregar = useCallback(async () => {
    if (!user || !db) {
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid),
      orderBy("criadoEm", "desc")
    )
    const snapshot = await getDocs(q)
    setReservations(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Reservation))
    setLoading(false)
  }, [user])

  useEffect(() => {
    queueMicrotask(() => {
      recarregar()
    })
  }, [recarregar])

  async function cancelarReserva(reservationId: string) {
    if (!db) return
    await updateDoc(doc(db, "reservations", reservationId), {
      status: "cancelada",
      atualizadoEm: new Date().toISOString(),
    })
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: "cancelada" } : r))
    )
  }

  return { reservations, loading, recarregar, cancelarReserva }
}
