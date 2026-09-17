"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { BookingSearchBar } from "@/components/home/booking-search-bar"

export function StickySearchBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 620)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="sticky top-16 z-40 border-b border-border bg-background/95 py-3 backdrop-blur-md"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <BookingSearchBar compact />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
