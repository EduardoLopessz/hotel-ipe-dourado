import { Hero } from "@/components/home/hero"
import { StickySearchBar } from "@/components/home/sticky-search-bar"
import { FeaturedRooms } from "@/components/home/featured-rooms"
import { AmenitiesSection } from "@/components/home/amenities-section"
import { GallerySection } from "@/components/home/gallery-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { LocationSection } from "@/components/home/location-section"

export default function Home() {
  return (
    <>
      <Hero />
      <StickySearchBar />
      <FeaturedRooms />
      <AmenitiesSection />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
    </>
  )
}
