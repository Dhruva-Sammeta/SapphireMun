"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, ChevronRight, Check } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

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
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switcherRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        // No longer needed for full screen dialog
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
    setIsSwitcherOpen(true)
  }

  const handleEditionSwitch = (href: string) => {
    if (pathname === href) {
      setIsSwitcherOpen(false)
      return
    }
    setIsSwitcherOpen(false)
    router.push(href)
  }

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-300 ${isMobile ? "top-3 left-4 right-4" : "top-6 left-1/2 -translate-x-1/2"} ${isScrolled ? "scale-[0.97]" : "scale-100"}`}
      >
        <div className="bg-[#0a1535]/40 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-cyan-500/10 py-3 px-4 transition-all duration-500 hover:bg-[#0a1535]/50 hover:border-white/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4 sm:gap-6">
            {/* Logo & Switcher Trigger */}
            <div
              className="relative"
              ref={switcherRef}
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

              <Dialog open={isSwitcherOpen} onOpenChange={setIsSwitcherOpen}>
                <DialogContent showCloseButton={true} className="sm:max-w-md bg-[#0a1535]/95 backdrop-blur-2xl border border-blue-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(37,99,235,0.15)] text-white">
                  <DialogTitle className="text-2xl font-light text-center mb-6">
                    Choose <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Edition</span>
                  </DialogTitle>
                  
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => handleEditionSwitch("/hyderabad")}
                      className={`relative overflow-hidden group flex flex-col items-start p-4 rounded-xl border transition-all duration-300 ${pathname === "/hyderabad" ? "border-blue-400/50 bg-blue-500/10" : "border-white/10 bg-white/5 hover:border-blue-400/30 hover:bg-white/10"}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-lg font-medium group-hover:text-blue-300 transition-colors">Hyderabad</span>
                        {pathname === "/hyderabad" && <Check className="w-5 h-5 text-blue-400" />}
                      </div>
                      <span className="text-xs font-semibold tracking-wider text-red-400/80 uppercase">New Dates • Upcoming</span>
                    </button>

                    <button
                      onClick={() => handleEditionSwitch("/vizag")}
                      className={`relative overflow-hidden group flex flex-col items-start p-4 rounded-xl border transition-all duration-300 ${pathname === "/vizag" ? "border-red-400/50 bg-red-500/10" : "border-white/10 bg-white/5 hover:border-red-400/30 hover:bg-white/10"}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-lg font-medium group-hover:text-red-300 transition-colors">Visakhapatnam</span>
                        {pathname === "/vizag" && <Check className="w-5 h-5 text-red-400" />}
                      </div>
                      <span className="text-xs font-semibold tracking-wider text-red-400/80 uppercase">First Edition • Upcoming</span>
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
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
                className="relative w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-0" : "-translate-y-[5px]"
                    }`}
                />
                <span className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0 scale-0" : ""}`} />
                <span
                  className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 translate-y-0" : "translate-y-[5px]"
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
          className={`fixed top-16 left-4 right-4 z-40 transition-all duration-300 ${isOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
            }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-white/80 hover:text-blue-400 hover:bg-white/10 py-3 px-4 rounded-xl transition-all duration-200 text-center font-medium"
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault()
                    }
                    setIsOpen(false)
                    if (item.href.startsWith("#")) {
                      handleNavClick(item.href)
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
    </>
  )
}
