"use client"

import React, { useState, useEffect } from "react"
import { Lock, CheckCircle, XCircle, RefreshCw, LogOut, ChevronRight, Check, X, ShieldAlert, ExternalLink } from "lucide-react"

interface Delegate {
  id: string
  delegate_id: string
  name: string
  email: string
  phone: string
  institution: string
  committee_pref: string
  screenshot_url: string
  verify_attempts: number
  created_at: string
}

export default function SapphireHQ() {
  const [mounted, setMounted] = useState(false)
  const [password, setPassword] = useState("")
  const [token, setToken] = useState<string | null>(null)
  
  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("hq_token")
    if (saved) {
      setToken(saved)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchDelegates()
    }
  }, [token])

  const fetchDelegates = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/hq/delegates", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          handleLogout()
          setError("Session expired or invalid password.")
        } else {
          setError("Failed to fetch delegates.")
        }
        return
      }
      const data = await res.json()
      setDelegates(data.delegates || [])
    } catch {
      setError("Network error fetching delegates.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    localStorage.setItem("hq_token", password)
    setToken(password)
  }

  const handleLogout = () => {
    localStorage.removeItem("hq_token")
    setToken(null)
    setPassword("")
    setDelegates([])
  }

  const handleAction = async (delegateId: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} delegate ${delegateId}?`)) return

    setActionLoading(delegateId)
    try {
      const res = await fetch("/api/hq/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ delegate_id: delegateId, action })
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Error: ${data.error || "Failed to process " + action}`)
        return
      }

      // Remove from list
      setDelegates(prev => prev.filter(d => d.delegate_id !== delegateId))
    } catch {
      alert("Network error processing action.")
    } finally {
      setActionLoading(null)
    }
  }

  if (!mounted) return null

  // --- Login Screen ---
  if (!token) {
    return (
      <div className="min-h-screen bg-[#050a2a] flex items-center justify-center p-4 selection:bg-blue-500/30">
        <div className="w-full max-w-sm metallic-card p-8 text-center space-y-6 rounded-3xl border border-blue-500/20 shadow-[0_0_60px_rgba(15,224,255,0.05)] bg-[#0a123a]">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Sapphire HQ</h1>
            <p className="text-sm text-blue-200/50 mt-1">Admin Control Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Master Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#050a2a]/50 border border-blue-500/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 text-center tracking-widest transition-all"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Access System
            </button>
          </form>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  // --- Dashboard Screen ---
  return (
    <div className="min-h-screen bg-[#050a2a] text-blue-50 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-500/10">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">Sapphire <span className="font-semibold text-blue-400">HQ</span></h1>
            <p className="text-blue-200/50 text-sm mt-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400/70" /> 
              Verification Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDelegates}
              disabled={loading}
              className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all group"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/50 border border-white/5 hover:border-red-500/20 transition-all font-medium text-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </header>

        {/* Content */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && delegates.length === 0 ? (
          <div className="py-24 text-center text-blue-300/50 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500/50" />
            <p>Loading pending delegates...</p>
          </div>
        ) : delegates.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center justify-center border-2 border-dashed border-blue-500/10 rounded-3xl bg-blue-500/[0.02]">
            <CheckCircle className="w-12 h-12 text-green-500/40 mb-4" />
            <h3 className="text-xl font-medium text-white/80">Inbox Zero</h3>
            <p className="text-blue-200/40 mt-2">All payments have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {delegates.map((d) => (
              <div key={d.id} className="relative bg-[#0a123a] border border-blue-500/15 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/10 flex flex-col group transition-all hover:border-blue-500/30">
                
                {/* Upper Half: Metadata */}
                <div className="p-5 border-b border-blue-500/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-mono text-blue-400 mb-1">{d.delegate_id}</p>
                      <h3 className="text-lg font-semibold text-white leading-tight">{d.name}</h3>
                    </div>
                    {d.verify_attempts > 1 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        {d.verify_attempts} Attempts
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-blue-100/60">
                    <p className="flex justify-between"><span className="text-white/40">Institution:</span> <span className="text-right truncate ml-2 max-w-[150px]" title={d.institution}>{d.institution}</span></p>
                    <p className="flex justify-between"><span className="text-white/40">Committee:</span> <span className="text-right truncate ml-2 max-w-[150px]" title={d.committee_pref}>{d.committee_pref}</span></p>
                    <p className="flex justify-between"><span className="text-white/40">Phone:</span> <span className="font-mono">{d.phone}</span></p>
                  </div>
                </div>

                {/* Lower Half: Screenshot & Actions */}
                <div className="p-5 bg-black/20 flex flex-col flex-grow">
                  <div className="flex-grow flex items-center justify-center mb-5 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative group/img min-h-[220px]">
                    {d.screenshot_url ? (
                      <>
                        <img 
                          src={d.screenshot_url} 
                          alt="Payment Screenshot" 
                          className="w-full h-full object-contain max-h-[300px] cursor-zoom-in"
                          onClick={() => window.open(d.screenshot_url, "_blank")}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 pointer-events-none transition-opacity flex items-center justify-center">
                          <p className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                            Click to expand <ExternalLink className="w-3 h-3" />
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-400 text-sm italic">No screenshot found</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      disabled={actionLoading === d.delegate_id}
                      onClick={() => handleAction(d.delegate_id, "reject")}
                      className="py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 font-medium text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === d.delegate_id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4" /> Reject</>}
                    </button>
                    <button
                      disabled={actionLoading === d.delegate_id}
                      onClick={() => handleAction(d.delegate_id, "approve")}
                      className="py-2.5 rounded-xl border border-green-500/50 text-green-300 bg-green-500/10 hover:bg-green-500/20 font-medium text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                      {actionLoading === d.delegate_id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve & Issue</>}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
