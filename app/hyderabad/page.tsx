"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    ChevronDown,
    Users,
    Calendar,
    MapPin,
    Sparkles,
    Gavel,
    Camera,
    Heart,
    Shield,
    Crosshair,
    Newspaper,
    Film,
    Lock,
    Instagram,
    TrendingUp,
    Play,
    ImageIcon,
    Mail,
    Sword,
} from "lucide-react"

import FloatingCard from "@/components/floating-card"
import FloatingNavbar from "@/components/floating-navbar"
import "../refined.css"
import "./hyderabad-theme.css"
import ChunkSection from "@/components/chunk-section"
import Section from "@/components/section"
import { HyperText } from "@/components/ui/hyper-text"
import PagePreloader from "@/components/page-preloader"

/* ─── committee data ─── */
const committees = [
    {
        id: 1,
        status: "revealed" as const,
        title: "DISEC",
        fullName: "Disarmament and International Security Committee",
        icon: Crosshair,
        type_level: "Security Council · Intermediate",
        desc: "Deliberation on global disarmament challenges and international security paradigms in an evolving geopolitical landscape.",
    },
    {
        id: 2,
        status: "revealed" as const,
        title: "UNHRC",
        fullName: "United Nations Human Rights Council",
        icon: Heart,
        type_level: "Human Rights · Intermediate",
        desc: "Addressing systemic human rights violations and the intersection of digital sovereignty with fundamental freedoms.",
    },
    {
        id: 3,
        status: "revealed" as const,
        title: "LOK SABHA",
        fullName: "The House of the People",
        icon: Gavel,
        type_level: "Parliamentary · Advanced",
        desc: "India's lower house of Parliament. Engage in fierce parliamentary debate on policies shaping the nation's future.",
    },
    {
        id: 4,
        status: "revealed" as const,
        title: "IFI",
        fullName: "Indian Film Industry",
        icon: Film,
        type_level: "Creative · Fun",
        desc: "A crisis simulation set in the world of Indian cinema. Navigate industry politics, creative disputes, and cultural influence.",
    },
    {
        id: 5,
        status: "revealed" as const,
        title: "IP",
        fullName: "International Press",
        icon: Newspaper,
        type_level: "Press Corps · All Levels",
        desc: "Report, fact-check, and shape the narrative. The IP corps covers all committees with journalistic integrity and flair.",
    },
]

