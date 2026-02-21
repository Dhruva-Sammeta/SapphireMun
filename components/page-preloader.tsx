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
 * Full-screen preloader that waits for:
 * 1. Critical images to load
 * 2. Document fonts to be ready
 * 3. A minimum display time (prevents flash)
 * Then smoothly fades out to reveal page content.
 */
export default function PagePreloader({ images = [], minDisplayTime = 600 }: PagePreloaderProps) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const start = Date.now()

        const preloadImages = images.map(
            (src) =>
                new Promise<void>((resolve) => {
                    const img = new Image()
                    img.onload = () => resolve()
                    img.onerror = () => resolve() // Don't block on errors
                    img.src = src
                })
        )

        const fontsReady = document.fonts?.ready ?? Promise.resolve()

        Promise.all([...preloadImages, fontsReady]).then(() => {
            const elapsed = Date.now() - start
            const remaining = Math.max(0, minDisplayTime - elapsed)
            setTimeout(() => setIsLoading(false), remaining)
        })
    }, [images, minDisplayTime])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="page-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ background: "linear-gradient(180deg, #07113b 0%, #050a2a 50%, #020410 100%)" }}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center gap-6"
                    >
                        <img
                            src="/images/sapphire-mun-hero-logo.png"
                            alt=""
                            className="h-24 w-24 object-contain animate-pulse drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        />
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-white/40"
                                    style={{
                                        animation: `preloader-dot 1s ease-in-out ${i * 0.15}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <style>{`
            @keyframes preloader-dot {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.5); }
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
