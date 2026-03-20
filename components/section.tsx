"use client"

import { type HTMLAttributes } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

type Props = HTMLAttributes<HTMLElement> & {
  id?: string
}

export default function Section({ className, children, id, ...props }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start("show")
  }, [inView, controls])

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  )
}
