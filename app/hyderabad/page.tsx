"use client"

import React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    ChevronDown,
    Play,
    Users,
    Calendar,
    MapPin,
    GraduationCap,
    Sparkles,
    Gavel,
    Camera,
    Heart,
    Shield,
    Anchor,
    Instagram,
    ImageIcon,
    TrendingUp,
} from "lucide-react"
import Footer from "@/components/footer"
import FloatingCard from "@/components/floating-card"
import FloatingNavbar from "@/components/floating-navbar"
import "../refined.css"
import ChunkSection from "@/components/chunk-section"
import ParallaxScene from "@/components/parallax-scene"
import Section from "@/components/section"
import GlowCard from "@/components/glow-card"
import PagePreloader from "@/components/page-preloader"

export default function Page() {
    const heroRef = useRef<HTMLElement>(null)
    const [isNavigating, setIsNavigating] = React.useState(false)
    const router = useRouter()

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

    const handleEditionSwitch = (href: string) => {
        setIsNavigating(true)
        setTimeout(() => {
            router.push(href)
        }, 800)
    }

    return (
        <div className="min-h-screen bg-app text-app overflow-x-hidden">
            <PagePreloader
                images={[
                    "/images/sapphire-mun-hero-logo.png",
                    "/images/design-mode/download.png",
                ]}
            />
            <FloatingNavbar />

            <section
                ref={heroRef}
                className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full"
            >
                <div className="absolute inset-0 -z-20 bg-hero" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-blue-800/15" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-12 animate-shimmer" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-200/5 to-transparent transform skew-x-12 animate-shimmer-reverse" />
                </div>

                <div className="container relative z-10">
                    <div className="mx-auto max-w-4xl text-center space-y-6 px-4">
                        <div className="inline-block relative px-0 my-2 py-20">
                            <div className="absolute inset-0 bg-gradient-radial from-blue-500/15 to-transparent blur-xl" />
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
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-[var(--ocean-1000)] text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse">
                                First Edition Complete ✓
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight reflect-ribbon">
                                Sapphire <span className="font-semibold metallic-text">MUN</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted font-light max-w-2xl mx-auto leading-relaxed">
                                India's first Experience-targeted Model UN. Celebrating a successful inaugural edition.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 px-4">
                            <Button asChild size="lg" className="btn-accent w-full sm:w-auto">
                                <Link
                                    href="https://drive.google.com/drive/folders/1ZU8qseZSVTgjZN_Aj4UoKOMeccxGQrUl?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center"
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    View Event Photos
                                </Link>
                            </Button>

                            <Button asChild size="lg" className="btn-glass w-full sm:w-auto">
                                <Link
                                    href="https://v0-mun-website-system.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center"
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Integrated Tech Experience
                                </Link>
                            </Button>

                            <Button
                                onClick={() => handleEditionSwitch("/vizag")}
                                size="lg"
                                className="btn-glass w-full sm:w-auto opacity-70 hover:opacity-100 bg-red-500/5 hover:bg-red-500/10 border-red-500/20"
                            >
                                <Sparkles className="mr-2 h-4 w-4 text-red-400" />
                                Visakhapatnam Edition
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto text-fg">
                            <div className="text-center">
                                <div className="text-2xl font-semibold">5</div>
                                <div className="text-sm text-muted">Committees</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold">200+</div>
                                <div className="text-sm text-muted">Delegates</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold">3</div>
                                <div className="text-sm text-muted">Days</div>
                            </div>
                            <div className="text-center col-span-3 my-0 pt-0">
                                <div className="text-sm text-muted flex items-center gap-2 py-7 justify-center text-left">
                                    <Calendar className="text-sm flex items-center gap-2 justify-center py-0" />
                                    August 15-17, 2025 • Sanskriti Degree College, Kondapur
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
                </div>
            </section>

            {/* Navigation Transition Overlay */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        key="nav-transition-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="fixed inset-0 z-[100] bg-[#050a2a] flex items-center justify-center"
                    >
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src="/images/design-mode/download.png"
                            alt="Loading"
                            className="h-20 w-auto opacity-20 animate-pulse"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ChunkSection className="py-24 relative">
                <div className="container">
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,224,255,0.18)] text-[var(--ocean-1000)] text-sm font-semibold">
                            First Edition Highlights
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                            Moments That <span className="font-semibold metallic-text">Mattered</span>
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            Explore the highlights from our inaugural edition—three days of diplomacy, debate, and unforgettable
                            experiences.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Total Delegates", value: "200+", icon: Users },
                            { label: "Committee Sessions", value: "24", icon: Gavel },
                            { label: "Networking Hours", value: "6+", icon: Sparkles },
                            { label: "Social Events", value: "2", icon: Heart },
                        ].map((stat, i) => (
                            <GlowCard key={i} className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                                    {React.createElement(stat.icon, { className: "h-6 w-6 text-accent" })}
                                </div>
                                <div className="text-3xl font-bold text-fg mb-2">{stat.value}</div>
                                <div className="text-sm text-muted">{stat.label}</div>
                            </GlowCard>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button asChild size="lg" className="btn-accent">
                            <Link
                                href="https://drive.google.com/drive/folders/1ZU8qseZSVTgjZN_Aj4UoKOMeccxGQrUl?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center mx-auto"
                            >
                                <ImageIcon className="mr-2 h-5 w-5" />
                                View Full Photo Gallery
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <p className="text-sm text-muted mt-4">Explore hundreds of photos from our first edition</p>
                    </div>
                </div>
            </ChunkSection>

            {/* Experience — first chunk, parallax glow, highlight */}
            <ChunkSection id="experience" className="py-24 relative">
                <ParallaxScene className="relative">
                    <div className="absolute inset-0 pointer-events-none">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                                backgroundSize: "38px 38px, 38px 38px",
                                opacity: 0.07,
                                maskImage: "radial-gradient(ellipse at center, black 55%, transparent 75%)",
                            }}
                            data-speed="0.03"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(520px 300px at 60% 40%, rgba(15,224,255,0.35), transparent 60%), radial-gradient(560px 340px at 40% 70%, rgba(58,167,255,0.28), transparent 60%)",
                                filter: "blur(36px)",
                                opacity: 0.65,
                            }}
                            data-speed="0.05"
                            data-rotate="1.2"
                        />
                    </div>

                    <div className="container relative">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,224,255,0.18)] text-[var(--ocean-1000)] text-sm font-semibold">
                                        Tech Innovation
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                                        Tech‑Forward <span className="font-semibold metallic-text">Experience</span>
                                    </h2>
                                    <p className="text-lg text-muted leading-relaxed">
                                        Our custom-built platform delivered real-time committee states, live agenda tracking, and instant
                                        updates throughout the event.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {["Live Updates", "Real-time Voting", "Crisis Alerts", "Session Tracking"].map((label, i) => (
                                        <FloatingCard key={label} className="p-4 metallic-card reflective-hover">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full bg-[var(--aqua)]`} />
                                                <span className="text-fg font-medium">{label}</span>
                                            </div>
                                        </FloatingCard>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button asChild className="btn-accent">
                                        <Link
                                            href="https://v0-mun-website-system.vercel.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Explore Tech Platform
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <FloatingCard className="p-8 metallic-card reflective-hover">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-fg">Committee Status Archive</h3>
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                                                <span className="text-fg">DISEC</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                                                    COMPLETED
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                                                <span className="text-fg">UNHRC</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                                                    COMPLETED
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                                                <span className="text-fg">Lok Sabha</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                                                    COMPLETED
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </FloatingCard>
                            </div>
                        </div>
                    </div>
                </ParallaxScene>
            </ChunkSection>

            {/* Prizes & Opportunities */}
            <ChunkSection className="py-24">
                <div className="container">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                            Prizes & <span className="font-semibold metallic-text">Opportunities</span>
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">Excel at Sapphire MUN and unlock a world of rewards.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <FloatingCard className="p-6 metallic-card reflective-hover text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-fg mb-2">Certified Prizes</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Compete for Significant Certificates and Recommendations under our Sapphire Ambassador Program Along
                                with the standard prizes.
                            </p>
                        </FloatingCard>
                        <FloatingCard className="p-6 metallic-card reflective-hover text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-fg mb-2">Internships & Opportunities</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Gain access to internships at leading AI companies and opportunities worth ₹80 Cr+.
                            </p>
                        </FloatingCard>
                    </div>
                </div>
            </ChunkSection>

            {/* Conference Schedule - Simplified for mobile performance */}
            <Section className="py-24">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,224,255,0.18)] text-[var(--ocean-1000)] text-sm font-semibold">
                            Conference Schedule
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light text-slate-50">
                            Three Days of <span className="font-semibold metallic-text">Excellence</span>
                        </h2>
                        <p className="text-muted max-w-2xl mx-auto font-medium">
                            A comprehensive schedule designed to maximize learning, networking, and diplomatic engagement.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Day 1 */}
                        <GlowCard className="p-6 h-full">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-slate-50">Day 1</h3>
                                    <p className="text-sm text-muted">August 15th</p>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { time: "9:00-10:00 AM", event: "Registrations" },
                                        { time: "10:00-11:00 AM", event: "Opening Ceremony" },
                                        { time: "11:00-11:30 AM", event: "Break" },
                                        { time: "11:30-1:30 PM", event: "Committee Session 1" },
                                        { time: "1:30-2:00 PM", event: "Lunch" },
                                        { time: "2:00-4:00 PM", event: "Committee Session 2" },
                                        { time: "4:30 PM-5:30 PM", event: "Networking Hour" },
                                        { time: "5:30 Onwards", event: "Dispersal" },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-1 border-b border-white/10 last:border-b-0"
                                        >
                                            <span className="text-xs text-muted font-medium">{item.time}</span>
                                            <span className="text-sm font-medium text-slate-50">{item.event}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlowCard>

                        {/* Day 2 */}
                        <GlowCard className="p-6 h-full">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-slate-50">Day 2</h3>
                                    <p className="text-sm text-muted">August 16th</p>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { time: "9:00-10:30 AM", event: "Committee Session 3" },
                                        { time: "10:30-11:00 AM", event: "Break" },
                                        { time: "11:00-1:30 PM", event: "Committee Session 4" },
                                        { time: "1:30-2:00 PM", event: "Lunch" },
                                        { time: "2:00-4:00 PM", event: "Committee Session 5" },
                                        { time: "4:00-4:30 PM", event: "Transition to Ale House" },
                                        { time: "4:30 PM-7:30 PM", event: "Social Night (Ale House)" },
                                        { time: "7:30 PM Onwards", event: "Dispersal" },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-1 border-b border-white/10 last:border-b-0"
                                        >
                                            <span className="text-xs text-muted font-medium">{item.time}</span>
                                            <span className="text-sm font-medium text-slate-50">{item.event}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlowCard>

                        {/* Day 3 */}
                        <GlowCard className="p-6 h-full">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-slate-50">Day 3</h3>
                                    <p className="text-sm text-muted">August 17th</p>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { time: "9:00-10:30 AM", event: "Committee Session 6" },
                                        { time: "10:30-11:00 AM", event: "Break" },
                                        { time: "11:00-1:30 PM", event: "Committee Session 7" },
                                        { time: "1:30-2:00 PM", event: "Lunch" },
                                        { time: "2:00-3:00 PM", event: "Committee Session 8" },
                                        { time: "3:00-4:00 PM", event: "Networking Hour" },
                                        { time: "4:00 PM-4:30 PM", event: "Break" },
                                        { time: "4:30-6:00 PM", event: "Closing Ceremony" },
                                        { time: "6:00 Onwards", event: "Dispersal" },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-1 border-b border-white/10 last:border-b-0"
                                        >
                                            <span className="text-xs text-muted font-medium">{item.time}</span>
                                            <span className="text-sm font-medium text-slate-50">{item.event}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlowCard>
                    </div>
                </div>
            </Section>

            {/* Venue highlight - Fixed mobile alignment and padding */}
            <Section className="py-24">
                <div className="container px-4">
                    <GlowCard className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,224,255,0.18)] text-[var(--ocean-1000)] text-sm font-semibold">
                                    Venue
                                </div>
                                <h3 className="text-2xl md:text-3xl font-light">
                                    <span className="font-semibold text-slate-50">Sanskriti Degree College</span>, Kondapur
                                </h3>
                                <p className="text-muted max-w-2xl font-medium">
                                    Modern facilities, state-of-the-art technology, and the perfect setting for an unforgettable MUN
                                    experience.
                                </p>
                                <Button asChild className="btn-accent w-full sm:w-auto">
                                    <Link
                                        href="https://maps.app.goo.gl/mnaEPCc4MJhoSRa69"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center"
                                    >
                                        Get directions
                                        <MapPin className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="rounded-2xl overflow-hidden bg-surface border border-white/10 aspect-video">
                                <video className="h-full w-full object-cover" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-JUoNqmvuGi09WaEPaaBd6wmyzUvIIy.mp4" autoPlay muted loop playsInline />
                            </div>
                        </div>
                    </GlowCard>
                </div>
            </Section>

            {/* Social Night highlight */}
            <ChunkSection className="py-24">
                <div className="container">
                    <FloatingCard className="p-8 metallic-card reflective-hover">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,224,255,0.18)] text-[var(--ocean-1000)] text-sm font-semibold">
                                    After Hours
                                </div>
                                <h3 className="text-2xl md:text-3xl font-light">
                                    Social Night at <span className="font-semibold metallic-text">Ale House </span>
                                </h3>
                                <p className="text-muted max-w-2xl font-medium">
                                    A well-prepped social experience to unwind, connect, and celebrate with on-spot social registrations with
                                    <span className="font-semibold metallic-text"> unlimited food and drinks</span>
                                </p>
                                <p className="text-accent font-medium">Social passes Sold Out!</p>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild className="btn-accent">
                                        <Link href="#contact" className="flex items-center">
                                            Get event updates
                                            <Sparkles className="ml-2 h-4 w-4" />
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
                                            Passes
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden bg-surface border border-white/10 aspect-video">
                                <video
                                    className="h-full w-full object-cover"
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alle%20house%20%281%29-kmPSrW85x4Zre7OZDTK4e1x7khLVAf.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </ChunkSection>

            {/* Delegate Journey */}
            <ChunkSection className="py-24">
                <div className="container">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                            Your <span className="font-semibold metallic-text">Journey</span>
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            From registration to recognition, every step is designed for your success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Register",
                                description: "Transparent process and quick onboarding",
                                icon: Users,
                            },
                            {
                                step: "02",
                                title: "Prepare",
                                description: "Background guides, training modules, chair support",
                                icon: Calendar,
                            },
                            {
                                step: "03",
                                title: "Debate",
                                description: "Structured sessions with live tech integration",
                                icon: MapPin,
                            },
                            { step: "04", title: "Celebrate", description: "Awards and socials to remember", icon: Play },
                        ].map((item, i) => (
                            <FloatingCard key={i} className="p-6 metallic-card reflective-hover text-center group">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

            {/* Committees */}
            <Section id="committees" className="py-24">
                <div className="container">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-light text-fg reflect-ribbon">
                            Our <span className="font-semibold metallic-text">Committees</span>
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            Five diverse committees offering unique perspectives on global challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                name: "Lok Sabha",
                                type: "Parliamentary",
                                level: "Intermediate",
                                icon: Gavel,
                                bgLink: "https://drive.google.com/drive/folders/1rt4ZITfHwwNj5XQVznU-6x9EJAblA77n?usp=drive_link",
                            },
                            {
                                name: "DISEC",
                                type: "Security Council",
                                level: "Intermediate",
                                icon: Shield,
                                bgLink: "https://drive.google.com/drive/folders/1buOOmJAKAj9C0NiJeCKGkfCN6xVFlNwr?usp=drive_link",
                            },
                            {
                                name: "UNHRC",
                                type: "Human Rights",
                                level: "Intermediate",
                                icon: Heart,
                                bgLink: "https://drive.google.com/drive/folders/1b6ceBb-UaMOQ7jMQBS0XCUU-_ZtqT5AC?usp=drive_link",
                            },
                            {
                                name: "Telugu Film Industry",
                                type: "Creative",
                                level: "Advanced",
                                icon: Camera,
                                bgLink: "https://drive.google.com/drive/folders/148lIkkL8HhXKrn7W0ZBCx-XpThVEIg83?usp=drive_link",
                            },
                            {
                                name: "One Piece",
                                type: "Crisis",
                                level: "Fun",
                                icon: Anchor,
                                bgLink: "https://drive.google.com/drive/folders/1Wb_75uAuLN6WmcsZHOCRCpSf0MC50y6f?usp=drive_link",
                            },
                        ].map((c, i) => (
                            <GlowCard key={i} className="p-6 group hover:scale-105 transition-all duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            {React.createElement(c.icon, { className: "h-5 w-5 text-accent" })}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-semibold text-fg group-hover:text-accent transition-colors">
                                            {c.name}
                                        </h3>
                                    </div>
                                    <p className="text-muted text-sm">
                                        {c.type} — {c.level}
                                    </p>
                                    <p className="text-muted text-sm">Agenda's and background guides out.</p>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <Button
                                            size="sm"
                                            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 flex-1"
                                            asChild
                                        >
                                            <a href={c.bgLink} target="_blank" rel="noopener noreferrer">
                                                Background Guide
                                            </a>
                                        </Button>
                                        <Button size="sm" className="text-xs hover:bg-accent/80 flex-1 bg-cyan-500" asChild>
                                            <a href="https://tally.so/r/wgVXZ4" target="_blank" rel="noopener noreferrer">
                                                Apply
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Resources */}
            <ChunkSection className="py-24">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-light text-fg">
                                    Resources & <span className="font-semibold text-accent">Documentation</span>
                                </h2>
                                <p className="text-lg text-muted leading-relaxed">
                                    Everything you need to prepare, participate, and excel at Sapphire MUN.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button asChild className="btn-accent">
                                    <Link href="/docs">Resources</Link>
                                </Button>
                                <Button asChild className="btn-accent-alt">
                                    <Link href="https://drive.google.com/drive/folders/your-folder-id" target="_blank">
                                        Drive
                                    </Link>
                                </Button>
                                <Button asChild className="btn-glass">
                                    <Link href="#contact">Contact Us</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { title: "Conference Schedule", status: "Available" },
                                { title: "Background Guides", status: "Available" },
                                { title: "Code of Conduct", status: "Available" },
                                { title: "Liability Form", status: "Available" },
                            ].map((doc, i) => (
                                <FloatingCard key={i} className="p-4 bg-surface reflective-hover">
                                    <div className="space-y-2">
                                        <div className="w-3 h-3 bg-accent rounded-full" />
                                        <h4 className="font-medium text-fg text-sm">{doc.title}</h4>
                                        <p className="text-xs text-muted">{doc.status}</p>
                                    </div>
                                </FloatingCard>
                            ))}
                        </div>
                    </div>
                </div>
            </ChunkSection>

            {/* Contact CTA (prominent) */}
            <ChunkSection id="contact" className="py-24">
                <div className="container">
                    <FloatingCard className="p-8 metallic-card reflective-hover">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-light">
                                    Questions? <span className="font-semibold metallic-text">Contact us</span>
                                </h2>
                                <p className="text-muted">
                                    We&apos;re here to help with registrations, partnerships, or just to say hi.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button asChild className="btn-accent">
                                        <Link href="mailto:thesapphiremun@gmail.com">Email Us</Link>
                                    </Button>
                                    <Button asChild className="btn-glass">
                                        <Link href="https://www.instagram.com/sapphire_mun/" className="flex items-center">
                                            <Instagram className="mr-2 h-4 w-4" />
                                            Contact on Instagram
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-accent" /> Sanskriti Degree College, Kondapur
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-accent" /> 15–17 August
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-accent" /> Social Night at Ale House
                                </div>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </ChunkSection>

            <ChunkSection className="py-24 relative">
                <div className="container">
                    <FloatingCard className="p-12 metallic-card reflective-hover text-center">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-sm font-semibold">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                What's Next
                            </div>
                            <h2 className="text-3xl md:text-5xl font-light text-fg">
                                The Journey <span className="font-semibold metallic-text">Continues</span>
                            </h2>
                            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
                                The success of our first edition has set the stage for something even bigger. Exciting plans for the
                                second edition of Sapphire MUN are already underway. Stay tuned for announcements!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
                                <Button asChild className="btn-outline">
                                    <Link href="mailto:thesapphiremun@gmail.com" className="flex items-center">
                                        Get Notified
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </ChunkSection>

            <Footer />
        </div >
    )
}