/* ─── DhurandharCard — special committee, cinematic red/amber glow ─── */
function DhurandharCard() {
    const cardRef = useRef<HTMLDivElement>(null)
    const [hyperKey, setHyperKey] = useState(0)
    const [bodyVisible, setBodyVisible] = useState(false)
    const hasAutoPlayed = useRef(false)
    const isMobileRef = useRef(false)

    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        isMobileRef.current = window.innerWidth < 768 || "ontouchstart" in window
        const threshold = isMobileRef.current ? 0.5 : 0.15
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAutoPlayed.current) {
                    hasAutoPlayed.current = true
                    setHyperKey(k => k + 1)
                    const t = setTimeout(() => setBodyVisible(true), 200)
                    observer.disconnect()
                    return () => clearTimeout(t)
                }
            },
            { threshold, rootMargin: isMobileRef.current ? "-15% 0px -15% 0px" : "-60px" }
        )
        observer.observe(card)
        return () => observer.disconnect()
    }, [])

    const handleCardHover = useCallback(() => {
        if (hasAutoPlayed.current && !isMobileRef.current) setHyperKey(k => k + 1)
    }, [])

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleCardHover}
            className="group relative rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer overflow-hidden transition-all duration-700 sm:col-span-2 lg:col-span-3"
            style={{
                background: "linear-gradient(135deg, #0d0608 0%, #1a0308 40%, #0d060a 100%)",
                border: "1px solid transparent",
                backgroundClip: "padding-box",
                boxShadow: "0 0 60px 0 rgba(180,30,30,0.2), 0 0 0 1px rgba(200,60,30,0.25), inset 0 1px 0 rgba(255,140,60,0.08)",
            }}
        >
            {/* Horizontal scan-line sweep */}
            <div
                className="pointer-events-none absolute inset-x-0 h-px opacity-0 group-hover:opacity-100"
                style={{
                    background: "linear-gradient(to right, transparent 0%, rgba(255,100,40,0.6) 50%, transparent 100%)",
                    animation: "dhurandhar-scan 2.5s linear infinite",
                    top: "0",
                }}
            />
            {/* ── Full-width flame wall at bottom of card ── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden"
                style={{ height: "52px", maskImage: "linear-gradient(to top, black 40%, transparent 100%)" }}
            >
                <div className="flex items-end justify-around w-full h-full px-1">
                    {Array.from({ length: 28 }, (_, i) => {
                        const heights = [18, 26, 22, 30, 20, 28, 16, 24, 32, 18, 26, 22, 28, 20, 30, 24, 18, 26, 20, 28, 22, 16, 30, 24, 20, 28, 22, 18]
                        const speeds = [1.0, 0.8, 1.2, 0.9, 1.3, 0.7, 1.1, 0.95, 1.15, 0.85, 1.05, 0.9, 1.2, 1.0, 0.8, 1.15, 0.95, 1.3, 0.85, 1.05, 0.9, 1.2, 0.75, 1.1, 0.95, 0.8, 1.25, 1.0]
                        const delays = [0, 0.1, 0.05, 0.2, 0.15, 0.08, 0.18, 0.03, 0.12, 0.22, 0.07, 0.17, 0.02, 0.14, 0.09, 0.19, 0.04, 0.11, 0.16, 0.06, 0.21, 0.13, 0.08, 0.18, 0.03, 0.15, 0.1, 0.22]
                        const greens = [80, 50, 65, 40, 70, 55, 45, 60, 35, 75, 50, 65, 42, 58, 48, 70, 55, 38, 62, 48, 66, 44, 72, 52, 60, 42, 68, 56]
                        return (
                            <div
                                key={i}
                                style={{
                                    width: "3px",
                                    height: `${heights[i % heights.length]}px`,
                                    borderRadius: "50% 50% 25% 25% / 55% 55% 45% 45%",
                                    background: `radial-gradient(ellipse at 50% 85%, rgba(255,${greens[i % greens.length]},20,1) 0%, rgba(220,55,15,0.8) 45%, transparent 100%)`,
                                    filter: "blur(0.8px)",
                                    animation: `dhurandhar-flame ${speeds[i % speeds.length]}s ease-in-out ${delays[i % delays.length]}s infinite alternate`,
                                    transformOrigin: "bottom center",
                                    flexShrink: 0,
                                }}
                            />
                        )
                    })}
                </div>
            </div>
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    background: "linear-gradient(135deg, transparent 0%, rgba(180,30,30,0.07) 50%, transparent 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(200,80,40,0.3)",
                }}
            />

            {/* Ember glow orbs */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, rgba(220,60,30,0.8) 0%, rgba(180,30,10,0.4) 50%, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[70px] opacity-25 group-hover:opacity-50 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, rgba(255,120,30,0.6) 0%, rgba(200,60,20,0.3) 50%, transparent 70%)" }} />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
                style={{ background: "radial-gradient(ellipse, rgba(255,80,30,0.5) 0%, transparent 70%)" }} />

            {/* Film grain texture overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: "128px 128px",
                }}
            />

            <div className="space-y-3 z-10 relative">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Crown icon */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                            style={{
                                background: "radial-gradient(circle, rgba(220,60,30,0.3) 0%, rgba(180,30,10,0.15) 100%)",
                                boxShadow: "0 0 20px rgba(220,60,30,0.4), 0 0 0 1px rgba(200,80,40,0.4), inset 0 0 10px rgba(255,100,40,0.1)",
                                animation: "dhurandhar-ring-pulse 3s ease-in-out infinite",
                            }}
                        >
                            <Sword className="h-5 w-5" style={{ color: "rgba(255,140,80,1)", filter: "drop-shadow(0 0 6px rgba(220,80,30,0.9))" }} />
                        </div>
                        <div>
                            <div style={{ color: "rgba(255,140,80,1)", textShadow: "0 0 20px rgba(220,80,30,0.8), 0 0 40px rgba(180,40,20,0.4)" }}>
                                <HyperText
                                    key={hyperKey}
                                    text="DHURANDHAR"
                                    className="text-lg md:text-xl font-bold tracking-wider"
                                    duration={700}
                                    animateOnLoad={true}
                                />
                            </div>

                        </div>
                    </div>
                    {/* Special committee badge */}
                    <div
                        className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse"
                        style={{
                            background: "linear-gradient(135deg, rgba(220,60,30,0.2), rgba(180,30,10,0.1))",
                            border: "1px solid rgba(200,80,40,0.4)",
                            color: "rgba(255,140,80,0.9)",
                            boxShadow: "0 0 10px rgba(220,60,30,0.2)",
                        }}
                    >
                        Special Committee
                    </div>
                </div>

                {/* Divider — red glow */}
                <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(200,60,30,0.5), rgba(255,120,50,0.7), rgba(200,60,30,0.5), transparent)" }} />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={bodyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="space-y-2"
                >
                    <p className="text-xs font-medium italic" style={{ color: "rgba(255,140,80,0.5)" }}>The Sapphire Special Committee</p>
                    <p className="text-sm font-medium" style={{ color: "rgba(255,140,80,0.8)" }}>Crisis Committee · Criminally Advanced</p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(200,150,140,0.75)" }}>
                        Dhurandhar — the war strategist. A closed, crisis committee where the most elite delegates navigate an unscripted geopolitical collapse in real time. Power shifts. Alliances fall. Only the sharpest survive.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={bodyVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-auto pt-2"
                    style={{ borderTop: "1px solid rgba(200,60,30,0.15)" }}
                >
                    <p className="text-xs flex items-center gap-2 mt-2 font-medium tracking-wide" style={{ color: "rgba(255,140,80,0.9)" }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "rgba(220,60,30,0.9)" }} />
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "rgba(220,60,30,1)" }} />
                        </span>
                        Invites in Progress
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

