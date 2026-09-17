"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User as UserIcon, CalendarCheck } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const { user, loading, sair } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/login" />} nativeButton={false}>
          Entrar
        </Button>
        <Button size="sm" render={<Link href="/cadastro" />} nativeButton={false}>
          Cadastrar
        </Button>
      </div>
    )
  }

  const initials = (user.displayName ?? user.email ?? "H")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  async function handleSair() {
    await sair()
    toast.success("Você saiu da sua conta.")
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "Usuário"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {user.displayName ?? user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/minha-conta" />}>
          <UserIcon /> Minha conta
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/minha-conta/reservas" />}>
          <CalendarCheck /> Minhas reservas
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSair}>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
