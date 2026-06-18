"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Shield, 
  Lock,
  Crosshair,
  Heart,
  Gavel,
  Film,
  Newspaper,
  Anchor,
  HelpCircle,
  Activity,
  History
} from "lucide-react"
import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"
import "../refined.css" // Sapphire premium styles

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
}

export default function ResourcesPage() {
  // General documents
  const generalDocs = [
    {
      title: "Conference Schedule",
      description: "Complete timetable and event locations for all three days.",
      status: "Releasing Soon",
      icon: Calendar,
      link: "#",
      badgeColor: "bg-slate-800/50 border-slate-700 text-slate-400",
      locked: true,
    },
    {
      title: "Code of Conduct",
      description: "Rules of procedure, dress code, and diplomatic guidelines.",
      status: "Available",
      icon: Shield,
      link: "/docs/code-of-conduct.pdf",
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
      locked: false,
    },
    {
      title: "Liability Form",
      description: "Mandatory waiver to be signed by delegates and guardians.",
      status: "Releasing Soon",
      icon: FileText,
      link: "#",
      badgeColor: "bg-slate-800/50 border-slate-700 text-slate-400",
      locked: true,
    },
  ]

  // Committee guides (agendas & background guides)
  const committeeDocs = [
    {
      title: "DISEC",
      fullName: "Disarmament and International Security Committee",
      icon: Crosshair,
      agenda: "Deliberating upon the prevention of the usage of unethical small arms and LAWS in Regional and International conflicts with special emphasis Convention on Certain Conventional Weapons (CCW)",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "UNHRC",
      fullName: "United Nations Human Rights Council",
      icon: Heart,
      agenda: "Protection and promotion of human rights while countering terrorism in the central sahel region.",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "LOK SABHA",
      fullName: "The House of the People",
      icon: Gavel,
      agenda: "Deliberation on the structural framework of the Uniform Civil Code (UCC) with special emphasis on federal autonomy and minority rights",
      bgGuide: "Available Now",
      locked: false,
      link: "/images/committees/Lok Sabha/LOKSABHA - BG - SAPPHIREMUN.pdf",
    },
    {
      title: "IFI",
      fullName: "Indian Film Industry",
      icon: Film,
      agenda: "Deliberation on Political Bias in Film Certification, Communal Bias, Workplace Harassment, and Structural Safety Reforms in the Indian Film Industry",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "IP",
      fullName: "International Press",
      icon: Newspaper,
      agenda: "Journalistic coverage of all committees (covering reports, photography, and press conferences).",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "ONE PIECE",
      fullName: "The Grand Line Fleet (Special Committee)",
      icon: Anchor,
      agenda: "Disbandment of the white beard pirates. Freeze date: Arrival of the Red haired pirates",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "WHO",
      fullName: "World Health Organisation",
      icon: Activity,
      agenda: "Reducing public health risks associated with the sale of live wild animals of mammalian species in traditional food markets – infection prevention and control.",
      bgGuide: "Releasing soon",
      locked: true,
      link: null,
    },
    {
      title: "HCC",
      fullName: "Historical Crisis Committee",
      icon: History,
      agenda: "Freeze date May 14th 1948",
      bgGuide: "Available Now",
      locked: false,
      link: "/images/committees/HCC/HCC BG SAPPHIRE.pdf",
    },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Liquid Ambient Glowing Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[0%] w-[50vw] h-[50vw] max-w-[800px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] right-[0%] w-[45vw] h-[45vw] max-w-[700px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[0%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" 
        />
        
        {/* Fine grid mask */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 90%)",
        }} />
      </div>

      <FloatingNavbar
        items={[
          { href: "/hyderabad", label: "Home" },
          { href: "/registrations", label: "Registrations" },
          { href: "/resources", label: "Resources" },
          { href: "/hyderabad#committees", label: "Committees" },
          { href: "/hyderabad#contact", label: "Contact" },
        ]}
      />

      <div className="relative z-10">
        {/* Header spacing */}
        <div className="pt-32 pb-8">
          <div className="container px-4">
            <Link href="/hyderabad" className="inline-flex items-center text-slate-400 hover:text-cyan-300 transition-colors text-sm font-medium group bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-cyan-500/30 backdrop-blur-md">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Hyderabad Page
            </Link>
          </div>
        </div>

        <div className="container px-4 pb-24 relative">
          <div className="max-w-6xl mx-auto space-y-24">
            
            {/* Header Title */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="text-center space-y-6"
            >
              <motion.div 
                variants={headerVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Document Hub
              </motion.div>
              <motion.h1 
                variants={headerVariants}
                className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-lg"
              >
                Conference <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Resources</span>
              </motion.h1>
              <motion.p 
                variants={headerVariants}
                className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                Prepare for Sapphire MUN 2.0. Access essential waivers, committee background files, and conference agendas.
              </motion.p>
            </motion.div>

            {/* SECTION 1: General Conference Forms */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-4 border-b border-cyan-500/10 pb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">General Information & Waivers</h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {generalDocs.map((doc, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="metallic-card group flex flex-col justify-between h-full rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] hover:border-cyan-500/40"
                    >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent rounded-3xl pointer-events-none" />
                    <div className="space-y-5 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <doc.icon className="h-7 w-7" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${doc.badgeColor} shadow-sm`}>
                          {doc.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-8 mt-auto relative z-10">
                      {doc.locked ? (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl bg-slate-800/30 border border-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          Background guides to be announced
                        </button>
                      ) : (
                        <>
                          <Link
                            href={doc.link}
                            target="_blank"
                            className="flex-1 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Link>
                          <Link
                            href={doc.link}
                            target="_blank"
                            className="py-3 px-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-slate-300 font-bold text-xs transition-all flex items-center justify-center"
                            title="View Online"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 2: Committee-Specific Documents */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-cyan-500/10 pb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-teal-400 to-cyan-600 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Committee Background Guides</h2>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Updates Rolling Out
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {committeeDocs.map((com, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="metallic-card group flex flex-col justify-between rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_-10px_rgba(6,182,212,0.25)] hover:border-cyan-500/30"
                  >
                    {/* Subtle top-right decorative glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/15 blur-2xl transition-colors duration-500 pointer-events-none" />
                    
                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-colors duration-300">
                          <com.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-xl tracking-wide group-hover:text-cyan-300 transition-colors">{com.title}</h3>
                          <p className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-widest">{com.fullName.split(" (")[0]}</p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700 to-transparent" />

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Agenda</span>
                          <p className="text-sm text-slate-300 leading-relaxed min-h-[60px] line-clamp-3 font-medium">
                            {com.agenda}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                          <span className="text-slate-500 font-semibold">Status:</span>
                          <span className={`px-2 py-1 rounded-full border text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 ${com.locked ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'}`}>
                            {!com.locked && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />}
                            {com.locked ? <Lock className="w-3 h-3" /> : null}
                            {com.bgGuide}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 relative z-10 mt-auto">
                      {com.locked ? (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl bg-slate-800/30 border border-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          Background guides to be announced
                        </button>
                      ) : (
                        <a
                          href={com.link || "#"}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
                        >
                          <Download className="w-4 h-4" />
                          Download Guide
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Need help footer tip */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-[2rem] border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-cyan-900/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <HelpCircle className="h-7 w-7 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Need support or have questions?</h3>
                  <p className="text-sm text-slate-400 font-medium">Reach out to our delegate support team if you experience any download issues.</p>
                </div>
              </div>
              <Link 
                href="/hyderabad#contact"
                className="py-3 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black text-sm transition-all shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 relative z-10"
              >
                Contact Support
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Footer Transition Gradient */}
        <div className="h-40 bg-gradient-to-b from-transparent to-[rgba(10,27,84,0.85)] w-full -mb-24 relative z-0 pointer-events-none" />
        <Footer />
      </div>
    </div>
  )
}
