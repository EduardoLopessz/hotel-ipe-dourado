"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { verificarLimiteLogin } from "@/app/login/actions"
import { useAuth } from "@/components/providers/auth-provider"
import { loginSchema, type LoginInput } from "@/lib/validations"
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

function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos."
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    default:
      return "Não foi possível entrar. Tente novamente."
  }
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/minha-conta"
  const { entrar, entrarComGoogle } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  })

  async function onSubmit(values: LoginInput) {
    setSubmitting(true)
    try {
      const { permitido } = await verificarLimiteLogin(values.email)
      if (!permitido) {
        toast.error("Muitas tentativas de login. Aguarde um minuto e tente novamente.")
        return
      }

      await entrar(values.email, values.senha)
      toast.success("Bem-vindo(a) de volta!")
      router.push(redirectTo)
    } catch (error) {
      const code = (error as { code?: string })?.code ?? ""
      toast.error(code ? friendlyAuthError(code) : "Não foi possível entrar.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setSubmitting(true)
    try {
      await entrarComGoogle()
      toast.success("Bem-vindo(a)!")
      router.push(redirectTo)
    } catch {
      toast.error("Não foi possível entrar com o Google.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-ph-mask>
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
          name="senha"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <Link href="/recuperar-senha" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="Sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Entrar
        </Button>

        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-card px-2">ou</span>
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={submitting}
          onClick={handleGoogle}
        >
          Entrar com Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}
