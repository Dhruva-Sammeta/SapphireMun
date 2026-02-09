"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, ChevronRight, Check } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface NavItem {
  href: string
  label: string
}

interface FloatingNavbarProps {
  items?: NavItem[]
}

const DEFAULT_NAV_ITEMS = [
  { href: "#experience", label: "Experience" },
  { href: "#committees", label: "Committees" },
  { href: "https://www.sapphiremun.com/docs", label: "Resources" },
  { href: "https://www.instagram.com/sapphire_mun/", label: "Contact" },
]

export default function FloatingNavbar({ items = DEFAULT_NAV_ITEMS }: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switcherRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = items.map((item) => item.href.replace("#", "")).filter(
        (href) => !href.startsWith("/") && !href.startsWith("https://"),
      )
      let current = ""

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [items])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSwitcherOpen(!isSwitcherOpen)
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    hoverTimerRef.current = setTimeout(() => {
      setIsSwitcherOpen(true)
    }, 2000)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
  }

  const handleEditionSwitch = (href: string) => {
    if (pathname === href) {
      setIsSwitcherOpen(false)
      return
    }
    setIsNavigating(true)
    setIsSwitcherOpen(false)
    setTimeout(() => {
      router.push(href)
    }, 800)
  }

  return (
    <>
      <header
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? "scale-95" : "scale-100"}`}
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl py-3 px-4 shadow-lg">
          <div className="flex items-center gap-6">
            {/* Logo & Switcher Trigger */}
            <div
              className="relative"
              ref={switcherRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 flex-shrink-0 bg-transparent border-none cursor-pointer group"
              >
                <img
                  src="/images/design-mode/download.png"
                  alt="Sapphire MUN"
                  className="h-7 w-6 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300 object-contain"
                />
                <span className="hidden sm:block text-white font-semibold text-lg">Sapphire MUN</span>
              </button>

              {/* Edition Switcher Dropdown */}
              <AnimatePresence>
                {isSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-4 w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                  >
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Layers className="w-3 h-3" /> Select Edition
                      </p>
                    </div>

                    <button
                      onClick={() => handleEditionSwitch("/hyderabad")}
                      className={`flex w-full items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group/item ${pathname === "/hyderabad" ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold">Hyderabad Edition</span>
                        <span className="text-[10px] opacity-60">Completed • Aug 2025</span>
                      </div>
                      {pathname === "/hyderabad" ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                    </button>

                    <button
                      onClick={() => handleEditionSwitch("/vizag")}
                      className={`flex w-full items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group/item ${pathname === "/vizag" ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold">Visakhapatnam Edition</span>
                        <span className="text-[10px] opacity-60">Upcoming • May 2026</span>
                      </div>
                      {pathname === "/vizag" ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center gap-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.href.startsWith("https://") ? "_blank" : undefined}
                    rel={item.href.startsWith("https://") ? "noopener noreferrer" : undefined}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-blue-400 ${activeSection === item.href.replace("#", "") ? "text-blue-400 bg-blue-500/20" : "text-white/80"
                      }`}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault()
                        handleNavClick(item.href)
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Mobile Hamburger */}
            {isMobile && (
              <button
                className="flex flex-col gap-1 p-2 hover:bg-white/10 rounded-full transition-colors justify-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span
                  className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                />
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span
                  className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${isOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
            }`}
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[200px]">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-white/80 hover:text-blue-400 hover:bg-white/10 py-3 px-4 rounded-xl transition-all duration-200 text-center font-medium"
                  onClick={() => {
                    setIsOpen(false)
                    if (item.href.startsWith("#")) {
                      handleNavClick(item.href) // logic handles preventing default if needed, or we rely on Link? actually handleNavClick does scrollIntoView.
                      // But Link with # href might do default jump. 
                      // Ideally we prevent default here too if we want smooth scroll.
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

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
    </>
  )
}
