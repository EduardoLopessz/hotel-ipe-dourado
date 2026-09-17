import { AMENITIES, ROOM_TYPES } from "@/lib/constants"
import { AnimatedSection } from "@/components/shared/animated-section"
import { HotelPhotoCarousel, type SlideData } from "@/components/ui/aceternity-carousel"

const slides: SlideData[] = [
  {
    title: ROOM_TYPES[0].nome,
    button: "Ver quarto",
    src: ROOM_TYPES[0].fotos[0],
  },
  {
    title: AMENITIES[0].nome,
    button: "Ver comodidades",
    src: AMENITIES[0].imagem,
  },
  {
    title: ROOM_TYPES[2].nome,
    button: "Ver quarto",
    src: ROOM_TYPES[2].fotos[0],
  },
  {
    title: AMENITIES[1].nome,
    button: "Ver comodidades",
    src: AMENITIES[1].imagem,
  },
  {
    title: ROOM_TYPES[1].nome,
    button: "Ver quarto",
    src: ROOM_TYPES[1].fotos[0],
  },
]

export function GallerySection() {
  return (
    <section className="overflow-hidden bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10 max-w-2xl text-center sm:mx-auto">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.25em] text-primary">
            Galeria
          </p>
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Um passeio visual pelo Ipê Dourado
          </h2>
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <HotelPhotoCarousel slides={slides} />
      </AnimatedSection>
    </section>
  )
}
