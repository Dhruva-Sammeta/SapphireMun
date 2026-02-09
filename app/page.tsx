"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Calendar, CheckCircle, Sparkles } from "lucide-react"

export default function EditionSelector() {
  const router = useRouter()
  const [selected, setSelected] = useState<"hyderabad" | "vizag" | null>(null)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Check local storage for auto-redirect
    // const savedEdition = localStorage.getItem("sapphire-edition")
    // if (savedEdition === "hyderabad") router.push("/hyderabad")
    // if (savedEdition === "vizag") router.push("/vizag")

    // DECISION: User requested "The very first thing that loads... is a full-screen selection". 
    // Auto-redirect might skip this premium intro. 
    // So we WILL NOT auto-redirect, but we could highlight the last selection or just let them choose again.
    // Let's keep it manual for the "Wow" factor every time they visit root, 
    // or maybe auto-redirect only if they are deep linking (which is handled by other routes).
    // So on root, we show selector.
  }, [])

  const handleSelect = (edition: "hyderabad" | "vizag") => {
    setSelected(edition)
    localStorage.setItem("sapphire-edition", edition)

    // Delay for animation then navigate
    setTimeout(() => {
      router.push(`/${edition}`)
    }, 800)
  }

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050a2a] text-white flex flex-col items-center justify-center font-sans">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050a2a] via-[#0a1b54] to-[#020410]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 animate-pulse" />
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 container max-w-6xl mx-auto px-4 py-8 flex flex-col items-center"
          >
            {/* Header */}
            <motion.div
              className="mb-16 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/images/sapphire-mun-hero-logo.png"
                alt="Sapphire MUN"
                className="h-24 w-auto mx-auto mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              />
              <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white/90">
                Choose Your <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Experience</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto rounded-full" />
            </motion.div>

            {/* Cards Container */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">

              {/* Hyderabad Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 group relative cursor-pointer"
                onClick={() => handleSelect("hyderabad")}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-blue-900/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-[#0a1535]/80 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 group-hover:border-blue-400/50 group-hover:bg-[#0f1e4a]/90 shadow-2xl">

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-400/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <CheckCircle className="w-8 h-8 text-blue-300" />
                  </div>

                  <h2 className="text-3xl font-light mb-2 text-white group-hover:text-blue-200 transition-colors">Hyderabad</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">First Edition • Completed</div>

                  <div className="space-y-3 w-full opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center gap-2 text-sm border-t border-white/5 pt-3">
                      <Calendar className="w-4 h-4 text-blue-400" /> Aug 2025
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-400" /> Kondapur
                    </div>
                  </div>

                  <div className="mt-8 px-6 py-2 rounded-full border border-blue-500/30 text-sm md:text-base font-medium text-blue-200 bg-blue-900/20 group-hover:bg-blue-500 text-white transition-all duration-300">
                    Enter Archive
                  </div>
                </div>
              </motion.div>

              {/* Vizag Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 group relative cursor-pointer"
                onClick={() => handleSelect("vizag")}
              >
                {/* Red/Purple Glow for Vizag */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-purple-900/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-[#0a1535]/80 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 group-hover:border-red-400/50 group-hover:bg-[#1a0f1e]/90 shadow-2xl">

                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-400/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <Sparkles className="w-8 h-8 text-red-300" />
                  </div>

                  <h2 className="text-3xl font-light mb-2 text-white group-hover:text-red-200 transition-colors">Vizag</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-6 animate-pulse">Second Edition • Upcoming</div>

                  <div className="space-y-3 w-full opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center gap-2 text-sm border-t border-white/5 pt-3">
                      <Calendar className="w-4 h-4 text-red-400" /> May 2026
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-400" /> Coastal Battery
                    </div>
                  </div>

                  <div className="mt-8 px-6 py-2 rounded-full border border-red-500/30 text-sm md:text-base font-medium text-red-200 bg-red-900/20 group-hover:bg-red-500 text-white transition-all duration-300">
                    Enter Experience
                  </div>
                </div>
              </motion.div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#020410]"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
