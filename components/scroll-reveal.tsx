"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface ScrollRevealProps {
children: React.ReactNode
className?: string
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
const ref = useRef<HTMLDivElement>(null)
const [isVisible, setIsVisible] = useState(false)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
  )

  if (ref.current) {
    observer.observe(ref.current)
  }

  return () => observer.disconnect()
}, [])

return (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 50 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
)
}
