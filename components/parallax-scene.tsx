"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"

interface ParallaxSceneProps {
  children: React.ReactNode
  className?: string
}

export default function ParallaxScene({ children, className }: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const mouseRafRef = useRef<number>()

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const root = ref.current
      if (!root) return

      const layers = root.querySelectorAll<HTMLElement>("[data-speed]")
      const scrollY = window.scrollY
      layers.forEach((el) => {
        const speed = Number(el.dataset.speed || "0")
        el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`
        el.style.willChange = "transform"
      })
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (mouseRafRef.current) {
      cancelAnimationFrame(mouseRafRef.current)
    }

    mouseRafRef.current = requestAnimationFrame(() => {
      const root = ref.current
      if (!root) return

      const rect = root.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      const tilts = root.querySelectorAll<HTMLElement>("[data-rotate]")
      tilts.forEach((el) => {
        const rotate = Number(el.dataset.rotate || "0")
        el.style.transform = `translate3d(0, ${window.scrollY * Number(el.dataset.speed || "0")}px, 0) rotateX(${dy * -rotate}deg) rotateY(${dx * rotate}deg)`
        el.style.willChange = "transform"
      })
    })
  }, [])

  useEffect(() => {
    const root = ref.current
    if (!root) return

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    root.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      root.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current)
    }
  }, [handleScroll, handleMouseMove])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
