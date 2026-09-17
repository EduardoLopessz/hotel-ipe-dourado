"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useCep } from "@/hooks/use-cep"
import type { Address } from "@/lib/types"
import { enderecoSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface EnderecoFormProps {
  address: Address | null
  onSalvar: (endereco: Address) => Promise<void>
}

export function EnderecoForm({ address, onSalvar }: EnderecoFormProps) {
  const { loading: buscandoCep, error: erroCep, buscar } = useCep()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<Address>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: address ?? {
      cep: "",
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
      numero: "",
      complemento: "",
    },
  })

  useEffect(() => {
    if (address) form.reset(address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  async function handleCepBlur(cep: string) {
    const resultado = await buscar(cep)
    if (resultado) {
      form.setValue("rua", resultado.logradouro, { shouldValidate: true })
      form.setValue("bairro", resultado.bairro, { shouldValidate: true })
      form.setValue("cidade", resultado.localidade, { shouldValidate: true })
      form.setValue("estado", resultado.uf, { shouldValidate: true })
      form.setFocus("numero")
    }
  }

  async function onSubmit(values: Address) {
    setSubmitting(true)
    try {
      await onSalvar(values)
      toast.success("Endereço atualizado com sucesso.")
    } catch {
      toast.error("Não foi possível salvar o endereço.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-ph-mask>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="12345-678"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur()
                        handleCepBlur(e.target.value)
                      }}
                    />
                    {buscandoCep && (
                      <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </FormControl>
                {erroCep && <p className="text-sm text-destructive">{erroCep}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rua"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Salvar endereço
        </Button>
      </form>
    </Form>
  )
}
