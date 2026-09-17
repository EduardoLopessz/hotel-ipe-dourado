export interface Address {
  cep: string
  rua: string
  bairro: string
  cidade: string
  estado: string
  numero: string
  complemento?: string
}

export interface HotelUser {
  uid: string
  nome: string
  email: string
  telefone?: string
  criadoEm: string
}

export interface RoomType {
  id: string
  nome: string
  slug: string
  descricao: string
  descricaoCurta: string
  capacidade: number
  precoDiaria: number
  metragem: number
  vista: "mar" | "montanha" | "jardim" | "piscina"
  camas: string
  comodidades: string[]
  fotos: string[]
  totalQuartos: number
  politicaCancelamento: string
}

export interface Room {
  id: string
  roomTypeId: string
  numero: string
  andar: number
}

export type ReservationStatus =
  | "pendente"
  | "confirmada"
  | "cancelada"
  | "concluida"

export interface Reservation {
  id: string
  codigoLocalizador: string
  userId: string
  roomTypeId: string
  roomTypeNome: string
  checkIn: string
  checkOut: string
  hospedes: number
  noites: number
  valorDiaria: number
  valorTotal: number
  taxaLimpeza: number
  status: ReservationStatus
  paymentId: string | null
  paymentStatus: "pendente" | "aprovado" | "recusado" | "reembolsado" | null
  criadoEm: string
  atualizadoEm: string
}

export interface Amenity {
  id: string
  nome: string
  descricao: string
  icone: string
  imagem: string
}

export interface Testimonial {
  id: string
  nome: string
  origem: string
  texto: string
  avaliacao: number
  foto: string
}

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
