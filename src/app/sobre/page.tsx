import type { Metadata } from "next"
import Image from "next/image"

import { unsplash } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"

export const metadata: Metadata = {
  title: "Sobre o hotel",
  description:
    "Conheça a história do Hotel Ipê Dourado, resort de padrão internacional entre a Mata Atlântica e o mar.",
}

const VALORES = [
  {
    titulo: "Hospitalidade genuína",
    texto: "Cada detalhe pensado para que você se sinta em casa, com o conforto de um resort de padrão internacional.",
  },
  {
    titulo: "Sustentabilidade",
    texto: "Práticas responsáveis de preservação da Mata Atlântica e do litoral que nos cercam.",
  },
  {
    titulo: "Excelência no serviço",
    texto: "Equipe treinada para antecipar suas necessidades do check-in ao check-out.",
  },
]

export default function SobrePage() {
  return (
    <div>
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src={unsplash("1540541338287-41700207dee6", 2000)}
          alt="Vista panorâmica do Hotel Ipê Dourado"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Sobre o Ipê Dourado
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <AnimatedSection>
          <p className="text-lg leading-relaxed text-foreground/90">
            Inaugurado com o propósito de unir o melhor da serra e do litoral fluminense, o Hotel
            Ipê Dourado nasceu do sonho de criar um refúgio de padrão internacional em meio à Mata
            Atlântica preservada. O nome é uma homenagem ao ipê-dourado, árvore símbolo da região
            que floresce em tons de ouro no fim do inverno.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/90">
            Hoje, o resort reúne suítes e bangalôs desenhados para o conforto máximo, gastronomia
            autoral com ingredientes locais, um spa inspirado nas terapias da floresta e acesso
            privativo a uma das praias mais preservadas da costa. Tudo isso a poucos minutos do
            centro histórico de Paraty.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {VALORES.map((valor, i) => (
            <AnimatedSection key={valor.titulo} delay={i * 0.08} as="div">
              <h3 className="font-heading text-lg font-semibold">{valor.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{valor.texto}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
