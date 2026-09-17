"use client"

import { Loader2 } from "lucide-react"

import { useUserProfile } from "@/hooks/use-user-profile"
import { AccountNav } from "@/components/account/account-nav"
import { PerfilForm } from "@/components/account/perfil-form"
import { EnderecoForm } from "@/components/account/endereco-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MinhaContaPage() {
  const { profile, address, loading, atualizarPerfil, atualizarEndereco } = useUserProfile()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold">Minha conta</h1>
        <p className="mt-1 text-muted-foreground">Gerencie seus dados pessoais e endereço.</p>
      </div>

      <AccountNav />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
              <CardDescription>Suas informações de contato.</CardDescription>
            </CardHeader>
            <CardContent>
              <PerfilForm profile={profile} onSalvar={atualizarPerfil} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Usado como endereço de cobrança nas reservas.</CardDescription>
            </CardHeader>
            <CardContent>
              <EnderecoForm address={address} onSalvar={atualizarEndereco} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
