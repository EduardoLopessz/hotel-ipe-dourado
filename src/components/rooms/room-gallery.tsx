"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface RoomGalleryProps {
  fotos: string[]
  nome: string
}

export function RoomGallery({ fotos, nome }: RoomGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  function prev() {
    setIndex((i) => (i === 0 ? fotos.length - 1 : i - 1))
  }

  function next() {
    setIndex((i) => (i === fotos.length - 1 ? 0 : i + 1))
  }

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative col-span-2 row-span-2 aspect-square overflow-hidden sm:aspect-auto"
        >
          <Image
            src={fotos[0]}
            alt={`${nome} — foto 1`}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </button>
        {fotos.slice(1, 5).map((foto, i) => (
          <button
            key={foto}
            type="button"
            onClick={() => openAt(i + 1)}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={foto}
              alt={`${nome} — foto ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {i === 3 && fotos.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                +{fotos.length - 5} fotos
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openAt(0)}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
      >
        <Expand className="size-4" /> Ver todas as fotos
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl sm:max-w-4xl border-none bg-transparent p-0 shadow-none [&>button]:hidden"
        >
          <DialogTitle className="sr-only">{`Galeria de fotos — ${nome}`}</DialogTitle>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={fotos[index]}
                  alt={`${nome} — foto ${index + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Fechar galeria"
            >
              <X className="size-4" />
            </button>

            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Próxima foto"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {index + 1} / {fotos.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
