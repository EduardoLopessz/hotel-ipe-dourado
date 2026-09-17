"use client"

import { useCallback, useState } from "react"

import { buscarCep, CepInvalidoError } from "@/lib/viacep"
import type { ViaCepResponse } from "@/lib/types"

interface UseCepResult {
  loading: boolean
  error: string | null
  buscar: (cep: string) => Promise<ViaCepResponse | null>
}

export function useCep(): UseCepResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscar = useCallback(async (cep: string) => {
    setError(null)

    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) {
      return null
    }

    setLoading(true)
    try {
      const resultado = await buscarCep(cep)
      return resultado
    } catch (err) {
      if (err instanceof CepInvalidoError) {
        setError(err.message)
      } else {
        setError("Não foi possível buscar o CEP agora. Tente novamente.")
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, buscar }
}
