"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"

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
  const isMobile = useMobile()

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

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <header
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? "scale-95" : "scale-100"}`}
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl py-3 px-4 shadow-lg">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 flex-shrink-0 bg-transparent border-none cursor-pointer group"
            >
              <img
                src="/images/design-mode/download.png"
                alt="Sapphire MUN"
                className="h-7 w-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 object-contain"
              />
              <span className="hidden sm:block text-white font-semibold text-lg">Sapphire MUN</span>
            </button>

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
    </>
  )
}
