"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Loader2, LogIn, RefreshCw, Users, Clock, ThumbsUp, ThumbsDown, ImageIcon } from "lucide-react"

type Delegate = {
  id: string
  name: string
  email: string
  phone: string
  school: string
  grade_year: string
  attended_muns: string
  experience: string
  committee: string
  country: string
  committee_2: string
  portfolio_2: string
  committee_3: string
  portfolio_3: string
  heard_about: string
  status: string
  rejection_reason: string | null
  screenshot_url: string | null
  created_at: string
}

export default function AdminPanel() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginError, setLoginError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [rejectPromptId, setRejectPromptId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchDelegates = async (pw?: string, statusFilter?: string) => {
    const token = pw || password
    const f = statusFilter ?? filter
    setLoading(true)
    setError("")
    try {
      const statusParam = f === "all" ? "" : `?status=${f}`
      const res = await fetch(`/api/delegates${statusParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.status === 401) {
        setAuthed(false)
        setLoginError("Incorrect password.")
        setLoading(false)
        return false
      }
      if (!res.ok) {
        setError(data.error || "Failed to load delegates.")
        setLoading(false)
        return false
      }
      setDelegates(data.delegates || [])
      return true
    } catch {
      setError("Could not connect to the server.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!password.trim()) { setLoginError("Enter the admin password."); return }
    setLoginError("")
    setLoading(true)
    const ok = await fetchDelegates(password, "pending")
    if (ok) {
      setAuthed(true)
    }
  }

  useEffect(() => {
    if (authed) fetchDelegates()
  }, [filter])

  const handleAction = async (id: string, status: "approved" | "rejected", reason?: string) => {
    setActionLoading(id)
    try {
      const bodyPayload: any = { id, status }
      if (reason) bodyPayload.reason = reason

      const res = await fetch("/api/delegates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(bodyPayload),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Action failed.")
      } else {
        setDelegates((prev) => prev.filter((d) => d.id !== id))
      }
    } catch {
      alert("Network error.")
    } finally {
      setActionLoading(null)
    }
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050a2a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6 text-blue-300" />
            </div>
            <h1 className="text-xl font-light text-white">Admin <span className="font-semibold text-blue-300">Access</span></h1>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{loginError}</div>
          )}

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLoginError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050a2a] text-white">
      {/* Expanded image modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} alt="Payment screenshot" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-light">Sapphire <span className="font-semibold text-blue-300">HQ</span></h1>
        <button onClick={() => fetchDelegates()} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-4 md:px-8 pt-6 pb-4 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
              filter === f ? "bg-blue-500/20 border border-blue-500/40 text-blue-300" : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
            }`}
          >
            {f === "pending" && <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
            {f === "approved" && <ThumbsUp className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
            {f === "rejected" && <ThumbsDown className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
            {f === "all" && <Users className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 pb-12">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
        ) : delegates.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No {filter !== "all" ? filter : ""} delegates found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {delegates.map((d) => (
                <motion.div key={d.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{d.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{d.email}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      d.status === "pending" ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30" :
                      d.status === "approved" ? "bg-green-500/15 text-green-300 border border-green-500/30" :
                      "bg-red-500/15 text-red-300 border border-red-500/30"
                    }`}>{d.status}</span>
                  </div>

                  <div className="space-y-1 text-sm text-white/60">
                    <p><span className="text-white/30">Phone:</span> {d.phone}</p>
                    <p><span className="text-white/30">School:</span> {d.school} <span className="text-xs text-white/40">(Grade: {d.grade_year})</span></p>
                    <p><span className="text-white/30">Attended MUNs:</span> {d.attended_muns}</p>
                    {d.experience && <p><span className="text-white/30">MUN Exp:</span> {d.experience}</p>}
                    <div className="pt-2 bg-white/5 p-2 rounded-lg mt-2 border border-white/5 space-y-1">
                      <p><span className="text-white/30">Pref 1:</span> {d.committee} <span className="text-blue-300">({d.country})</span></p>
                      {d.committee_2 && <p><span className="text-white/30">Pref 2:</span> {d.committee_2} <span className="text-blue-300">({d.portfolio_2})</span></p>}
                      {d.committee_3 && <p><span className="text-white/30">Pref 3:</span> {d.committee_3} <span className="text-blue-300">({d.portfolio_3})</span></p>}
                    </div>
                    {d.heard_about && <p className="pt-2"><span className="text-white/30">Referral:</span> {d.heard_about}</p>}
                  </div>

                  {/* Screenshot */}
                  {d.screenshot_url ? (
                    <div className="pt-1">
                      <p className="text-xs text-white/30 mb-1.5">Payment Screenshot:</p>
                      <img
                        src={d.screenshot_url}
                        alt="Payment proof"
                        onClick={() => setExpandedImage(d.screenshot_url)}
                        className="w-full max-h-40 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-blue-500/40 transition-all"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-400/60 pt-1">
                      <ImageIcon className="w-3.5 h-3.5" /> No screenshot uploaded
                    </div>
                  )}

                  <p className="text-xs text-white/20">{new Date(d.created_at).toLocaleString()}</p>

                  {d.status === "pending" && (
                    <div className="pt-2">
                      {rejectPromptId === d.id ? (
                        <div className="space-y-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                          <p className="text-xs text-red-300 font-medium tracking-wide flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Reason for Rejection *</p>
                          <input
                            type="text"
                            placeholder="e.g. Invalid screenshot, missing UTR"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && rejectReason.trim()) {
                                handleAction(d.id, "rejected", rejectReason.trim())
                              }
                            }}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/50"
                          />
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => { setRejectPromptId(null); setRejectReason("") }} className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-medium hover:bg-white/10 transition-all">Cancel</button>
                            <button onClick={() => { if (rejectReason.trim()) handleAction(d.id, "rejected", rejectReason.trim()) }} disabled={!rejectReason.trim() || actionLoading === d.id} className="flex-1 py-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-medium hover:bg-red-600/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {actionLoading === d.id ? <Loader2 className="w-3 h-3 animate-spin"/> : "Confirm Reject"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(d.id, "approved")} disabled={actionLoading === d.id} className="flex-1 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-medium hover:bg-green-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                            {actionLoading === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                          </button>
                          <button onClick={() => { setRejectPromptId(d.id); setRejectReason("") }} disabled={actionLoading === d.id} className="flex-1 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-medium hover:bg-red-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                            {actionLoading === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {d.status === "rejected" && d.rejection_reason && (
                    <div className="mt-2 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                      <p className="text-[11px] text-red-400/70 font-medium uppercase tracking-wider mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-200/90">{d.rejection_reason}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
