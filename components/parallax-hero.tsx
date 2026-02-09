"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number>()

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY)
    })
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  const calc = (speed: number) => `translate3d(0, ${scrollY * speed}px, 0)`

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      <div className="hero-bg pointer-events-none" aria-hidden="true" />
      {/* Background crest with deep glow */}
      <img
        src="/images/design-mode/6.png"
        alt=""
        className="pointer-events-none select-none absolute inset-0 m-auto opacity-20 blur-sm"
        style={{
          transform: calc(0.05),
          maxWidth: "900px",
          width: "80%",
          filter: "drop-shadow(0 0 40px rgba(0,110,135,0.6))",
          willChange: "transform",
        }}
      />
      {/* Floating gem */}
      <img
        src="/images/design-mode/8.png"
        alt="Sapphire glyph"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate3d(-50%, calc(-50% + ${scrollY * 0.08}px), 0)`,
          width: "140px",
          filter: "drop-shadow(0 0 30px rgba(255,255,255,0.35))",
          willChange: "transform",
        }}
      />
      {/* Title lockup */}
      <div className="relative container z-[1] py-28 md:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src="/images/design-mode/7.png"
            alt="SAPPHIRE '25 MUN — Strategize • Socialize • Succeed"
            className="mx-auto w-[720px] max-w-full"
            style={{
              transform: calc(0.02),
              filter: "drop-shadow(0 6px 32px rgba(255,255,255,0.25))",
              willChange: "transform",
            }}
          />
          <p className="mt-6 text-sapphire-muted md:text-lg">
            Sapphire Model United Nations. Technology-forward debate. Unmatched experience.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 glow-strong">
              <Link href="#committees">
                Explore Committees
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
              <Link href="#docs">Docs & Allocations</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Laurel mark at bottom */}
      <div className="relative z-[1] flex justify-center pb-10">
        <img
          src="/images/design-mode/1.png"
          alt="Sapphire MUN crest"
          className="h-16 opacity-70"
          style={{
            transform: calc(0.03),
            filter: "drop-shadow(0 0 22px rgba(0,110,135,0.5))",
            willChange: "transform",
          }}
        />
      </div>
    </section>
  )
}
