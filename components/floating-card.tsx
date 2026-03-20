"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
}

export default function FloatingCard({ children, className }: FloatingCardProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div
      className={`rounded-lg border shadow-sm ${className} ${isMobile ? "touch-card" : ""}`}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {children}
    </div>
  )
}
