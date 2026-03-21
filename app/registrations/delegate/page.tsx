"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Upload, CheckCircle, AlertCircle, Loader2, X, Camera, ShieldCheck, XCircle } from "lucide-react"
import Link from "next/link"
import FloatingNavbar from "@/components/floating-navbar"
import "../../../app/refined.css"

// ---------- Types ----------
interface FormData {
  name: string
  email: string
  phone: string
  institution: string
  committee_pref: string
  country_pref: string
}

interface DelegateRecord {
  delegate_id: string
  id: number
}

// ---------- Validation ----------
function validateStep1(data: FormData): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!data.name.trim()) errs.name = "Name is required"
  if (!data.email.trim()) errs.email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Invalid email format"
  if (!data.phone.trim()) errs.phone = "Phone number is required"
  else if (!/^\+?\d{10,15}$/.test(data.phone.replace(/\s/g, ""))) errs.phone = "Invalid phone number"
  if (!data.institution.trim()) errs.institution = "Institution is required"
  if (!data.committee_pref) errs.committee_pref = "Select a committee preference"
  if (!data.country_pref.trim()) errs.country_pref = "Country preference is required"
  return errs
}

// ---------- Constants ----------
const COMMITTEES = [
  "DISEC - Autonomous Weapons & Algorithmic Warfare",
  "UNHRC - Surveillance Technologies & Digital Authoritarianism",
  "Committee 3 - To Be Announced",
  "Committee 4 - To Be Announced",
  "No Preference",
]

