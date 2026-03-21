"use client"

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Users, Award, Ticket, Lock, Sparkles, Briefcase, Building, FileText, ExternalLink } from "lucide-react"
import FloatingNavbar from "@/components/floating-navbar"
import "../../app/refined.css"

export default function RegistrationsPage() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-app text-app overflow-x-hidden">
      <FloatingNavbar
        items={[
          { href: "/hyderabad", label: "Home" },
          { href: "#registrations", label: "Registrations" },
          { href: "https://www.instagram.com/sapphire_mun/", label: "Contact" },
        ]}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-blue-800/15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 animate-pulse" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 container max-w-4xl mx-auto px-4 text-center space-y-6"
          >
            <img
              src="/images/sapphire-mun-hero-logo.png"
              alt="Sapphire MUN"
              className="h-20 w-auto mx-auto mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            />
            <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white/90">
              Event{" "}
              <span className="font-semibold metallic-text">Registrations</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Secure your seat at Sapphire MUN Hyderabad 2.0
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto rounded-full" />
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Registration Cards */}
      <section id="registrations" className="pb-16 md:pb-24 pt-0 relative">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">

            {/* Delegate Registration — Active Internal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/registrations/delegate" className="block h-full">
                <div className="group relative h-full cursor-pointer rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/30 to-[#0a1535]/80 backdrop-blur-md p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-blue-400/60 hover:bg-blue-900/20 hover:translate-y-[-4px] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] shadow-2xl">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-400/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>

                  <h2 className="text-2xl font-light mb-2 text-white group-hover:text-blue-200 transition-colors relative z-10">
                    Delegate
                  </h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 relative z-10">
                    Registration
                  </div>

                  <p className="text-sm text-white/60 mb-6 leading-relaxed relative z-10">
                    Register as a delegate, make your payment, and receive your official digital pass.
                  </p>

                  <div className="mt-auto px-6 py-2.5 rounded-full border border-blue-500/30 text-sm font-semibold text-blue-200 bg-blue-900/20 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 flex items-center gap-2 relative z-10">
                    Proceed <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Live pulse */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Executive Board Applications — Active External */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="https://forms.gle/QndABCbEKmBNfLiVA" target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="group relative h-full cursor-pointer rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-900/20 to-[#0a1535]/80 backdrop-blur-md p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-blue-400/50 hover:bg-blue-900/30 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-8 h-8 text-blue-300/80" />
                  </div>

                  <h2 className="text-2xl font-light mb-2 text-white group-hover:text-blue-200 transition-colors relative z-10">
                    Executive Board
                  </h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400/70 mb-4 relative z-10">
                    Applications
                  </div>

                  <p className="text-sm text-white/50 mb-6 leading-relaxed relative z-10">
                    Apply to serve on the prestigious Executive Board and moderate our intense committees.
                  </p>

                  <div className="mt-auto px-5 py-2 rounded-full border border-blue-500/20 text-sm font-semibold text-blue-300/70 bg-blue-900/10 group-hover:bg-blue-500/20 group-hover:text-blue-200 transition-all duration-300 flex items-center gap-2 relative z-10">
                    Application Form <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Secretariat Applications — Active External */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <a href="https://forms.gle/Hy7pPejQpxNyhqjH6" target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="group relative h-full cursor-pointer rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-900/20 to-[#0a1535]/80 backdrop-blur-md p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-blue-400/50 hover:bg-blue-900/30 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-8 h-8 text-blue-300/80" />
                  </div>

                  <h2 className="text-2xl font-light mb-2 text-white group-hover:text-blue-200 transition-colors relative z-10">
                    Secretariat
                  </h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400/70 mb-4 relative z-10">
                    Applications
                  </div>

                  <p className="text-sm text-white/50 mb-6 leading-relaxed relative z-10">
                    Step up to lead the core administrative backbone of Sapphire MUN.
                  </p>

                  <div className="mt-auto px-5 py-2 rounded-full border border-blue-500/20 text-sm font-semibold text-blue-300/70 bg-blue-900/10 group-hover:bg-blue-500/20 group-hover:text-blue-200 transition-all duration-300 flex items-center gap-2 relative z-10">
                    Application Form <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </a>
            </motion.div>

            {/* OC Committee Applications — Active External */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="https://forms.gle/Gy168CB2fLQVfmHU9" target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="group relative h-full cursor-pointer rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-900/20 to-[#0a1535]/80 backdrop-blur-md p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-blue-400/50 hover:bg-blue-900/30 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-blue-300/80" />
                  </div>

                  <h2 className="text-2xl font-light mb-2 text-white group-hover:text-blue-200 transition-colors relative z-10">
                    Organizing Committee
                  </h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400/70 mb-4 relative z-10">
                    Applications
                  </div>

                  <p className="text-sm text-white/50 mb-6 leading-relaxed relative z-10">
                    Join the organizing committee and help shape the operational framework behind the second edition.
                  </p>

                  <div className="mt-auto px-5 py-2 rounded-full border border-blue-500/20 text-sm font-semibold text-blue-300/70 bg-blue-900/10 group-hover:bg-blue-500/20 group-hover:text-blue-200 transition-all duration-300 flex items-center gap-2 relative z-10">
                    Application Form <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Social Pass — Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-default"
            >
              <div className="relative h-full rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-[#0a1535]/70 to-cyan-950/30 backdrop-blur-md p-8 flex flex-col items-center text-center overflow-hidden shadow-2xl">
                {/* Gradient shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5 opacity-60" />

                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-400/20 relative z-10">
                  <Ticket className="w-8 h-8 text-purple-300/40" />
                </div>

                <h2 className="text-2xl font-light mb-2 text-white/50 relative z-10">
                  Social Pass
                </h2>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-400/40 mb-4 relative z-10">
                  Experience Access
                </div>

                <p className="text-sm text-white/30 mb-6 leading-relaxed relative z-10">
                  A special pass for social events, networking, and the full Sapphire ultimate experience.
                </p>

                <div className="mt-auto px-6 py-2.5 rounded-full border border-purple-500/20 text-sm font-semibold text-purple-300/40 bg-purple-900/10 flex items-center gap-2 relative z-10">
                  <Sparkles className="w-4 h-4" /> Coming Soon
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  )
}
