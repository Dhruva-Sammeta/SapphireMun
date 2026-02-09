"use client"

import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Props = HTMLAttributes<HTMLDivElement> & {
  accent?: "blue" | "green" | "yellow" | "red"
}

export default function GlowCard({ className, children, accent, ...props }: Props) {
  const accentClass =
    accent === "green"
      ? "shadow-[0_0_30px_rgba(39,201,63,0.25)] ring-success/20"
      : accent === "yellow"
      ? "shadow-[0_0_30px_rgba(229,197,88,0.25)] ring-warning/20"
      : accent === "red"
      ? "shadow-[0_0_30px_rgba(185,28,28,0.25)] ring-red-600/20"
      : "shadow-[0_0_34px_rgba(0,110,135,0.35)] ring-accent/20"

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all",
        "hover:translate-y-[-2px] hover:bg-white/[0.05] hover:shadow-xl",
        "ring-1",
        accentClass,
        className
      )}
      {...props}
    >
      <div className="absolute -inset-16 bg-accent-glow opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  )
}
