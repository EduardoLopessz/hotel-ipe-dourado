"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CheckCircle2, Loader2 } from "lucide-react"
import { z } from "zod"

import { useAuth } from "@/components/providers/auth-provider"
import { recuperarSenhaSchema } from "@/lib/validations"
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

type RecuperarSenhaInput = z.infer<typeof recuperarSenhaSchema>

export function RecuperarSenhaForm() {
  const { recuperarSenha } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const form = useForm<RecuperarSenhaInput>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: RecuperarSenhaInput) {
    setSubmitting(true)
    try {
      await recuperarSenha(values.email)
    } catch {
      // Por segurança, não revelamos se o e-mail existe ou não.
    } finally {
      setSubmitting(false)
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="font-medium">Verifique seu e-mail</p>
        <p className="text-sm text-muted-foreground">
          Se houver uma conta associada a este e-mail, enviamos um link para redefinir sua senha.
        </p>
        <Button variant="outline" size="sm" render={<Link href="/login" />} nativeButton={false}>
          Voltar para o login
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail cadastrado</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Enviar link de recuperação
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </Form>
  )
}
