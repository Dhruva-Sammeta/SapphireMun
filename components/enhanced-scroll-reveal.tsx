"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface EnhancedScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "left" | "right" | "fade"
  delay?: number
  duration?: number
}

export default function EnhancedScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.9,
}: EnhancedScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) controls.start("visible")
  }, [isVisible, controls])

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 36 : 0,
      x: direction === "left" ? -36 : direction === "right" ? 36 : 0,
      scale: 0.985,
      filter: "brightness(0.95) saturate(0.95)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "brightness(1) saturate(1)",
      transition: {
        duration,
        delay,
        // fast start, slow finish
        ease: [0.05, 0.9, 0.2, 1],
      },
    },
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
