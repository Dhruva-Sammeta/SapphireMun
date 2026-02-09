"use client"

import React, { useEffect, useRef } from "react"

export default function InteractiveSapphire() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window
            const x = (clientX / innerWidth - 0.5) * 2 // -1 to 1
            const y = (clientY / innerHeight - 0.5) * 2

            ref.current.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateZ(20px)`
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="relative w-64 h-64 mx-auto my-12 flex items-center justify-center perspective-[1000px]">
            <div
                ref={ref}
                className="relative w-40 h-40 transition-transform duration-100 ease-out preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Core Gem Shape - Abstract Representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-900/80 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-blue-400/30 transform rotate-45 z-10 transition-all duration-500 hover:shadow-[0_0_80px_rgba(59,130,246,0.8)]">
                    <div className="absolute inset-2 border border-blue-300/20 rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
                </div>

                {/* Floating Ring 1 */}
                <div className="absolute inset-[-20px] border border-blue-500/30 rounded-full animate-[spin_8s_linear_infinite]"
                    style={{ transform: "rotateX(60deg)" }} />

                {/* Floating Ring 2 */}
                <div className="absolute inset-[-40px] border border-red-500/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"
                    style={{ transform: "rotateY(60deg)" }} />

                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-3xl -z-10" />
            </div>
        </div>
    )
}
