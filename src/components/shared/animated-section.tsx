"use client"

import { motion, type Variants } from "motion/react"

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "section" | "div"
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  as = "section",
}: AnimatedSectionProps) {
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </Component>
  )
}
