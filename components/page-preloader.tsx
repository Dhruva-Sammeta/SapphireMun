"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PagePreloaderProps {
    /** Image URLs to preload before revealing */
    images?: string[]
    /** Minimum display time in ms (avoids flash on fast connections) */
    minDisplayTime?: number
}

/**
 * Full-screen preloader — the SINGLE source of truth for page transitions.
 * Shows the Sapphire crystal logo while assets load, then fades out.
 * Navigation transition overlays in pages/navbar are removed;
 * this component alone handles the "enter" experience.
 */
export default function PagePreloader({ images = [], minDisplayTime = 1200 }: PagePreloaderProps) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const start = Date.now()

        const preloadImages = images.map(
            (src) =>
                new Promise<void>((resolve) => {
                    const img = new Image()
                    img.onload = () => resolve()
                    img.onerror = () => resolve()
                    img.src = src
                })
        )

        const fontsReady = document.fonts?.ready ?? Promise.resolve()

        Promise.all([...preloadImages, fontsReady]).then(() => {
            const elapsed = Date.now() - start
            const remaining = Math.max(0, minDisplayTime - elapsed)
            setTimeout(() => setIsLoading(false), remaining)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="page-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ background: "linear-gradient(180deg, #07113b 0%, #050a2a 50%, #020410 100%)" }}
                >
                    <div className="flex flex-col items-center gap-8">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            src="/images/sapphire-mun-hero-logo.png"
                            alt=""
                            className="h-28 w-28 object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                            style={{ animation: "preloader-breathe 2s ease-in-out infinite" }}
                        />
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-white/50"
                                    style={{
                                        animation: `preloader-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <style>{`
                        @keyframes preloader-dot {
                            0%, 100% { opacity: 0.25; transform: scale(1); }
                            50% { opacity: 1; transform: scale(1.6); }
                        }
                        @keyframes preloader-breathe {
                            0%, 100% { transform: scale(1); opacity: 0.85; }
                            50% { transform: scale(1.06); opacity: 1; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
