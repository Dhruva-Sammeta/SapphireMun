"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import FloatingNavbar from "@/components/floating-navbar"
import "../../refined.css"

const COMMITTEES = [
  "DISEC - Autonomous Weapons & Algorithmic Warfare",
  "UNHRC - Surveillance Technologies & Digital Authoritarianism",
  "LOK SABHA - The House of the People",
  "IFI - Indian Film Industry",
  "IP - International Press",
  "No Preference",
]

export default function DelegateRegistrationPage() {
  const [mounted, setMounted] = React.useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    committee: "",
    country: "",
    experience: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  React.useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = "Full name is required"
    if (!formData.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email"
    if (!formData.school.trim()) errs.school = "School / institution is required"
    if (!formData.committee) errs.committee = "Select a committee"
    if (!formData.country.trim()) errs.country = "Country preference is required"
    return errs
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
    if (error) setError("")
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.")
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError("Could not connect to the server. Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app text-app overflow-x-hidden">
      <FloatingNavbar
        items={[
          { href: "/hyderabad", label: "Home" },
          { href: "/registrations", label: "Back" },
          { href: "https://www.instagram.com/sapphire_mun/", label: "Contact" },
        ]}
      />

      <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-blue-800/15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 container max-w-4xl mx-auto px-4 text-center space-y-4"
        >
          <img
            src="/images/sapphire-mun-hero-logo.png"
            alt="Sapphire MUN"
            className="h-16 w-auto mx-auto mb-2 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          />
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white/90">
            Delegate <span className="font-semibold metallic-text">Registration</span>
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto">
            Sapphire MUN Hyderabad 2.0 • May 1–3, 2026
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto rounded-full" />
        </motion.div>
      </section>

      <section className="pb-20 relative">
        <div className="container max-w-xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="metallic-card p-6 md:p-8 space-y-5"
              >
                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                {/* Fields */}
                {[
                  { key: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "you@school.edu", type: "email" },
                  { key: "school", label: "School / Institution", placeholder: "Oakridge International School", type: "text" },
                  { key: "country", label: "Country Preference", placeholder: "e.g. United States, India", type: "text" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 ${
                        fieldErrors[field.key]
                          ? "border-red-500/60 focus:ring-red-500/40"
                          : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                      }`}
                    />
                    {fieldErrors[field.key] && (
                      <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors[field.key]}</p>
                    )}
                  </div>
                ))}

                {/* Committee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Committee Preference</label>
                  <select
                    value={formData.committee}
                    onChange={(e) => handleChange("committee", e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-2 appearance-none ${
                      fieldErrors.committee
                        ? "border-red-500/60 focus:ring-red-500/40"
                        : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900">Select a committee...</option>
                    {COMMITTEES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                  {fieldErrors.committee && (
                    <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.committee}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">MUN Experience <span className="text-white/30">(optional)</span></label>
                  <textarea
                    placeholder="Brief description of your MUN experience, or write 'First timer'"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 resize-none"
                  />
                </div>

                {/* Fee notice */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">Priority Round Delegate Fee</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Amount</span>
                    <span className="text-lg font-bold text-blue-300">₹2249</span>
                  </div>
                  <p className="text-xs text-white/40">Payment details will be shared after registration approval.</p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Registration <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="metallic-card p-8 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-light text-white">
                  Registration <span className="font-semibold text-green-400">Submitted</span>
                </h2>
                <p className="text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your application is now under review. You will receive a confirmation email once approved. This usually takes less than 24 hours.
                </p>
                <button
                  onClick={() => window.location.href = "/registrations"}
                  className="px-6 py-2.5 rounded-full border border-blue-500/30 text-sm font-semibold text-blue-200 bg-blue-900/20 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Registrations
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
