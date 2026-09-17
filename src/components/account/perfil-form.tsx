"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import type { HotelUser } from "@/lib/types"
import { perfilSchema, type PerfilInput as PerfilInputType } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface PerfilFormProps {
  profile: HotelUser | null
  onSalvar: (dados: { nome: string; telefone: string }) => Promise<void>
}

export function PerfilForm({ profile, onSalvar }: PerfilFormProps) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<PerfilInputType>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nome: profile?.nome ?? user?.displayName ?? "", telefone: profile?.telefone ?? "" },
  })

  useEffect(() => {
    form.reset({
      nome: profile?.nome ?? user?.displayName ?? "",
      telefone: profile?.telefone ?? "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function onSubmit(values: PerfilInputType) {
    setSubmitting(true)
    try {
      await onSalvar(values)
      toast.success("Dados atualizados com sucesso.")
    } catch {
      toast.error("Não foi possível salvar seus dados.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-ph-mask>
        <div className="grid gap-1.5">
          <Label>E-mail</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Salvar alterações
        </Button>
      </form>
    </Form>
  )
}
