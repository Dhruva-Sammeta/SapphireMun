"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

type ChunkSectionProps = {
  id?: string
  className?: string
  children: React.ReactNode
  threshold?: number
}

/**
 * ChunkSection: Animates in when the section is the current chunk in view.
 * It uses an IntersectionObserver to toggle an "active" state and drives
 * a fast-start -> slow-finish animation to feel reflective and premium.
 * Optimized for mobile performance with reduced animation complexity.
 */
export default function ChunkSection({ id, className, children, threshold = 0.45 }: ChunkSectionProps) {
  const ref = useRef<HTMLElement | null>(null)
  const controls = useAnimation()
  const [active, setActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            setActive(true)
          } else if (entry.intersectionRatio < 0.1) {
            setActive(false)
          }
        })
      },
      {
        threshold: isMobile ? [0, threshold] : Array.from({ length: 10 }, (_, i) => i / 10),
        rootMargin: isMobile ? "0px 0px -5% 0px" : "0px 0px -10% 0px",
      },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, isMobile])

  useEffect(() => {
    if (active) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [active, controls])

  return (
    <motion.section
      id={id}
      ref={ref as any}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: isMobile ? 0.3 : 0.15,
          y: isMobile ? 15 : 28,
          scale: isMobile ? 0.98 : 0.985,
          filter: isMobile ? "blur(1px)" : "blur(2px) brightness(0.95) saturate(0.95)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px) brightness(1) saturate(1)",
          transition: {
            duration: isMobile ? 0.5 : 0.9,
            ease: isMobile ? [0.25, 0.46, 0.45, 0.94] : [0.05, 0.9, 0.2, 1],
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  )
}
