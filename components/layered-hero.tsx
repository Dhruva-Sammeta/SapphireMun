"use client"

import { useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LayeredHero() {
  const ref = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number>()

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const h = rect.height || 1
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + h)))
      el.style.setProperty("--p", String(progress))

      const layers = el.querySelectorAll<HTMLElement>("[data-speed]")
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.speed || "0")
        const y = window.scrollY * speed
        layer.style.transform = `translate3d(0, ${y}px, 0)`
        layer.style.willChange = "transform"
      })
    })
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  return (
    <section ref={ref} className="snap-start relative min-h-[100svh] overflow-hidden flex items-center">
      {/* Background video layer */}
      <div className="absolute inset-0 -z-20 opacity-[0.35]">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artistic%20Parallax%20Slider%20for%20WordPress%20-%20Slider%20Revolution%20%28360p%2C%20h264%29-WYdiu0QySebH6HRB9A1Aa3TqHPffWo.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      </div>

      {/* Gradient/Glow layers */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-gradient" />
        <div className="accent-spot" data-speed="0.03" />
      </div>

      {/* Emblem — the only mark */}
      <div className="relative z-10 w-full">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <img
              src="/images/crest-1.png"
              alt="Sapphire Model United Nations emblem"
              className="mx-auto h-[160px] w-auto md:h-[200px] lg:h-[240px] select-none pointer-events-none"
              style={{
                filter: "drop-shadow(0 0 40px rgba(0,110,135,0.5))",
                transform: "translate3d(0, calc((var(--p,0) - 0.5) * -8px), 0) scale(calc(1 + var(--p,0) * 0.03))",
                transition: "transform 0.1s cubic-bezier(0.4, 0, 0.6, 1)",
                willChange: "transform",
              }}
            />
            <p className="mt-6 text-sapphire-muted">Strategize • Socialize • Succeed</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 glow-strong">
                <Link href="#tech">
                  Discover the Tech
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
                <Link href="#committees">Committees</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="scroll-cue">
          <span className="dot" />
        </div>
      </div>
    </section>
  )
}
