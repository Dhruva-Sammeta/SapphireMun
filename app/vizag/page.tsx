"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    TrendingUp,
    MapPin,
    Calendar,
    Sparkles,
    Lock,
    ChevronDown,
    Crosshair,
    Hand,
} from "lucide-react"
import VizagFooter from "@/components/vizag-footer"
import FloatingCard from "@/components/floating-card"
import FloatingNavbar from "@/components/floating-navbar"
import "../refined.css"
import "./vizag-theme.css"
import ChunkSection from "@/components/chunk-section"
import GlowCard from "@/components/glow-card"
import { HyperText } from "@/components/ui/hyper-text"
import PagePreloader from "@/components/page-preloader"

export default function VizagPage() {
    const heroRef = useRef<HTMLElement>(null)
    const [revealed, setRevealed] = React.useState(false)
    const router = useRouter()

    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return
        // Skip parallax on mobile — causes jank on slow devices
        const isMobile = window.innerWidth < 768 || "ontouchstart" in window
        if (isMobile) return
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

    const handleEditionSwitch = (href: string) => {
        router.push(href)
    }

    return (
        <div className="min-h-screen bg-app text-app overflow-x-hidden vizag-theme">
            <PagePreloader
                onComplete={() => setRevealed(true)}
                images={[
                    "/images/sapphire-mun-hero-logo.png",
                    "/images/design-mode/download.png",
                ]}
            />
            <div className={`transition-opacity duration-1000 ${revealed ? "opacity-100" : "opacity-0"}`}>
                <FloatingNavbar
                    items={[
                        { href: "/", label: "Home" },
                        { href: "#committees", label: "Committees" },
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
                                <img
                                    src="/images/sapphire-mun-hero-logo.png"
                                    alt="Sapphire Model United Nations emblem"
                                    className="w-64 h-64 md:w-80 md:h-80 mx-auto object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-700 fade-in-up"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 animate-pulse">
                                    First Edition • Coming May 2026
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight reflect-ribbon">
                                    Sapphire <span className="font-semibold metallic-text">MUN Vizag</span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted font-light max-w-2xl mx-auto leading-relaxed">
                                    The next chapter begins in Visakhapatnam. Experience the evolution of India's first Experience-targeted Model UN.
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

                                <Button
                                    onClick={() => handleEditionSwitch("/hyderabad")}
                                    size="lg"
                                    className="btn-glass w-full sm:w-auto opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    <Sparkles className="mr-2 h-4 w-4 text-blue-300" />
                                    Hyderabad Edition
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto text-fg">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold flex items-center justify-center gap-2">
                                        <MapPin className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="text-sm text-muted">Visakhapatnam</div>
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
                                    <div className="text-sm text-muted">1st Edition</div>
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

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
                    </div>
                </section>

                {/* Committees Placeholder */}
                <ChunkSection id="committees" className="py-12 md:py-24 relative">
                    <div className="container px-4">
                        <div className="text-center space-y-4 mb-8 md:mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                                Committees <span className="font-semibold metallic-text">&amp; Agenda</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
                                Stay tuned for the reveal of our committees and agendas for the Visakhapatnam edition.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
                            {[
                                {
                                    id: 1,
                                    status: "revealed",
                                    title: "DISEC",
                                    icon: Crosshair,
                                    type_level: "Security Council — Intermediate",
                                    desc: "Deliberation on the proliferation of autonomous weapons systems (Lethal AI) and the emerging threat of algorithmic warfare to global security.",
                                },
                                {
                                    id: 2,
                                    status: "revealed",
                                    title: "UNHRC",
                                    icon: Hand,
                                    type_level: "Human Rights — Intermediate",
                                    desc: "Addressing the weaponisation of surveillance technologies and digital authoritarianism as violations of fundamental human rights.",
                                },
                                { id: 3, status: "classified", cipher: "REDACTED" },
                                { id: 4, status: "classified", cipher: "INCOMING" },
                                { id: 5, status: "classified", cipher: "SECURED" },
                                { id: 6, status: "classified", cipher: "DECODING" },
                            ].map((item: any) => (
                                <GlowCard
                                    key={item.id}
                                    className={`group p-4 md:p-6 flex flex-col justify-between min-h-[180px] md:min-h-[220px] transition-all duration-500 cursor-pointer relative overflow-hidden ${item.status === 'revealed'
                                        ? "bg-red-950/20 border-red-500/20 hover:border-red-500/50 hover:bg-red-900/10"
                                        : "bg-red-950/10 border-red-500/10 hover:border-red-500/30"
                                        }`}
                                >
                                    <div className="space-y-4 z-10 relative">
                                        {/* Header: Icon + Title */}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${item.status === 'revealed'
                                                ? "bg-red-500/20 text-red-400 group-hover:scale-110 group-hover:bg-red-500/30"
                                                : "bg-red-900/10 text-red-500/40 group-hover:scale-110"
                                                }`}>
                                                {item.status === 'revealed' ? (
                                                    <item.icon className="h-5 w-5" />
                                                ) : (
                                                    <Lock className="h-5 w-5" />
                                                )}
                                            </div>
                                            {item.status === 'revealed' ? (
                                                <h3 className="text-lg md:text-xl font-semibold text-slate-100 group-hover:text-red-300 transition-colors">
                                                    {item.title}
                                                </h3>
                                            ) : (
                                                <HyperText
                                                    text={item.cipher}
                                                    className="text-lg font-bold text-red-500/50 group-hover:text-red-400 tracking-widest"
                                                    duration={800}
                                                    animateOnLoad={false}
                                                />
                                            )}
                                        </div>

                                        {/* Subtitle & Body */}
                                        {item.status === 'revealed' ? (
                                            <div className="flex flex-col h-full">
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent my-4 opacity-50" />
                                                <p className="text-red-200/80 text-sm font-medium mb-2">
                                                    {item.type_level}
                                                </p>
                                                <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4">
                                                    {item.desc}
                                                </p>
                                                <div className="mt-auto pt-2 border-t border-red-500/10">
                                                    <p className="text-xs text-red-400/80 flex items-center gap-2 mt-3 font-medium tracking-wide">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </span>
                                                        Agenda Revealed
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent my-4 opacity-30" />
                                                <p className="text-red-500/30 text-xs uppercase tracking-wider font-medium">
                                                    Classified • Level {item.id}
                                                </p>
                                                <div className="space-y-2 opacity-30 mt-2">
                                                    <div className="h-2 bg-red-500/20 rounded w-3/4 animate-pulse" />
                                                    <div className="h-2 bg-red-500/20 rounded w-1/2 animate-pulse delay-75" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </GlowCard>
                            ))}
                        </div>
                    </div>
                </ChunkSection >

                {/* Updates Section */}
                <ChunkSection id="updates" className="py-12 md:py-24 relative" >
                    <div className="container">
                        <FloatingCard className="p-6 md:p-12 metallic-card reflective-hover text-center border-red-500/20">
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
                </ChunkSection >

                <VizagFooter />
            </div>
        </div >
    )
}