/* ─── CommitteeCard ─── */
type CommitteeItem = (typeof committees)[number]

function CommitteeCard({ c }: { c: CommitteeItem }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [hyperKey, setHyperKey] = useState(0)
    const [bodyVisible, setBodyVisible] = useState(false)
    const hasAutoPlayed = useRef(false)
    const isMobileRef = useRef(false)

    // Native IntersectionObserver — works for both desktop (15% threshold) and
    // mobile (50% threshold so it fires when card is center-focused while scrolling)
    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        isMobileRef.current = window.innerWidth < 768 || "ontouchstart" in window
        const threshold = isMobileRef.current ? 0.5 : 0.15

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAutoPlayed.current) {
                    hasAutoPlayed.current = true
                    setHyperKey(k => k + 1)
                    const t = setTimeout(() => setBodyVisible(true), 200)
                    // cleanup handled by closure — observer disconnects after first fire
                    observer.disconnect()
                    return () => clearTimeout(t)
                }
            },
            { threshold, rootMargin: isMobileRef.current ? "-15% 0px -15% 0px" : "-60px" }
        )
        observer.observe(card)
        return () => observer.disconnect()
    }, [])

    // Desktop: re-scramble on hover. Mobile: no hover events needed.
    const handleCardHover = useCallback(() => {
        if (hasAutoPlayed.current && !isMobileRef.current) setHyperKey(k => k + 1)
    }, [])

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleCardHover}
            className="group relative rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer overflow-hidden transition-all duration-500 metallic-card border border-cyan-500/15 hover:border-cyan-400/40"
        >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-400/5 blur-2xl group-hover:bg-cyan-400/15 transition-colors duration-700 pointer-events-none" />

            <div className="space-y-3 z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-500/15 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/25 transition-all duration-300">
                        <c.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <HyperText
                            key={hyperKey}
                            text={c.title}
                            className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider"
                            duration={600}
                            animateOnLoad={true}
                        />
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-50" />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={bodyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="space-y-2"
                >
                    <p className="text-cyan-200/60 text-xs font-medium italic">{c.fullName}</p>
                    <p className="text-cyan-200/80 text-sm font-medium">{c.type_level}</p>
                    <p className="text-muted text-sm leading-relaxed line-clamp-3">{c.desc}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={bodyVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-auto pt-2 border-t border-cyan-500/10"
                >
                    <p className="text-xs text-cyan-400/80 flex items-center gap-2 mt-2 font-medium tracking-wide">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                        </span>
                        Agenda Announced
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

/* ─── page ─── */
export default function HyderabadPage() {
    const heroRef = useRef<HTMLElement>(null)
    const [revealed, setRevealed] = React.useState(false)
    const router = useRouter()
    // Mouse glow state (hero only, desktop)
    const glowRef = useRef<HTMLDivElement>(null)
    const gridGlowRef = useRef<HTMLDivElement>(null)

    // Parallax on hero
    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return
        const isMobile = window.innerWidth < 768 || "ontouchstart" in window
        if (isMobile) return
        let ticking = false
        const updateParallax = () => {
            const scrolled = window.pageYOffset
            hero.style.transform = `translate3d(0, ${scrolled * -0.15}px, 0)`
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

    // Mouse glow on hero (desktop only)
    useEffect(() => {
        const hero = heroRef.current
        const glow = glowRef.current
        const gridGlow = gridGlowRef.current
        if (!hero || !glow || !gridGlow) return
        if (window.innerWidth < 768 || "ontouchstart" in window) return
        const handleMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            // Move orb glow
            glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
            glow.style.opacity = "1"
            // Light up grid near cursor
            gridGlow.style.maskImage = `radial-gradient(500px circle at ${x}px ${y}px, black 0%, transparent 70%)`
                ; (gridGlow.style as unknown as Record<string, string>).webkitMaskImage = `radial-gradient(500px circle at ${x}px ${y}px, black 0%, transparent 70%)`
            gridGlow.style.opacity = "1"
        }
        const handleLeave = () => {
            glow.style.opacity = "0"
            gridGlow.style.opacity = "0"
        }
        hero.addEventListener("mousemove", handleMove)
        hero.addEventListener("mouseleave", handleLeave)
        return () => {
            hero.removeEventListener("mousemove", handleMove)
            hero.removeEventListener("mouseleave", handleLeave)
        }
    }, [])

    return (
        <div className="min-h-screen bg-app text-app overflow-x-hidden hyd-theme">
            <PagePreloader
                onComplete={() => setRevealed(true)}
                images={[
                    "/images/sapphire-mun-hero-logo.png",
                    "/images/design-mode/download.png",
                ]}
            />
            {/* Content opacity controlled here — always rendered so hero is in DOM before preloader exits */}
            <div
                className="transition-opacity duration-700"
                style={{ opacity: revealed ? 1 : 0, pointerEvents: revealed ? "auto" : "none" }}
            >
                <FloatingNavbar
                    items={[
                        { href: "/", label: "Home" },
                        { href: "/registrations", label: "Registrations" },
                        { href: "#committees", label: "Committees" },
                        { href: "#archive", label: "Archive" },
                        { href: "#contact", label: "Contact" },
                    ]}
                />

                {/* ════════════════ HERO ════════════════ */}
                <section
                    ref={heroRef}
                    className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full"
                >
                    {/* Background layers */}
                    <div className="absolute inset-0 -z-20" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050a1e] via-[#070e2c] to-[#040818]" />
                        <div className="absolute inset-0" style={{
                            background: "radial-gradient(900px 500px at 50% 20%, rgba(15,224,255,0.08), transparent 60%)",
                        }} />
                        {/* Base subtle grid */}
                        <div className="absolute inset-0" style={{
                            backgroundImage: "linear-gradient(rgba(15,224,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,224,255,0.03) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
                        }} />
                    </div>

                    {/* Grid glow layer — brighter grid that lights up near cursor */}
                    <div
                        ref={gridGlowRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
                        style={{
                            backgroundImage: "linear-gradient(rgba(15,224,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(15,224,255,0.15) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                            opacity: 0,
                            transition: "opacity 0.4s ease",
                        }}
                    />

                    {/* Mouse orb glow — follows cursor, desktop only */}
                    <div
                        ref={glowRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-0 left-0 z-[2] hidden md:block"
                        style={{
                            width: 480,
                            height: 480,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(15,224,255,0.12) 0%, rgba(15,224,255,0.04) 40%, transparent 70%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            willChange: "transform",
                        }}
                    />

                    <div className="container relative z-10">
                        {
                            <motion.div
                                initial="hidden"
                                animate={revealed ? "visible" : "hidden"}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                                    },
                                }}
                                className="mx-auto max-w-4xl text-center space-y-6 px-4"
                            >
                                {/* Logo */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                                    }}
                                    className="inline-block relative px-0 my-2 py-16"
                                >
                                    <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent blur-2xl" />
                                    <img
                                        src="/images/sapphire-mun-hero-logo.png"
                                        alt="Sapphire Model United Nations emblem"
                                        className="w-56 h-56 md:w-72 md:h-72 mx-auto object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                    />
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="inline-flex items-center px-4 py-2 rounded-full text-[var(--ocean-1000)] text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Edition 2 • Hyderabad
                                    </div>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
                                        Sapphire <span className="font-semibold metallic-text">MUN</span>
                                    </h1>
                                    <p className="text-base md:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
                                        Strategize. Socialize. Scrutinize.<br className="hidden sm:block" />
                                        India&apos;s first Experience-targeted Model United Nations returns to Hyderabad.
                                    </p>
                                </motion.div>

                                {/* CTA Buttons */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                                    }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4"
                                >
                                    <Button asChild size="lg" className="btn-accent w-full sm:w-auto">
                                        <Link href="/registrations" className="flex items-center justify-center">
                                            Register Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/vizag")}
                                        size="lg"
                                        className="btn-glass w-full sm:w-auto opacity-70 hover:opacity-100 bg-red-500/5 hover:bg-red-500/10 border-red-500/20"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4 text-red-400" />
                                        Vizag Edition
                                    </Button>
                                </motion.div>

                                {/* Date banner */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                                    }}
                                    className="pt-6"
                                >
                                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl sm:rounded-full border border-cyan-400/30 bg-cyan-500/5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-accent" />
                                            <span className="text-lg md:text-xl font-semibold text-fg">MAY 1 · 2 · 3</span>
                                        </div>
                                        <div className="hidden sm:block w-px h-6 bg-cyan-400/30" />
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-accent" />
                                            <span className="text-lg md:text-xl font-semibold text-fg">Hyderabad</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Quick stats */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
                                    }}
                                    className="grid grid-cols-3 gap-6 pt-2 max-w-sm mx-auto text-fg"
                                >
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold">5</div>
                                        <div className="text-xs text-muted">Committees</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold">3</div>
                                        <div className="text-xs text-muted">Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold">200+</div>
                                        <div className="text-xs text-muted">Delegates</div>
                                    </div>
                                </motion.div>

                                {/* Chevron */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
                                    }}
                                    className="pt-8"
                                >
                                    <ChevronDown className="w-8 h-8 text-white/25 animate-bounce mx-auto" />
                                </motion.div>
                            </motion.div>
                        }
                    </div>
                </section>

                {/* ════════════════ COMMITTEES ════════════════ */}
                <ChunkSection id="committees" className="py-12 md:py-24 relative">
                    <div className="container px-4">
                        <div className="text-center space-y-4 mb-8 md:mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-light text-fg">
                                Our <span className="font-semibold metallic-text">Committees</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
                                Six committees. One special. Unlimited possibility.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Dhurandhar — the special committee, always first */}
                            <DhurandharCard />

                            {committees.map((c) => (
                                <CommitteeCard key={c.id} c={c} />
                            ))}

                            {/* Classified incoming slot — sits in the regular grid */}
                            <div className="group relative rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer overflow-hidden transition-all duration-500 metallic-card border border-cyan-500/8 hover:border-cyan-500/25 opacity-70">
                                <div className="space-y-4 z-10 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-900/15 text-cyan-500/40 group-hover:scale-110 transition-all duration-300">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <HyperText
                                            text="INCOMING"
                                            className="text-lg font-bold text-cyan-500/40 group-hover:text-cyan-400 tracking-widest"
                                            duration={800}
                                            animateOnLoad={true}
                                        />
                                    </div>
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent opacity-30" />
                                    <p className="text-cyan-500/25 text-xs uppercase tracking-wider font-medium">
                                        Classified • Level 6
                                    </p>
                                    <div className="space-y-2 opacity-25 mt-2">
                                        <div className="h-2 bg-cyan-500/20 rounded w-3/4 animate-pulse" />
                                        <div className="h-2 bg-cyan-500/20 rounded w-1/2 animate-pulse delay-75" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ChunkSection>



                {/* ════════════════ PRIZES & OPPORTUNITIES ════════════════ */}
                <ChunkSection className="py-24">
                    <div className="container">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                Prizes & <span className="font-semibold metallic-text">Opportunities</span>
                            </h2>
                            <p className="text-lg text-muted max-w-2xl mx-auto">
                                Excel at Sapphire MUN and unlock a world of rewards.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            <FloatingCard className="p-6 metallic-card text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/15 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold text-fg mb-2">Certified Prizes</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Compete for significant certificates, recommendations, and recognition along with the standard awards.
                                </p>
                            </FloatingCard>
                            <FloatingCard className="p-6 metallic-card text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/15 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold text-fg mb-2">Internships & Opportunities</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Gain access to internships at leading companies and opportunities for personal and professional growth.
                                </p>
                            </FloatingCard>
                        </div>
                    </div>
                </ChunkSection>

                {/* ════════════════ DELEGATE JOURNEY ════════════════ */}
                <ChunkSection className="py-24">
                    <div className="container">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                Your <span className="font-semibold metallic-text">Journey</span>
                            </h2>
                            <p className="text-lg text-muted max-w-2xl mx-auto">
                                From registration to recognition, every step is designed for your success.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { step: "01", title: "Register", description: "Transparent process and quick onboarding", icon: Users },
                                { step: "02", title: "Prepare", description: "Background guides, training modules, chair support", icon: Calendar },
                                { step: "03", title: "Debate", description: "Structured sessions with live tech integration", icon: MapPin },
                                { step: "04", title: "Celebrate", description: "Awards, socials, and memories to last a lifetime", icon: Sparkles },
                            ].map((item, i) => (
                                <FloatingCard key={i} className="p-6 metallic-card text-center group">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {React.createElement(item.icon, { className: "h-6 w-6 text-accent" })}
                                    </div>
                                    <div className="text-sm font-semibold text-accent mb-2">{item.step}</div>
                                    <h3 className="text-xl font-semibold text-fg mb-2">{item.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                                </FloatingCard>
                            ))}
                        </div>
                    </div>
                </ChunkSection>

                {/* ════════════════ EDITION 1 ARCHIVE ════════════════ */}
                <ChunkSection id="archive" className="py-24">
                    <div className="container">
                        <FloatingCard className="p-6 md:p-8 metallic-card">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Left: Text */}
                                <div className="space-y-4">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
                                        First Edition Archive
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-light text-fg">
                                        Edition <span className="font-semibold metallic-text">One</span>
                                    </h2>
                                    <p className="text-muted text-sm leading-relaxed">
                                        Relive the highlights from our successful inaugural edition. Three days of diplomacy, debate, and unforgettable experiences at Sanskriti Degree College, Kondapur.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <Button asChild className="btn-accent">
                                            <Link
                                                href="https://drive.google.com/drive/folders/1ZU8qseZSVTgjZN_Aj4UoKOMeccxGQrUl?usp=sharing"
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center"
                                            >
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                Event Photos
                                            </Link>
                                        </Button>
                                        <Button asChild className="btn-glass">
                                            <Link
                                                href="https://v0-mun-website-system.vercel.app"
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center"
                                            >
                                                <Play className="mr-2 h-4 w-4" />
                                                Tech Demo
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Right: Two stacked square videos */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <div className="rounded-xl overflow-hidden bg-surface border border-white/10 aspect-square">
                                            <video
                                                className="h-full w-full object-cover"
                                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-JUoNqmvuGi09WaEPaaBd6wmyzUvIIy.mp4"
                                                autoPlay muted loop playsInline
                                            />
                                        </div>
                                        <p className="text-xs text-muted text-center">Venue</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="rounded-xl overflow-hidden bg-surface border border-white/10 aspect-square">
                                            <video
                                                className="h-full w-full object-cover"
                                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alle%20house%20%281%29-kmPSrW85x4Zre7OZDTK4e1x7khLVAf.mp4"
                                                autoPlay muted loop playsInline
                                            />
                                        </div>
                                        <p className="text-xs text-muted text-center">Socials</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </ChunkSection>

                {/* ════════════════ CONTACT CTA ════════════════ */}
                <ChunkSection id="contact" className="py-24">
                    <div className="container">
                        <FloatingCard className="p-8 md:p-12 metallic-card text-center">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm font-semibold">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Edition 2
                                </div>
                                <h2 className="text-3xl md:text-5xl font-light text-fg">
                                    The Journey <span className="font-semibold metallic-text">Continues</span>
                                </h2>
                                <h2 className="text-3xl md:text-5xl font-light text-fg">Join the
                                    <span className="font-semibold metallic-text"> Evolution.</span>
                                </h2>

                                <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
                                    The success of our first edition has set the stage for something even bigger. Register now or follow us for the latest announcements.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Button asChild className="btn-accent">
                                        <Link href="/registrations" className="flex items-center">
                                            Register Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="btn-glass">
                                        <Link
                                            href="https://www.instagram.com/sapphire_mun/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            <Instagram className="mr-2 h-4 w-4" />
                                            Follow for Updates
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-6 justify-center pt-4 text-sm text-muted">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-accent" /> Hyderabad
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-accent" /> May 1–3, 2026
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-accent" /> 200+ Delegates
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </ChunkSection>

                {/* ════════════════ FOOTER ════════════════ */}
                <div className="h-24 bg-gradient-to-b from-transparent to-[rgba(12,22,54,0.9)]" />
                <footer className="py-5" style={{ background: "linear-gradient(180deg, rgba(12,22,54,0.9), rgba(10,18,46,0.95))" }}>
                    <div className="container py-16 md:py-20 pt-20 md:pt-24">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {/* Logo and Description */}
                            <div className="lg:col-span-2 space-y-4">
                                <Link href="/" className="flex items-center gap-3">
                                    <img src="/images/design-mode/download.png" alt="Sapphire MUN" className="h-10 w-auto flex-shrink-0" />
                                    <span className="text-xl font-bold text-fg">Sapphire MUN</span>
                                </Link>
                                <p className="text-muted max-w-md">Experience-first design. India&apos;s first Experience-targeted Model United Nations.</p>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-fg">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link href="#committees" className="block text-muted hover:text-accent transition-colors">Committees</Link>
                                    {/* <Link href="/registrations" className="block text-muted hover:text-accent transition-colors">Register</Link> */}
                                    <Link href="https://v0-mun-website-system.vercel.app" className="block text-muted hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Integrated Tech Experience</Link>
                                    <Link href="/docs" className="block text-muted hover:text-accent transition-colors">Resources</Link>
                                </div>
                            </div>

                            {/* Contact & Register */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-fg">Get Involved</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted">
                                        <Mail className="w-4 text-accent h-4" />
                                        <a href="mailto:thesapphiremun@gmail.com" className="hover:text-accent transition-colors py-3">thesapphiremun@gmail.com</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted">
                                        <Instagram className="w-4 text-accent h-4" />
                                        <a href="https://www.instagram.com/sapphire_mun/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors py-2.5">@sapphire_mun</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted">
                                        <Calendar className="h-4 w-4 text-accent" />
                                        <span className="py-2.5">MAY 1 · 2 · 3, 2026</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted">
                                        <MapPin className="h-4 w-4 text-accent" />
                                        <span className="py-2.5">Hyderabad, India</span>
                                    </div>
                                    <Button asChild className="btn-accent w-full mt-4">
                                        <Link href="/registrations">Register for Edition 2</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 text-center pb-0.5">
                            <p className="text-sm text-muted">
                                Sapphire Model United Nations. All rights reserved. | Site Made by{" "}
                                <a href="https://in.linkedin.com/in/dhruva-sammeta-19198a291" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/100">
                                    <span className="font-semibold metallic-text"> Dhruva Sammeta</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
