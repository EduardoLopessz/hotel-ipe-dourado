"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { ChevronDown } from "lucide-react"

import { HERO_IMAGE, HOTEL_TAGLINE } from "@/lib/constants"
import { BookingSearchBar } from "@/components/home/booking-search-bar"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div ref={ref} className="relative flex h-[92vh] min-h-[640px] w-full items-end overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 scale-110">
        <Image
          src={HERO_IMAGE}
          alt="Vista aérea do resort Hotel Ipê Dourado entre a serra e o mar"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-3 font-heading text-sm uppercase tracking-[0.3em] text-primary"
        >
          {HOTEL_TAGLINE}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-2xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Hotel Ipê Dourado
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-4 max-w-lg text-base text-white/85 sm:text-lg"
        >
          Um resort de padrão internacional onde a Mata Atlântica encontra o oceano. Suítes vista
          mar, bangalôs privativos e uma experiência de hospitalidade inesquecível.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 max-w-3xl"
        >
          <BookingSearchBar />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/70 sm:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" />
        </motion.div>
      </motion.div>
    </div>
  )
}