// ---------- Component ----------
export default function DelegateRegistrationPage() {
  const [mounted, setMounted] = React.useState(false)
  const [step, setStep] = useState(1)  // 1: Info + Payment, 2: Upload, 3: Result
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    institution: "",
    committee_pref: "",
    country_pref: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [delegateRecord, setDelegateRecord] = useState<DelegateRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  // Upload state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "uploading" | "pending" | "verified" | "flagged" | "rejected" | "error"
  >("idle")
  const [verificationReasons, setVerificationReasons] = useState<string[]>([])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // -- Step handlers --
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleStep1Submit = async () => {
    const errs = validateStep1(formData)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError("")
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || "Something went wrong.")
        setLoading(false)
        return
      }

      setDelegateRecord(data)
      setStep(2)
    } catch {
      setApiError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP images are accepted.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.")
      return
    }
    setUploadError("")
    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setScreenshotPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      handleFileChange(file || null)
    },
    [handleFileChange]
  )

  const handleUploadSubmit = async () => {
    if (!screenshotFile) { setUploadError("Please upload your payment screenshot."); return }
    if (!delegateRecord) { setUploadError("Session error. Please restart."); return }

    setVerificationStatus("uploading")
    setUploadError("")
    setVerificationReasons([])

    try {
      const fd = new FormData()
      fd.append("screenshot", screenshotFile)
      fd.append("delegate_id", delegateRecord.delegate_id)

      const res = await fetch("/api/verify", {
        method: "POST",
        body: fd,
      })
      const data = await res.json()

      if (data.status === "pending") {
        setVerificationStatus("pending")
        setStep(3)
      } else if (data.status === "rejected") {
        setVerificationStatus("rejected")
        setVerificationReasons(data.reasons || [])
        setStep(3)
      } else if (res.status === 429) {
        // Rate limit or max attempts
        setUploadError(data.error || "Too many attempts. Please wait and try again.")
        setVerificationStatus("error")
      } else if (!res.ok) {
        setUploadError(data.error || "Verification failed.")
        setVerificationStatus("error")
      } else {
        setVerificationStatus("error")
        setUploadError(data.error || "Unknown status.")
      }
    } catch {
      setUploadError("Network error. Please try again.")
      setVerificationStatus("error")
    }
  }

  if (!mounted) return null

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-app text-app overflow-x-hidden">
      <FloatingNavbar
        items={[
          { href: "/registrations", label: "← Back" },
          { href: "#form", label: "Register" },
        ]}
      />

      <section className="relative min-h-screen flex items-center justify-center py-32 px-4">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-hero" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-blue-800/15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/8 blur-[120px] rounded-full opacity-40" />
        </div>

        <div className="w-full max-w-xl mx-auto" id="form">
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                  step >= s
                    ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    : "bg-white/5 border-white/15 text-white/30"
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 rounded transition-all duration-300 ${
                    step > s ? "bg-blue-500" : "bg-white/10"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* --- STEP 1: Information + Payment Preview --- */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="metallic-card p-8 space-y-6"
              >
                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-2xl font-light text-white">Delegate <span className="font-semibold metallic-text">Information</span></h2>
                  <p className="text-sm text-muted">Fill in your details carefully. This information will appear on your delegate pass.</p>
                </div>

                {apiError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {apiError}
                  </div>
                )}

                {/* Fields */}
                {[
                  { key: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "you@school.edu", type: "email" },
                  { key: "phone", label: "Phone Number", placeholder: "+91 9876543210", type: "tel" },
                  { key: "institution", label: "School / Institution", placeholder: "Oakridge International School", type: "text" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof FormData]}
                      onChange={(e) => handleInputChange(field.key as keyof FormData, e.target.value)}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 ${
                        errors[field.key]
                          ? "border-red-500/60 focus:ring-red-500/40"
                          : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                      }`}
                    />
                    {errors[field.key] && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field.key]}</p>}
                  </div>
                ))}

                {/* Committee select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Committee Preference</label>
                  <select
                    value={formData.committee_pref}
                    onChange={(e) => handleInputChange("committee_pref", e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-2 appearance-none ${
                      errors.committee_pref
                        ? "border-red-500/60 focus:ring-red-500/40"
                        : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900">Select a committee...</option>
                    {COMMITTEES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                  {errors.committee_pref && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.committee_pref}</p>}
                </div>

                {/* Country preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Country Preference</label>
                  <input
                    type="text"
                    placeholder="e.g. United States, India, Japan"
                    value={formData.country_pref}
                    onChange={(e) => handleInputChange("country_pref", e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:ring-2 ${
                      errors.country_pref
                        ? "border-red-500/60 focus:ring-red-500/40"
                        : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/40"
                    }`}
                  />
                  {errors.country_pref && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.country_pref}</p>}
                </div>

                {/* Payment preview */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">Registration Fee</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Priority Round Delegate Fee</span>
                    <span className="text-lg font-bold text-blue-300">₹2249</span>
                  </div>
                  <p className="text-xs text-white/40">Payment QR will be shown on the next step after submitting your details.</p>
                </div>

                <button
                  onClick={handleStep1Submit}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue to Payment <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}

            {/* --- STEP 2: Payment + Screenshot Upload (combined) --- */}
            {step === 2 && delegateRecord && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="metallic-card p-8 space-y-6"
              >
                <div className="text-center space-y-2 mb-4">
                  <h2 className="text-2xl font-light text-white">Pay & <span className="font-semibold metallic-text">Upload</span></h2>
                  <p className="text-sm text-muted">Scan the QR code below, make the payment, and upload the screenshot.</p>
                </div>

                {/* Delegate ID badge */}
                <div className="mx-auto w-fit px-5 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-center">
                  <p className="text-xs text-white/50 mb-0.5">Your Delegate ID</p>
                  <p className="text-lg font-bold text-blue-300 tracking-wider">{delegateRecord.delegate_id}</p>
                </div>

                {/* QR Code image */}
                <div className="bg-white rounded-2xl p-6 mx-auto w-fit">
                  <img
                    src="/images/payment-qr.png"
                    alt="Payment QR Code"
                    className="w-48 h-48 object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>

                {/* Info box */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-white/50">Priority Round Delegate Fee</span>
                    <span className="font-semibold text-white whitespace-nowrap">₹2249</span>
                  </div>
                </div>

                {/* Manual verification notice */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-200 mb-1">Secure Manual Verification</p>
                    <p className="text-white/50 text-xs">Our finance team will manually review your payment within 24 hours. Please upload a clear transaction screenshot.</p>
                  </div>
                </div>

                {/* Errors */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {uploadError}
                  </div>
                )}

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    screenshotPreview
                      ? "border-green-500/40 bg-green-500/5"
                      : "border-white/15 bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5"
                  }`}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {screenshotPreview ? (
                    <div className="space-y-3">
                      <img src={screenshotPreview} alt="Payment screenshot" className="max-h-48 mx-auto rounded-xl border border-white/10" />
                      <p className="text-xs text-green-400 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {screenshotFile?.name}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setScreenshotFile(null); setScreenshotPreview(null) }}
                        className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 mx-auto"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                        <Camera className="w-7 h-7 text-white/30" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60 font-medium">Drop your payment screenshot here</p>
                        <p className="text-xs text-white/30 mt-1">or click to browse (JPG, PNG, WebP, max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={verificationStatus === "uploading"}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {verificationStatus === "uploading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading Screenshot...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Submit for Verification</>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  disabled={verificationStatus === "uploading"}
                  className="w-full py-2 text-sm text-white/40 hover:text-white/70 flex items-center justify-center gap-1 transition-colors disabled:opacity-30"
                >
                  <ArrowLeft className="w-3 h-3" /> Go Back
                </button>
              </motion.div>
            )}

            {/* --- STEP 3: Result --- */}
            {step === 3 && delegateRecord && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="metallic-card p-8 text-center space-y-6"
              >
                {verificationStatus === "pending" && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <CheckCircle className="w-10 h-10 text-blue-400" />
                    </div>

                    <h2 className="text-2xl font-light text-white">Under <span className="font-semibold text-blue-300">Review</span></h2>

                    <div className="mx-auto w-fit px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-white/50 mb-1">Delegate ID</p>
                      <p className="text-xl font-bold text-blue-300 tracking-wider">{delegateRecord.delegate_id}</p>
                    </div>

                    <div className="space-y-2 text-sm text-white/60">
                      <p>We have successfully received your payment screenshot.</p>
                      <p>Our team will verify your transaction manually and email your official delegate pass to <span className="font-semibold text-white/80">{formData.email}</span> within 24 hours.</p>
                    </div>
                  </>
                )}

                {verificationStatus === "rejected" && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-light text-white">Upload <span className="font-semibold text-red-400">Failed</span></h2>
                    
                    <div className="space-y-2 text-sm text-white/60">
                      <p>We could not accept your screenshot.</p>
                    </div>
                    
                    {verificationReasons.length > 0 && (
                      <div className="text-left p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2 mt-4 mx-auto max-w-sm">
                        <ul className="space-y-1 text-xs text-red-300/80">
                          {verificationReasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">&#8226;</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4">
                  <Link
                    href="/registrations"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Registrations
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
