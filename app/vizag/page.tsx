"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    TrendingUp,
    MapPin,
    Calendar,
    Sparkles,
    Lock,
} from "lucide-react"
import VizagFooter from "@/components/vizag-footer"
import FloatingCard from "@/components/floating-card"
import FloatingNavbar from "@/components/floating-navbar"
import "../refined.css"
import "./vizag-theme.css"
import ChunkSection from "@/components/chunk-section"
import ParallaxScene from "@/components/parallax-scene"
import Section from "@/components/section"
import GlowCard from "@/components/glow-card"
import { HyperText } from "@/components/ui/hyper-text"

export default function VizagPage() {
    const heroRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return
        let ticking = false
        const updateParallax = () => {
            const scrolled = window.pageYOffset
            const rate = scrolled * -0.15
            hero.style.transform = `translate3d(0, ${rate}px, 0)`
            ticking = false
        }
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax)
                ticking = true
            }
        }
        window.addEventListener("scroll", requestTick, { passive: true })
        return () => window.removeEventListener("scroll", requestTick)
    }, [])

    return (
        <div className="min-h-screen bg-app text-app overflow-x-hidden vizag-theme animate-in fade-in duration-1000">
            <FloatingNavbar
                items={[
                    { href: "/", label: "Home" },
                    { href: "#updates", label: "Updates" },
                ]}
            />

            {/* Hero */}
            <section
                ref={heroRef}
                className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full"
            >
                <div className="absolute inset-0 -z-20 bg-hero" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-slate-900/20 to-red-800/15" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-12 animate-shimmer" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-200/5 to-transparent transform skew-x-12 animate-shimmer-reverse" />
                </div>

                <div className="container relative z-10">
                    <div className="mx-auto max-w-4xl text-center space-y-6 px-4">
                        <div className="inline-block relative px-0 my-2 py-20">
                            <div className="absolute inset-0 bg-gradient-radial from-red-500/15 to-transparent blur-xl" />
                            <img
                                src="/images/sapphire-mun-hero-logo.png"
                                alt="Sapphire Model United Nations emblem"
                                className="w-64 h-64 md:w-80 md:h-80 mx-auto object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 reflective-hover fade-in-up"
                            />
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-64 h-32 md:w-80 md:h-40 opacity-30 blur-sm">
                                <img
                                    src="/images/sapphire-mun-hero-logo.png"
                                    alt=""
                                    className="w-full h-full object-contain transform scale-y-[-1] mask-gradient-to-b animate-pulse"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 animate-pulse">
                                Second Edition • Coming May 2026
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight reflect-ribbon">
                                Sapphire <span className="font-semibold metallic-text">MUN</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted font-light max-w-2xl mx-auto leading-relaxed">
                                The next chapter begins in Vizag. Experience the evolution of India's first Experience-targeted Model UN.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 px-4">
                            <Button size="lg" className="btn-accent w-full sm:w-auto opacity-80 cursor-not-allowed bg-red-600/80">
                                Registrations Opening Soon
                            </Button>

                            <Button asChild size="lg" className="btn-glass w-full sm:w-auto">
                                <Link
                                    href="#updates"
                                    className="flex items-center justify-center"
                                >
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Get Updates
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto text-fg">
                            <div className="text-center">
                                <div className="text-2xl font-semibold flex items-center justify-center gap-2">
                                    <MapPin className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="text-sm text-muted">Vizag</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold flex items-center justify-center gap-2">
                                    <Calendar className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="text-sm text-muted">May 30-31</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold flex items-center justify-center gap-2">
                                    <Sparkles className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="text-sm text-muted">2nd Edition</div>
                            </div>
                            <div className="text-center col-span-3 my-0 pt-0">
                                <div className="text-sm text-muted flex items-center gap-2 py-7 justify-center text-left">
                                    <Calendar className="text-sm flex items-center gap-2 justify-center py-0" />
                                    May 30-31, 2026 • Visakhapatnam, India
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/25 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Committees Placeholder */}
            <ChunkSection className="py-24 relative">
                <div className="container">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                            Committees <span className="font-semibold metallic-text">&amp; Agenda</span>
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            Stay tuned for the reveal of our committees and agendas for the Vizag edition.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[
                            { id: 1, cipher: "CLASSIFIED" },
                            { id: 2, cipher: "ENCRYPTED" },
                            { id: 3, cipher: "REDACTED" },
                            { id: 4, cipher: "INCOMING" },
                            { id: 5, cipher: "SECURED" },
                            { id: 6, cipher: "DECODING" },
                        ].map((item) => (
                            <GlowCard
                                key={item.id}
                                className="group p-8 text-center flex flex-col items-center justify-center min-h-[220px] border border-red-500/20 bg-gradient-to-br from-red-950/20 to-slate-900/40 backdrop-blur-sm hover:border-red-500/40 transition-all duration-500 cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/30 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                                    <Lock className="h-6 w-6 text-red-400/60 group-hover:text-red-400 transition-colors" />
                                </div>
                                <HyperText
                                    text={item.cipher}
                                    className="text-lg font-bold text-red-300/70 group-hover:text-red-200 tracking-widest"
                                    duration={1000}
                                    animateOnLoad={false}
                                />
                                <div className="text-xs text-white/30 mt-3 uppercase tracking-wider">Committee {item.id}</div>
                                <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500/30 to-transparent group-hover:via-red-500/60 transition-all duration-300" />
                            </GlowCard>
                        ))}
                    </div>
                </div>
            </ChunkSection>

            {/* Updates Section */}
            <ChunkSection id="updates" className="py-24 relative">
                <div className="container">
                    <FloatingCard className="p-12 metallic-card reflective-hover text-center border-red-500/20">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-blue-500/20 text-red-300 text-sm font-semibold">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Stay in the Loop
                            </div>
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                Don't Miss the <span className="font-semibold metallic-text">Reveal</span>
                            </h2>
                            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
                                Follow us on Instagram for the latest updates on registrations, committee reveals, and more.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button asChild className="btn-glass bg-red-500/10 hover:bg-red-500/20 border-red-500/30">
                                    <Link
                                        href="https://www.instagram.com/sapphiremunvizag/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Follow @sapphiremunvizag
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </ChunkSection>

            <VizagFooter />
        </div>
    )
}
