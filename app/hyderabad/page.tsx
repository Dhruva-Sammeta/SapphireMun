"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
    Anchor,
    Activity,
    History,
} from "lucide-react"

import FloatingCard from "@/components/floating-card"
import FloatingNavbar from "@/components/floating-navbar"
import ErrorBoundary from "@/components/error-boundary"
import Itinerary from "@/components/itinerary"
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
        agenda: "Deliberating upon the prevention of the usage of unethical small arms and LAWS in Regional and International conflicts with special emphasis Convention on Certain Conventional Weapons (CCW)",
        bgLink: null,
        eb: [
            { name: "Sai Swarnatej", position: "Chairperson", image: "/images/committees/DISEC/Disec's Chairperson- Sai Swarnatej.png" },
            { name: "Anmol Lokhande", position: "Vice-Chair", image: "/images/committees/DISEC/Vice-Chair - DISEC - Anmol Lokhande.png" },
            { name: "Marri Shaurya", position: "Rapporteur", image: "/images/committees/DISEC/Disec's Rapporteur- Marri Shaurya.png" }
        ]
    },
    {
        id: 2,
        status: "revealed" as const,
        title: "UNHRC",
        fullName: "United Nations Human Rights Council",
        icon: Heart,
        type_level: "Human Rights · Intermediate",
        desc: "Addressing systemic human rights violations and the intersection of digital sovereignty with fundamental freedoms.",
        agenda: "Protection and promotion of human rights while countering terrorism in the central sahel region.",
        bgLink: null,
        eb: [
            { name: "Sanjuktha Naidu", position: "Chairperson", image: "/images/committees/UNHRC/Chairperson for UNHRC- Sanjuktha Naidu.png" },
            { name: "Akshajj Arora", position: "Rapporteur", image: "/images/committees/UNHRC/Rapporteur for UNHRC- Akshajj Arora.png" }
        ]
    },
    {
        id: 3,
        status: "revealed" as const,
        title: "LOK SABHA",
        fullName: "The House of the People",
        icon: Gavel,
        type_level: "Parliamentary · Advanced",
        desc: "India's lower house of Parliament. Engage in fierce parliamentary debate on policies shaping the nation's future.",
        agenda: "Deliberation on the structural framework of the Uniform Civil Code (UCC) with special emphasis on federal autonomy and minority rights",
        bgLink: "/images/committees/Lok Sabha/LOKSABHA - BG - SAPPHIREMUN.pdf",
        eb: [
            { name: "Sangras Bhargav", position: "Speaker", image: "/images/committees/Lok Sabha/Speaker for Loksabha- Sangras Bhargav.png" },
            { name: "PVS Deepak", position: "Deputy Speaker", image: "/images/committees/Lok Sabha/Loksabha's Deputy Speaker- PVS Deepak.png" },
            { name: "Shanmukha", position: "Scribe", image: "/images/committees/Lok Sabha/LokSabha - Scribe - Shanmukha.png" }
        ]
    },
    {
        id: 4,
        status: "revealed" as const,
        title: "IFI",
        fullName: "Indian Film Industry",
        icon: Film,
        type_level: "Creative · Fun",
        desc: "A crisis simulation set in the world of Indian cinema. Navigate industry politics, creative disputes, and cultural influence.",
        agenda: "Deliberation on Political Bias in Film Certification, Communal Bias, Workplace Harassment, and Structural Safety Reforms in the Indian Film Industry",
        bgLink: null,
        eb: [
            { name: "Nagapranadeep Yenigalla", position: "Chairperson", image: "/images/committees/IFI/Nagapranadeep Yenigalla - Chairperson - IFI.png" },
            { name: "Saaketh Abireddi", position: "Vice-chair", image: "/images/committees/IFI/Saaketh Abireddi- Vice-chair - IFI.png" },
            { name: "Navdeep M", position: "Rapporteur", image: "/images/committees/IFI/Navdeep M - Rapporteur - IFI.png" }
        ]
    },
    {
        id: 5,
        status: "revealed" as const,
        title: "IP",
        fullName: "International Press",
        icon: Newspaper,
        type_level: "Press Corps · All Levels",
        desc: "Report, fact-check, and shape the narrative. The IP corps covers all committees with journalistic integrity and flair.",
        agenda: "Journalistic coverage of all committees (covering reports, photography, and press conferences).",
        bgLink: null,
        eb: []
    },
    {
        id: 6,
        status: "revealed" as const,
        title: "WHO",
        fullName: "World Health Organisation",
        icon: Activity,
        type_level: "Specialized Agency · Intermediate",
        desc: "Deliberating on global health security, infection prevention, and controlling public health risks associated with wildlife sales in traditional food markets.",
        agenda: "Reducing public health risks associated with the sale of live wild animals of mammalian species in traditional food markets – infection prevention and control.",
        bgLink: null,
        eb: [
            { name: "Sai Srikar", position: "Chairperson", image: "/images/committees/WHO/Sai Srikar - CHAIR PERSON WHO.png" },
            { name: "Adhrit Gande", position: "Vice-Chair", image: "/images/committees/WHO/Adhrit Gande - Vice-Chair WHO.png" },
            { name: "Parthiv", position: "Rapporteur", image: "/images/committees/WHO/Parthiv - Rapporteur - WHO.png" }
        ]
    },
    {
        id: 7,
        status: "revealed" as const,
        title: "HCC",
        fullName: "Historical Crisis Committee",
        icon: History,
        type_level: "Crisis Committee · Advanced",
        desc: "Travel back in time to navigate historical flashpoints, geopolitical shifts, and high-stakes decision-making with a strict freeze date.",
        agenda: "Freeze date May 14th 1948",
        bgLink: "/images/committees/HCC/HCC BG SAPPHIRE.pdf",
        eb: [
            { name: "Ayaan ahmed khan", position: "Chairperson", image: "/images/committees/HCC/Ayaan ahmed khan - chairperson - HCC.png" },
            { name: "Maithreya Musunuri", position: "Vice-Chair", image: "/images/committees/HCC/Maithreya Musunuri - Vice-Chair HCC.png" },
            { name: "Vishwas Yerram", position: "Co-Vice- Chair", image: "/images/committees/HCC/Vishwas Yerram - Co-Vice- Chair - HCC.png" }
        ]
    },
]



