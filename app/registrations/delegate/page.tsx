"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2, Upload, Image as ImageIcon } from "lucide-react"
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
  const [step, setStep] = useState(1) // 1: Info, 2: Pay + Upload, 3: Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [delegateId, setDelegateId] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    committee: "",
    country: "",
    experience: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Step 2 state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState("")
  const [uploadError, setUploadError] = useState("")

  // File handling — declared before early return to satisfy React hooks rules
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) { setUploadError("Only JPG, PNG, and WebP images are accepted."); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError("File size must be under 5MB."); return }
    setUploadError("")
    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setScreenshotPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files?.[0] || null)
  }, [handleFileSelect])

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

  // Step 1 → submit registration
  const handleStep1Submit = async () => {
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
      setDelegateId(data.delegate.id)
      setStep(2)
    } catch {
      setError("Could not connect to the server. Check your internet and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2 → upload screenshot
  const handleStep2Submit = async () => {
    if (!screenshotFile) { setUploadError("Please upload your payment screenshot."); return }
    if (!delegateId) { setUploadError("Session error. Please restart."); return }

    setLoading(true)
    setUploadError("")

    try {
      const fd = new FormData()
      fd.append("screenshot", screenshotFile)
      fd.append("delegate_id", delegateId)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || "Upload failed. Please try again.")
        setLoading(false)
        return
      }
      setStep(3)
    } catch {
      setUploadError("Could not connect to the server. Check your internet and try again.")
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ["Details", "Payment", "Done"]

  return (
    <div className="min-h-screen bg-app text-app overflow-x-hidden">
      <FloatingNavbar
        items={[
          { href: "/hyderabad", label: "Home" },
          { href: "/registrations", label: "Back" },
          { href: "https://www.instagram.com/sapphire_mun/", label: "Contact" },
        ]}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-blue-800/15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1000px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_60%)] opacity-60 animate-pulse pointer-events-none" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 container max-w-4xl mx-auto px-4 text-center space-y-4">
          <img src="/images/sapphire-mun-hero-logo.png" alt="Sapphire MUN" className="h-16 w-auto mx-auto mb-2 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white/90">Delegate <span className="font-semibold metallic-text">Registration</span></h1>
          <p className="text-sm text-muted max-w-lg mx-auto">Sapphire MUN Hyderabad 2.0 • May 1–3, 2026</p>
        </motion.div>
      </section>

      {/* Step indicator */}
      <div className="container max-w-xl mx-auto px-4 pb-10 mt-4">
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-0 bg-[#0a1535]/40 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-4 sm:px-8 py-3.5 transition-all duration-500">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? "bg-green-500/30 border border-green-500/50 text-green-300" :
                  step === i + 1 ? "bg-blue-500/30 border border-blue-500/50 text-blue-300" :
                  "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step === i + 1 ? "text-blue-300" : "text-white/30"}`}>{label}</span>
              </div>
              {i < 2 && <div className={`w-10 h-0.5 mx-3 rounded-full ${step > i + 1 ? "bg-green-500/40" : "bg-white/10"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="pb-20 relative">
        <div className="container max-w-xl mx-auto px-4">
          <AnimatePresence mode="wait">

            {/* ───── STEP 1: Details ───── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="metallic-card p-6 md:p-8 space-y-5">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                {[
                  { key: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "you@school.edu", type: "email" },
                  { key: "school", label: "School / Institution", placeholder: "Oakridge International School", type: "text" },
                  { key: "country", label: "Country/Role Preference", placeholder: "e.g. United States, India, or specific Role", type: "text" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 ${
                        fieldErrors[field.key] ? "border-red-500/60 focus:ring-red-500/40" : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                      }`}
                    />
                    {fieldErrors[field.key] && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors[field.key]}</p>}
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Committee Preference</label>
                  <select value={formData.committee} onChange={(e) => handleChange("committee", e.target.value)} className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-2 appearance-none ${fieldErrors.committee ? "border-red-500/60 focus:ring-red-500/40" : "border-white/10 focus:ring-blue-500/30"}`}>
                    <option value="" disabled className="bg-slate-900">Select a committee...</option>
                    {COMMITTEES.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                  </select>
                  {fieldErrors.committee && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.committee}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">MUN Experience <span className="text-white/30">(optional)</span></label>
                  <textarea placeholder="Your MUN experience, or 'First timer'" value={formData.experience} onChange={(e) => handleChange("experience", e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 resize-none" />
                </div>

                <button onClick={handleStep1Submit} disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue to Payment <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}

            {/* ───── STEP 2: Payment + Upload ───── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="metallic-card p-6 md:p-8 space-y-6">
                {/* Fee info */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">Priority Round Delegate Fee</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Amount</span>
                    <span className="text-2xl font-bold text-blue-300">₹2249</span>
                  </div>
                </div>

                {/* QR */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-white/60">Scan the QR code to pay:</p>
                  <div className="inline-block rounded-2xl border border-white/10 bg-white p-3">
                    <img src="/images/payment-qr.png" alt="Payment QR Code" className="w-52 h-52 object-contain" />
                  </div>
                </div>

                {/* Upload area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Upload Payment Screenshot</label>

                  {uploadError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {uploadError}
                    </div>
                  )}

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input")?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      screenshotPreview ? "border-green-500/40 bg-green-500/5" : "border-white/15 bg-white/[0.02] hover:border-blue-500/40 hover:bg-blue-500/5"
                    }`}
                  >
                    {screenshotPreview ? (
                      <div className="space-y-3">
                        <img src={screenshotPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        <p className="text-xs text-green-300 flex items-center justify-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Screenshot attached — click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-white/25 mx-auto" />
                        <p className="text-sm text-white/40">Drag & drop or click to upload</p>
                        <p className="text-xs text-white/25">JPG, PNG, WebP • Max 5MB</p>
                      </div>
                    )}
                    <input id="file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} className="hidden" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleStep2Submit} disabled={loading || !screenshotFile} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ───── STEP 3: Success ───── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="metallic-card p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-light text-white">Registration <span className="font-semibold text-green-400">Submitted</span></h2>
                <p className="text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
                  Your registration and payment screenshot are now under review. You will receive a confirmation email once approved — usually within 24 hours.
                </p>
                <button onClick={() => window.location.href = "/registrations"} className="px-6 py-2.5 rounded-full border border-blue-500/30 text-sm font-semibold text-blue-200 bg-blue-900/20 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto">
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
