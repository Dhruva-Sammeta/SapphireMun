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
export default function PagePreloader({ images = [], minDisplayTime = 1800 }: PagePreloaderProps) {
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
            setTimeout(() => {
                setIsLoading(false)
            }, remaining)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="page-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020410]"
                >
                    <div className="flex flex-col items-center gap-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
                            transition={{
                                opacity: { duration: 0.8 },
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="relative"
                        >
                            <img
                                src="/images/sapphire-mun-hero-logo.png"
                                alt=""
                                className="h-32 w-32 object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                            />
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10 animate-pulse" />
                        </motion.div>

                        <div className="flex gap-2.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-blue-400"
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        scale: [1, 1.5, 1]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
