"use client"

import { useEffect, useRef } from "react"

const diplomacyTerms = [
  "Peace",
  "Security",
  "Human Rights",
  "Cooperation",
  "Sovereignty",
  "Dignity",
  "Justice",
  "Equality",
  "Freedom",
  "Solidarity",
  "Tolerance",
  "Development",
  "Prosperity",
  "Harmony",
  "Unity",
  "Dialogue",
  "Consensus",
  "Resolution",
  "Diplomacy",
  "Negotiation",
]

export default function RollingText() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Shuffle and duplicate terms for continuous flow
    const shuffled = [...diplomacyTerms].sort(() => Math.random() - 0.5)
    const terms = [...shuffled, ...shuffled, ...shuffled]

    container.innerHTML = terms.map((term) => `<span class="rolling-text-item">${term}</span>`).join("")
  }, [])

  return (
    <div className="rolling-text-wrapper">
      <div ref={containerRef} className="rolling-text-container" />
    </div>
  )
}
