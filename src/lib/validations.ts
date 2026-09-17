import { z } from "zod"

export const enderecoSchema = z.object({
  cep: z
    .string()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido (ex: 12345-678)"),
  rua: z.string().min(1, "Informe a rua"),
  bairro: z.string().min(1, "Informe o bairro"),
  cidade: z.string().min(1, "Informe a cidade"),
  estado: z.string().min(2, "Informe o estado").max(2, "Use a sigla do estado"),
  numero: z.string().min(1, "Informe o número"),
  complemento: z.string().optional(),
})

export const cadastroSchema = z
  .object({
    nome: z.string().min(3, "Informe seu nome completo"),
    email: z.email("Informe um e-mail válido"),
    telefone: z
      .string()
      .min(10, "Informe um telefone válido")
      .max(15, "Informe um telefone válido"),
    senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmarSenha: z.string(),
    endereco: enderecoSchema,
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

export type CadastroInput = z.infer<typeof cadastroSchema>

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  senha: z.string().min(1, "Informe sua senha"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const recuperarSenhaSchema = z.object({
  email: z.email("Informe um e-mail válido"),
})

export const perfilSchema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  telefone: z
    .string()
    .min(10, "Informe um telefone válido")
    .max(15, "Informe um telefone válido"),
})

export type PerfilInput = z.infer<typeof perfilSchema>

export const bookingSchema = z
  .object({
    roomTypeId: z.string().min(1),
    checkIn: z.string().min(1, "Selecione a data de check-in"),
    checkOut: z.string().min(1, "Selecione a data de check-out"),
    hospedes: z.number().min(1).max(10),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "A data de check-out deve ser depois do check-in",
    path: ["checkOut"],
  })

export type BookingInput = z.infer<typeof bookingSchema>

export const contatoSchema = z.object({
  nome: z.string().min(3, "Informe seu nome"),
  email: z.email("Informe um e-mail válido"),
  mensagem: z.string().min(10, "Escreva uma mensagem com pelo menos 10 caracteres"),
})
