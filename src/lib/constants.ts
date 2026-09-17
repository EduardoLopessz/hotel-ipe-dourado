import type { Amenity, RoomType, Testimonial } from "@/lib/types"

export const HOTEL_NAME = "Hotel Ipê Dourado"
export const HOTEL_TAGLINE = "Onde a serra encontra o mar"
export const HOTEL_PHONE = "+55 (24) 3333-1010"
export const HOTEL_EMAIL = "reservas@hotelipedourado.com.br"
export const HOTEL_ADDRESS = "Estrada do Ipê Dourado, km 7 — Paraty, RJ"

export function unsplash(id: string, width = 1600, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export const HERO_IMAGE = unsplash("1540541338287-41700207dee6", 2400)

export const ROOM_TYPES: RoomType[] = [
  {
    id: "suite-vista-mar",
    slug: "suite-vista-mar",
    nome: "Suíte Vista Mar",
    descricaoCurta: "Varanda privativa com vista panorâmica para o oceano.",
    descricao:
      "Nossa Suíte Vista Mar oferece uma experiência serena com varanda privativa voltada para o Atlântico, cama king-size, banheira de hidromassagem e amenities exclusivos. Ideal para casais que buscam romance e vista para o pôr do sol.",
    capacidade: 2,
    precoDiaria: 1890,
    metragem: 42,
    vista: "mar",
    camas: "1 cama king-size",
    comodidades: [
      "Wi-Fi de alta velocidade",
      "Ar-condicionado",
      "Varanda privativa",
      "Banheira de hidromassagem",
      "Frigobar premium",
      "Cofre digital",
      "Smart TV 55\"",
      "Roupão e chinelos",
    ],
    fotos: [
      unsplash("1566073771259-6a8506099945"),
      unsplash("1521783593447-5702b9bfd267"),
      unsplash("1591088398332-8a7791972843"),
      unsplash("1595576508898-0ad5c879a061"),
    ],
    totalQuartos: 12,
    politicaCancelamento:
      "Cancelamento gratuito até 5 dias antes do check-in. Após esse prazo, será cobrada a primeira diária.",
  },
  {
    id: "suite-serra",
    slug: "suite-serra",
    nome: "Suíte Serra Verde",
    descricaoCurta: "Aconchego rústico-chique com vista para a Mata Atlântica.",
    descricao:
      "Cercada pela Mata Atlântica, a Suíte Serra Verde combina design rústico-chique com todo o conforto contemporâneo. Lareira ecológica, deck privativo e vista para as montanhas tornam essa suíte perfeita para quem busca tranquilidade.",
    capacidade: 3,
    precoDiaria: 1590,
    metragem: 38,
    vista: "montanha",
    camas: "1 cama queen-size + 1 sofá-cama",
    comodidades: [
      "Wi-Fi de alta velocidade",
      "Lareira ecológica",
      "Deck privativo",
      "Ar-condicionado",
      "Frigobar",
      "Cafeteira",
      "Smart TV 50\"",
    ],
    fotos: [
      unsplash("1571896349842-33c89424de2d"),
      unsplash("1631049307264-da0ec9d70304"),
      unsplash("1445019980597-93fa8acb246c"),
      unsplash("1414235077428-338989a2e8c0"),
    ],
    totalQuartos: 10,
    politicaCancelamento:
      "Cancelamento gratuito até 5 dias antes do check-in. Após esse prazo, será cobrada a primeira diária.",
  },
  {
    id: "bangalo-piscina",
    slug: "bangalo-piscina",
    nome: "Bangalô Piscina Privativa",
    descricaoCurta: "Bangalô exclusivo com piscina privativa e jardim tropical.",
    descricao:
      "O Bangalô Piscina Privativa é nossa acomodação mais exclusiva: um refúgio independente cercado por jardim tropical, com piscina privativa de borda infinita, sala de estar integrada e serviço de mordomo sob consulta.",
    capacidade: 4,
    precoDiaria: 3290,
    metragem: 68,
    vista: "jardim",
    camas: "1 cama king-size + 2 camas de solteiro",
    comodidades: [
      "Piscina privativa",
      "Jardim exclusivo",
      "Wi-Fi de alta velocidade",
      "Ar-condicionado",
      "Sala de estar integrada",
      "Adega climatizada",
      "Smart TV 65\"",
      "Serviço de mordomo (sob consulta)",
    ],
    fotos: [
      unsplash("1512917774080-9991f1c4c750"),
      unsplash("1611892440504-42a792e24d32"),
      unsplash("1520250497591-112f2f40a3f4"),
      unsplash("1592229505726-ca121723b8ef"),
    ],
    totalQuartos: 6,
    politicaCancelamento:
      "Cancelamento gratuito até 10 dias antes do check-in. Após esse prazo, será cobrado o valor integral da estadia.",
  },
  {
    id: "quarto-standard",
    slug: "quarto-standard",
    nome: "Quarto Standard Jardim",
    descricaoCurta: "Conforto essencial com vista para os jardins do resort.",
    descricao:
      "O Quarto Standard Jardim oferece todo o conforto essencial de um resort de padrão internacional, com vista para os jardins paisagísticos. Ótima opção para famílias e viajantes que buscam praticidade sem abrir mão do conforto.",
    capacidade: 2,
    precoDiaria: 990,
    metragem: 28,
    vista: "jardim",
    camas: "2 camas de solteiro ou 1 queen-size",
    comodidades: [
      "Wi-Fi de alta velocidade",
      "Ar-condicionado",
      "Frigobar",
      "Smart TV 42\"",
      "Cofre digital",
    ],
    fotos: [
      unsplash("1595576508898-0ad5c879a061"),
      unsplash("1571896349842-33c89424de2d"),
      unsplash("1521783593447-5702b9bfd267"),
      unsplash("1591088398332-8a7791972843"),
    ],
    totalQuartos: 20,
    politicaCancelamento:
      "Cancelamento gratuito até 3 dias antes do check-in. Após esse prazo, será cobrada a primeira diária.",
  },
]

export const AMENITIES: Amenity[] = [
  {
    id: "piscina",
    nome: "Piscina Infinita",
    descricao:
      "Piscina de borda infinita com vista para o mar, bar molhado e espreguiçadeiras premium.",
    icone: "Waves",
    imagem: unsplash("1611892440504-42a792e24d32"),
  },
  {
    id: "spa",
    nome: "Spa Ipê Dourado",
    descricao:
      "Circuito de bem-estar completo com massagens, hidroterapia e terapias inspiradas na Mata Atlântica.",
    icone: "Sparkles",
    imagem: unsplash("1584132967334-10e028bd69f7"),
  },
  {
    id: "restaurante",
    nome: "Restaurante Raiz",
    descricao:
      "Culinária contemporânea com ingredientes locais, assinada por chef premiado, e carta de vinhos selecionada.",
    icone: "UtensilsCrossed",
    imagem: unsplash("1517248135467-4c7edcad34c4"),
  },
  {
    id: "academia",
    nome: "Academia 24h",
    descricao:
      "Espaço fitness completo com equipamentos de última geração e aulas funcionais ao ar livre.",
    icone: "Dumbbell",
    imagem: unsplash("1544148103-0773bf10d330"),
  },
  {
    id: "praia",
    nome: "Acesso à Praia Privativa",
    descricao:
      "Trecho exclusivo de praia com serviço de praia completo, esportes aquáticos e pôr do sol inesquecível.",
    icone: "Umbrella",
    imagem: unsplash("1499793983690-e29da59ef1c2"),
  },
  {
    id: "trilhas",
    nome: "Trilhas na Mata Atlântica",
    descricao:
      "Trilhas guiadas por guias credenciados, com cachoeiras, mirantes e observação de fauna nativa.",
    icone: "Mountain",
    imagem: unsplash("1445019980597-93fa8acb246c"),
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    nome: "Marina Costa",
    origem: "São Paulo, SP",
    texto:
      "Uma experiência sensacional. O bangalô com piscina privativa superou todas as expectativas — atendimento impecável do início ao fim.",
    avaliacao: 5,
    foto: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "t2",
    nome: "Rafael Andrade",
    origem: "Belo Horizonte, MG",
    texto:
      "O spa é sensacional e a vista da suíte vista mar é de tirar o fôlego. Já estamos planejando voltar no próximo ano.",
    avaliacao: 5,
    foto: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "t3",
    nome: "Juliana Prado",
    origem: "Rio de Janeiro, RJ",
    texto:
      "Combinação perfeita de serra e mar. As trilhas guiadas foram um dos pontos altos da viagem em família.",
    avaliacao: 4,
    foto: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "t4",
    nome: "Carlos Eduardo Lima",
    origem: "Curitiba, PR",
    texto:
      "Reservei pelo site e o processo foi rápido e intuitivo. O check-in expresso e o restaurante Raiz merecem destaque especial.",
    avaliacao: 5,
    foto: "https://i.pravatar.cc/150?img=68",
  },
]

export const TAXA_LIMPEZA = 180
export const TAXA_SERVICO_PERCENTUAL = 0.1