/* ─── OnePieceCard — nautical wave animation ─── */
function OnePieceCard({ onClick }: { onClick: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [hyperKey, setHyperKey] = useState(0)
    const [bodyVisible, setBodyVisible] = useState(false)
    const hasAutoPlayed = useRef(false)
    const isMobileRef = useRef(false)

    useEffect(() => {
        isMobileRef.current = window.innerWidth < 768 || "ontouchstart" in window
    }, [])

    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        const threshold = 0.15
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
            { threshold, rootMargin: "0px" }
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
            onClick={onClick}
            className={`group relative rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer overflow-hidden transition-all duration-700 metallic-card ${!bodyVisible ? "opacity-0 blur-xl md:opacity-100 md:blur-none translate-y-4 md:translate-y-0" : "opacity-100 blur-none translate-y-0"
                } border border-cyan-500/10 hover:border-teal-500/40`}
        >
            {/* Base hover glow (nautical teal) */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.2),transparent_70%)] transition-all duration-700 pointer-events-none" />

            {/* Wave Effect container */}
            <div
                className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ height: "70px", maskImage: "linear-gradient(to bottom, transparent, black)" }}
            >
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
                    className="absolute bottom-0 flex w-[200%]"
                >
                    <svg className="w-full h-full text-teal-400/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,114.62,185.92,86.62,267.39,63.44Z" fill="currentColor" />
                    </svg>
                    <svg className="w-full h-full text-teal-400/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,114.62,185.92,86.62,267.39,63.44Z" fill="currentColor" />
                    </svg>
                </motion.div>
                <motion.div
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 12 }}
                    className="absolute bottom-0 flex w-[200%]"
                >
                    <svg className="w-full h-full text-blue-500/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor" />
                    </svg>
                    <svg className="w-full h-full text-blue-500/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor" />
                    </svg>
                </motion.div>
            </div>

            <div className="space-y-4 z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-teal-900/15 text-teal-500/40 group-hover:scale-110 group-hover:bg-teal-900/40 transition-all duration-300">
                        <Anchor className="h-5 w-5 group-hover:text-teal-400 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <HyperText
                            key={hyperKey}
                            text="ONE PIECE"
                            className="text-lg md:text-xl font-bold tracking-wider text-fg drop-shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                            duration={800}
                            animateOnLoad={true}
                        />
                    </div>
                    <div
                        className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.1)]"
                    >
                        Secret
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/10 group-hover:via-teal-500/40 to-transparent transition-all duration-700" />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={bodyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="space-y-2"
                >
                    <p className="text-teal-200/60 text-xs font-medium italic">The Grand Line Fleet</p>
                    <p className="text-teal-200/80 text-sm font-medium">Grand Line · Classified</p>
                    <p className="text-muted/80 text-sm leading-relaxed line-clamp-3">
                        Set sail for the Grand Line. Navigate treacherous alliances, legendary bounties, and the pursuit of ultimate freedom.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={bodyVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-auto pt-2 border-t border-teal-500/10"
                >
                    <p className="text-xs text-teal-400/80 flex items-center gap-2 mt-2 font-medium tracking-wide">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                        </span>
                        Click here to view more
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

/* ─── CommitteeCard ─── */
type CommitteeItem = (typeof committees)[number]

function CommitteeCard({ c, onClick }: { c: CommitteeItem; onClick: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [hyperKey, setHyperKey] = useState(0)
    const [bodyVisible, setBodyVisible] = useState(false)
    const hasAutoPlayed = useRef(false)
    const isMobileRef = useRef(false)

    useEffect(() => {
        isMobileRef.current = window.innerWidth < 768 || "ontouchstart" in window
    }, [])

    // Native IntersectionObserver — works for both desktop (15% threshold) and
    // mobile (50% threshold so it fires when card is center-focused while scrolling)
    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const threshold = 0.15

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
            { threshold, rootMargin: "0px" }
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
            onClick={onClick}
            className={`group relative rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer overflow-hidden transition-all duration-700 metallic-card border border-cyan-500/15 hover:border-cyan-400/40 ${!bodyVisible ? "opacity-0 blur-xl md:opacity-100 md:blur-none translate-y-4 md:translate-y-0" : "opacity-100 blur-none translate-y-0"
                }`}
        >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)] transition-all duration-700 pointer-events-none" />

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
                        Click here to view more
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
    const [selectedCommittee, setSelectedCommittee] = React.useState<any | null>(null)
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
            {/* Content visibility controlled here — always rendered so hero is in DOM before preloader exits */}
            <div
                style={{ pointerEvents: revealed ? "auto" : "none" }}
            >
                <FloatingNavbar
                    items={[
                        { href: "/", label: "Home" },
                        { href: "/registrations", label: "Registrations" },
                        { href: "/resources", label: "Resources" },
                        { href: "#venue", label: "Venue" },
                        { href: "#itinerary", label: "Schedule" },
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
                                className="mx-auto max-w-4xl text-center space-y-4 px-4"
                            >
                                {/* Logo */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                                    }}
                                    className="inline-block relative px-0 mt-24 mb-2"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
                                    <img
                                        src="/images/sapphire-mun-hero-logo.png"
                                        alt="Sapphire Model United Nations emblem"
                                        className="w-48 h-48 md:w-60 md:h-60 mx-auto object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                    />
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                                    }}
                                    className="space-y-3"
                                >
                                    <div className="inline-flex items-center px-4 py-2 rounded-full text-[var(--ocean-1000)] text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Edition 2 • Hyderabad
                                    </div>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
                                        Sapphire <span className="font-semibold metallic-text">MUN</span>
                                    </h1>
                                    <p className="text-base md:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
                                        Strategize. Socialize. Scrutinize.<br className="hidden sm:block" />
                                        India&apos;s first Experience-targeted Model United Nations returns to Hyderabad. Now Handling all delegates of YI&apos;MUN and Lumen MUN Hyderabad.
                                    </p>
                                </motion.div>

                                {/* CTA Buttons */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                                    }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 px-4"
                                >
                                    <Button asChild size="lg" className="btn-accent w-full sm:w-auto">
                                        <Link href="/registrations" className="flex items-center justify-center">
                                            Register Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/resources")}
                                        size="lg"
                                        className="btn-glass w-full sm:w-auto text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10"
                                    >
                                        Resources
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
                                    className="pt-3 flex flex-col items-center gap-3"
                                >
                                    <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 text-sm font-bold tracking-widest uppercase">
                                        Resources Out
                                    </div>
                                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl sm:rounded-full border border-cyan-400/30 bg-cyan-500/5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-accent" />
                                            <span className="text-lg md:text-xl font-semibold text-fg">JUNE 19 · 20 · 21</span>
                                        </div>
                                        <div className="hidden sm:block w-px h-6 bg-cyan-400/30" />
                                        <a href="#venue" className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                                            <MapPin className="h-5 w-5 text-accent" />
                                            <span className="text-lg md:text-xl font-semibold text-fg">The Arthah School, Hyderabad</span>
                                        </a>
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
                                        <div className="text-2xl font-semibold">8</div>
                                        <div className="text-xs text-muted">Committees</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold">3</div>
                                        <div className="text-xs text-muted">Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold">250+</div>
                                        <div className="text-xs text-muted">Delegates</div>
                                    </div>
                                </motion.div>

                                {/* Chevron */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
                                    }}
                                    className="pt-4"
                                >
                                    <ChevronDown className="w-8 h-8 text-white/25 animate-bounce mx-auto" />
                                </motion.div>
                            </motion.div>
                        }
                    </div>
                </section>

                {/* ════════════════ NEW VENUE ANNOUNCEMENT ════════════════ */}
                <ChunkSection id="venue" className="py-16 md:py-24 relative">
                    <div className="container px-4">
                        <div className="text-center space-y-4 mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                The <span className="font-semibold metallic-text">Venue</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
                                We are proud to announce our campus for Sapphire MUN 2.0.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden metallic-card group"
                            style={{ minHeight: "600px" }}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 z-0 bg-[#0a1535]">
                                <img
                                    src="/images/arathanschool.png"
                                    alt="The Arthah School Campus"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1535]/90 via-[#0a1535]/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1535]/80 via-transparent to-transparent" />
                            </div>

                            {/* Glow overlays */}
                            <div className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

                            {/* Content Overlays */}
                            <div className="relative z-10 flex flex-col justify-center sm:justify-end h-full p-8 md:p-12 lg:p-16 min-h-[500px] md:min-h-[600px]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "0px" }}
                                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                                    className="flex flex-col items-start space-y-4 md:space-y-6 max-w-3xl"
                                >
                                    {/* Logo as Title */}
                                    <div className="w-56 md:w-80 lg:w-[450px] bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-xl">
                                        <img
                                            src="/images/cropped-LOGO.png"
                                            alt="The Arthah School Logo"
                                            className="w-full h-auto relative z-10 rounded-2xl object-contain"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {/* Official Campus Badge */}
                                        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] md:text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-2">
                                            Official Campus
                                        </div>

                                        {/* Sub-text */}
                                        <p className="text-base md:text-xl text-blue-50/90 font-light drop-shadow-md leading-relaxed">
                                            The Arthah School, Hyderabad.
                                        </p>
                                        <p className="text-sm md:text-md text-cyan-200/90 font-medium drop-shadow-md leading-relaxed mt-2 pt-2 border-t border-cyan-500/30">
                                            Note: Sapphire MUN will be providing transport. Specific details and stops for pickup and drop off will be announced before the event.
                                        </p>
                                    </div>

                                    {/* Google Maps CTA */}
                                    <div className="pt-2">
                                        <Button asChild className="btn-accent border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                            <a
                                                href="https://maps.app.goo.gl/nCXjkD8iBbtb5WCW7"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center"
                                            >
                                                <MapPin className="mr-2 h-4 w-4" />
                                                View on Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </ChunkSection>

                {/* ════════════════ ITINERARY / SCHEDULE ════════════════ */}
                <ChunkSection id="itinerary" className="py-16 md:py-24 relative">
                    <div className="container px-4">
                        <div className="text-center space-y-4 mb-8 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                Conference <span className="font-semibold metallic-text">Schedule</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
                                Plan your days. An overview of committee sessions, socials, and events.
                            </p>
                        </div>
                        <Itinerary />
                    </div>
                </ChunkSection>

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
                            {committees.map((c) => (
                                <CommitteeCard
                                    key={c.id}
                                    c={c}
                                    onClick={() => setSelectedCommittee(c)}
                                />
                            ))}

                            {/* One Piece — nautical special committee slot */}
                            <OnePieceCard
                                onClick={() => setSelectedCommittee({
                                    id: "one-piece",
                                    title: "ONE PIECE",
                                    fullName: "The Grand Line Fleet",
                                    icon: Anchor,
                                    type_level: "Grand Line · Classified",
                                    desc: "Set sail for the Grand Line. Navigate treacherous alliances, legendary bounties, and the pursuit of ultimate freedom.",
                                    agenda: "Disbandment of the white beard pirates. Freeze date: Arrival of the Red haired pirates",
                                    specialType: "nautical",
                                    bgLink: null,
                                    eb: [
                                        { name: "Taran Krishna", position: "Crisis Director", image: "/images/committees/ONE PIECE/Crisis Director for One Piece - Taran Krishna.png" },
                                        { name: "Mohammed Omer", position: "Crisis Moderator", image: "/images/committees/ONE PIECE/Crisis Moderator for One Piece - Mohammed Omer.png" },
                                        { name: "Vrishin", position: "Deputy Crisis Moderator", image: "/images/committees/ONE PIECE/Deputy Crisis Moderator for One Piece- Vrishin.png" }
                                    ]
                                })}
                            />
                        </div>

                        {/* Resources CTA Card under Committees */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            onClick={() => router.push("/resources")}
                            className="mt-8 relative rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer overflow-hidden transition-all duration-500 border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 hover:border-cyan-400/40 hover:from-cyan-500/10 hover:to-blue-500/10 group shadow-[0_8px_32px_rgba(6,182,212,0.05)]"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none" />
                            <div className="space-y-2 z-10 relative flex-1 text-center md:text-left">
                                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                                    Conference Prep
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                    Access Conference Resources & Guides
                                </h3>
                                <p className="text-sm text-muted/80 max-w-xl">
                                    Download delegation resources, Liability forms, Codes of Conduct, and preparation documents for all committees.
                                </p>
                            </div>
                            <div className="z-10 relative flex-shrink-0">
                                <Button className="btn-accent shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                    View Resources
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
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

                        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
                            <FloatingCard className="p-8 metallic-card text-center border-accent/20">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/15 flex items-center justify-center">
                                    <Sparkles className="h-8 w-8 text-accent" />
                                </div>
                                <h3 className="text-2xl font-bold text-fg mb-3">₹50,000 Prize Pool</h3>
                                <p className="text-muted text-base leading-relaxed">
                                    Compete for our massive cash prize pool alongside significant certificates, recommendations, and prestigious recognition.
                                </p>
                            </FloatingCard>
                            <FloatingCard className="p-6 metallic-card text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/15 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold text-fg mb-2">Internships & Networking</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Gain access to exclusive internships and premier networking opportunities in association with The Teen Entrepreneurship Network.
                                </p>
                            </FloatingCard>
                        </div>
                    </div>
                </ChunkSection>

                {/* ════════════════ SPONSORS ════════════════ */}
                <ChunkSection className="py-24 relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                Our <span className="font-semibold metallic-text">Sponsors</span>
                            </h2>
                            <p className="text-lg text-muted max-w-2xl mx-auto">
                                Proudly supported by our esteemed partners.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <FloatingCard className="p-8 md:p-12 metallic-card text-center relative overflow-hidden">
                                {/* Gradient fade on left and right for seamless scrolling effect */}
                                <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[rgba(10,15,35,0.9)] to-transparent z-10 pointer-events-none" />
                                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[rgba(10,15,35,0.9)] to-transparent z-10 pointer-events-none" />
                                
                                <div className="flex w-max relative items-center gap-16 sm:gap-24 animate-marquee py-4">
                                    {/* Marquee Group 1 */}
                                    <div className="flex items-center gap-16 sm:gap-24 shrink-0">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Title Sponsor</div>
                                            <img src="/images/sponsors/title-rangareddy.png" alt="Ranga Reddy Raptors - Title Sponsor" className="h-28 md:h-36 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Gold Sponsor</div>
                                            <img src="/images/sponsors/gold-exome.png" alt="Exome Life Sciences - Gold Sponsor" className="h-24 md:h-32 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-slate-300 bg-slate-300/10 px-3 py-1 rounded-full border border-slate-300/20">Silver Sponsor</div>
                                            <img src="/images/sponsors/silver-nalgonda.png" alt="Nalgonda Speeds Strikers - Silver Sponsor" className="h-20 md:h-28 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">Bronze Sponsor</div>
                                            <img src="/images/sponsors/bronze-24roots.png" alt="24 Roots - Bronze Sponsor" className="h-16 md:h-24 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">Bronze Sponsor</div>
                                            <img src="/images/sponsors/bronze-fathersmodel.png" alt="Father's Model High School - Bronze Sponsor" className="h-16 md:h-24 object-contain" />
                                        </div>
                                    </div>
                                    
                                    {/* Marquee Group 2 (Duplicate for seamless loop) */}
                                    <div className="flex items-center gap-16 sm:gap-24 shrink-0">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Title Sponsor</div>
                                            <img src="/images/sponsors/title-rangareddy.png" alt="Ranga Reddy Raptors - Title Sponsor" className="h-28 md:h-36 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Gold Sponsor</div>
                                            <img src="/images/sponsors/gold-exome.png" alt="Exome Life Sciences - Gold Sponsor" className="h-24 md:h-32 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-slate-300 bg-slate-300/10 px-3 py-1 rounded-full border border-slate-300/20">Silver Sponsor</div>
                                            <img src="/images/sponsors/silver-nalgonda.png" alt="Nalgonda Speeds Strikers - Silver Sponsor" className="h-20 md:h-28 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">Bronze Sponsor</div>
                                            <img src="/images/sponsors/bronze-24roots.png" alt="24 Roots - Bronze Sponsor" className="h-16 md:h-24 object-contain" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">Bronze Sponsor</div>
                                            <img src="/images/sponsors/bronze-fathersmodel.png" alt="Father's Model High School - Bronze Sponsor" className="h-16 md:h-24 object-contain" />
                                        </div>
                                    </div>
                                </div>
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
                                        <Calendar className="h-4 w-4 text-accent" /> June 19-21, 2026
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-accent" /> 200+ Delegates
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </ChunkSection>

                {/* ════════════════ COMMITTEE MODAL ════════════════ */}
                <AnimatePresence>
                    {selectedCommittee && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedCommittee(null)}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className={`relative w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.5)] p-6 md:p-10 border z-10 ${
                                    selectedCommittee.specialType === "nautical"
                                        ? "border-teal-500/20 bg-slate-900/50"
                                        : "border-cyan-500/20 bg-slate-900/50"
                                } backdrop-blur-2xl`}
                            >
                                <div
                                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-60"
                                    style={{
                                        background: selectedCommittee.specialType === "nautical"
                                            ? "radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 70%)"
                                            : "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)"
                                    }}
                                />
                                
                                <button
                                    onClick={() => setSelectedCommittee(null)}
                                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-20 hover:scale-110"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="flex flex-col md:flex-row gap-5 mb-1 relative z-10">
                                    <div className="md:w-[55%]">
                                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md mb-2">
                                            {selectedCommittee.title}
                                        </h2>
                                        <p className="text-lg md:text-xl font-semibold text-cyan-300 mb-1">{selectedCommittee.fullName}</p>
                                        <p className="text-sm text-white/50 font-medium mb-4">{selectedCommittee.type_level}</p>
                                        <p className="text-base md:text-lg text-muted leading-relaxed mb-6">
                                            {selectedCommittee.desc}
                                        </p>
                                        
                                        <div>
                                            {selectedCommittee.bgLink ? (
                                                <a
                                                    href={selectedCommittee.bgLink}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Background Guide
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-semibold cursor-not-allowed"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Background guides to be announced
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="md:w-[45%] p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
                                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity group-hover:scale-110 duration-500">
                                            {React.createElement(selectedCommittee.icon, { className: "w-32 h-32" })}
                                        </div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400/80 mb-3 flex items-center gap-2 relative z-10">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Agenda
                                        </h4>
                                        {selectedCommittee.agenda ? (
                                            <p className="text-base md:text-lg text-white/90 leading-relaxed font-medium italic relative z-10">
                                                "{selectedCommittee.agenda}"
                                            </p>
                                        ) : (
                                            <p className="text-base md:text-lg text-white/40 italic relative z-10">To be announced...</p>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedCommittee.eb && selectedCommittee.eb.length > 0 && (
                                    <div className="relative z-10 mt-5 pt-4 border-t border-cyan-500/10">
                                        <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                                            {selectedCommittee.eb.map((member: any, i: number) => (
                                                <div key={i} className="flex flex-col items-center group max-w-[100px]">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border border-cyan-500/20 group-hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] flex-shrink-0">
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <p className="text-white font-bold text-center text-sm md:text-base leading-tight">{member.name}</p>
                                                    <p className="text-[10px] md:text-xs text-cyan-300 mt-1.5 uppercase tracking-widest text-center font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{member.position}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
                                    <Link href="/resources" className="block text-muted hover:text-accent transition-colors">Resources</Link>
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
                                        <span className="py-2.5">JUNE 19 · 20 · 21, 2026</span>
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
