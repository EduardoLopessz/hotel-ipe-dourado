"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { enviarMensagemContato } from "@/app/contato/actions"
import { contatoSchema, type ContatoInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function ContatoForm() {
  const [submitting, setSubmitting] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const form = useForm<ContatoInput>({
    resolver: zodResolver(contatoSchema),
    defaultValues: { nome: "", email: "", mensagem: "" },
  })

  async function onSubmit(values: ContatoInput) {
    setSubmitting(true)
    try {
      const result = await enviarMensagemContato(values)
      if (result.success) {
        setEnviado(true)
        form.reset()
      } else {
        toast.error(result.error ?? "Não foi possível enviar sua mensagem.")
      }
    } catch {
      toast.error("Não foi possível enviar sua mensagem.")
    } finally {
      setSubmitting(false)
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 p-8 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="font-medium">Mensagem enviada!</p>
        <p className="text-sm text-muted-foreground">
          Obrigado pelo contato. Nossa equipe responderá em breve.
        </p>
        <Button variant="outline" size="sm" onClick={() => setEnviado(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea placeholder="Como podemos ajudar?" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Enviar mensagem
        </Button>
      </form>
    </Form>
  )
}
