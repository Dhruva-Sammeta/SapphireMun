"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Eye,
  ImageIcon,
  Loader2,
  LogIn,
  RefreshCw,
  Search,
  ThumbsDown,
  ThumbsUp,
  Users,
  XCircle,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

type Delegate = {
  id: string
  name: string
  email: string
  phone?: string | null
  school?: string | null
  institution?: string | null
  grade_year?: string | null
  attended_muns?: string | null
  experience?: string | null
  committee?: string | null
  committee_pref?: string | null
  country?: string | null
  country_pref?: string | null
  country_preference?: string | null
  committee_2?: string | null
  portfolio_2?: string | null
  committee_3?: string | null
  portfolio_3?: string | null
  heard_about?: string | null
  insta_id?: string | null
  status?: string | null
  payment_status?: string | null
  rejection_reason?: string | null
  screenshot_url?: string | null
  payment_ref?: string | null
  pass_url?: string | null
  checked_in?: boolean | null
  delegate_id?: string | null
  created_at: string
}

type CsvColumn = {
  key: keyof Delegate
  label: string
  format?: (row: Delegate) => string
}

const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#84cc16", // lime-500
  "#6366f1", // indigo-500
]

const QUESTION_OPTIONS = [
  { key: "committee", label: "Committee Preference 1" },
  { key: "country", label: "Portfolio Preference 1" },
  { key: "country_preference", label: "Country Preference (Overall)" },
  { key: "committee_2", label: "Committee Preference 2" },
  { key: "portfolio_2", label: "Portfolio Preference 2" },
  { key: "committee_3", label: "Committee Preference 3" },
  { key: "portfolio_3", label: "Portfolio Preference 3" },
  { key: "attended_muns", label: "Attended MUNs" },
  { key: "grade_year", label: "Grade/Year" },
  { key: "school", label: "School/Institution" },
  { key: "heard_about", label: "Referral / Heard About" },
  { key: "status", label: "Status" },
]

const CSV_COLUMNS: CsvColumn[] = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "insta_id", label: "Instagram ID" },
  { key: "school", label: "School", format: (row) => getSchool(row) },
  { key: "grade_year", label: "Grade/Year" },
  { key: "attended_muns", label: "Attended MUNs" },
  { key: "experience", label: "Experience" },
  { key: "country_preference", label: "Country Preference (Overall)" },
  { key: "committee", label: "Committee Preference 1", format: (row) => getCommittee(row) },
  { key: "country", label: "Portfolio Preference 1", format: (row) => getCountry(row) },
  { key: "committee_2", label: "Committee Preference 2" },
  { key: "portfolio_2", label: "Portfolio Preference 2" },
  { key: "committee_3", label: "Committee Preference 3" },
  { key: "portfolio_3", label: "Portfolio Preference 3" },
  { key: "heard_about", label: "Heard About" },
  { key: "status", label: "Status", format: (row) => getStatus(row) },
  { key: "rejection_reason", label: "Rejection Reason" },
  { key: "screenshot_url", label: "Screenshot URL" },
  { key: "created_at", label: "Submitted At", format: (row) => formatDate(row.created_at) },
]

const STATUS_ORDER: Record<string, number> = {
  pending: 1,
  approved: 2,
  rejected: 3,
}

const TABLE_COLUMN_COUNT = 13

function normalizeValue(value: unknown) {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

function formatDate(value: string) {
  if (!value) return ""
  return new Date(value).toLocaleString()
}

function mapPaymentStatus(status?: string | null) {
  const value = normalizeValue(status).toLowerCase()
  if (!value) return ""
  if (value === "verified") return "approved"
  if (value === "failed" || value === "flagged") return "rejected"
  if (value === "pending") return "pending"
  return value
}

function getSchool(row: Delegate) {
  return normalizeValue(row.school) || normalizeValue(row.institution)
}

function getCommittee(row: Delegate) {
  return normalizeValue(row.committee) || normalizeValue(row.committee_pref)
}

function getCountry(row: Delegate) {
  return normalizeValue(row.country) || normalizeValue(row.country_pref)
}

function getStatus(row: Delegate) {
  return (
    normalizeValue(row.status) ||
    mapPaymentStatus(row.payment_status) ||
    "pending"
  )
}

function getAnswer(row: Delegate, key: string) {
  if (key === "committee") return getCommittee(row)
  if (key === "country") return getCountry(row)
  if (key === "school") return getSchool(row)
  if (key === "status") return getStatus(row)
  return normalizeValue((row as Record<string, unknown>)[key])
}

function buildCounts(rows: Delegate[], key: string) {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const value = getAnswer(row, key)
    if (!value) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }

  return Array.from(counts, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function escapeCsv(value: string) {
  if (/["]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  if (/[\n,]/.test(value)) {
    return `"${value}"`
  }
  return value
}

function exportCsv(rows: Delegate[], filename: string) {
  const header = CSV_COLUMNS.map((col) => col.label).join(",")
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((col) => {
      const value = col.format ? col.format(row) : normalizeValue(row[col.key])
      return escapeCsv(value || "")
    }).join(",")
  )
  const csv = [header, ...lines].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone: "blue" | "green" | "yellow" | "red"
}) {
  const toneMap = {
    blue: "bg-blue-900/20 border-blue-500/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    green: "bg-green-900/20 border-green-500/30 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    yellow: "bg-yellow-900/20 border-yellow-500/30 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
    red: "bg-red-900/20 border-red-500/30 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  } as const

  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-md transition-all hover:scale-[1.02] ${toneMap[tone]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">{label}</p>
          <p className="text-3xl font-bold text-white mt-1 drop-shadow-md">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <Icon className="w-6 h-6 opacity-90" />
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white/90 font-medium text-right">{value}</span>
    </div>
  )
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
  const [search, setSearch] = useState("")
  const [committeeFilter, setCommitteeFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "status">("newest")
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null)
  const [questionField, setQuestionField] = useState("committee")

  const fetchDelegates = async (pw?: string) => {
    const token = pw || password
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/delegates", {
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
    if (!password.trim()) {
      setLoginError("Enter the admin password.")
      return
    }
    setLoginError("")
    setLoading(true)
    const ok = await fetchDelegates(password)
    if (ok) {
      setAuthed(true)
    }
  }

  useEffect(() => {
    if (authed) fetchDelegates()
  }, [authed])

  const handleAction = async (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    setActionLoading(id)
    try {
      const bodyPayload: Record<string, unknown> = { id, status }
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
        setDelegates((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status,
                  rejection_reason: status === "rejected" ? reason || d.rejection_reason : null,
                }
              : d
          )
        )
        setSelectedDelegate((prev) =>
          prev?.id === id
            ? {
                ...prev,
                status,
                rejection_reason: status === "rejected" ? reason || prev.rejection_reason : null,
              }
            : prev
        )
        setRejectPromptId(null)
        setRejectReason("")
      }
    } catch {
      alert("Network error.")
    } finally {
      setActionLoading(null)
    }
  }

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 }
    delegates.forEach((d) => {
      const status = getStatus(d)
      if (status === "pending") counts.pending += 1
      if (status === "approved") counts.approved += 1
      if (status === "rejected") counts.rejected += 1
    })
    return counts
  }, [delegates])

  const committeeCounts = useMemo(() => buildCounts(delegates, "committee"), [delegates])
  const committeeOptions = useMemo(
    () => committeeCounts.map((entry) => entry.name),
    [committeeCounts]
  )

  const filteredDelegates = useMemo(() => {
    const query = search.trim().toLowerCase()
    let rows = delegates
      .filter((d) => (filter === "all" ? true : getStatus(d) === filter))
      .filter((d) => (committeeFilter === "all" ? true : getCommittee(d) === committeeFilter))

    if (query) {
      rows = rows.filter((d) => {
        const haystack = [
          d.name,
          d.email,
          d.phone,
          getSchool(d),
          getCommittee(d),
          getCountry(d),
          d.country_preference,
          d.insta_id,
          d.heard_about,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      })
    }

    const sorted = [...rows].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "status") {
        return (STATUS_ORDER[getStatus(a)] || 9) - (STATUS_ORDER[getStatus(b)] || 9)
      }
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return sorted
  }, [delegates, filter, committeeFilter, search, sortBy])

  const questionData = useMemo(() => {
    const counts = buildCounts(delegates, questionField)
    const total = counts.reduce((sum, entry) => sum + entry.value, 0)
    const top = counts.slice(0, 7)
    const rest = counts.slice(7)
    if (rest.length > 0) {
      top.push({
        name: "Other",
        value: rest.reduce((sum, entry) => sum + entry.value, 0),
      })
    }
    return { data: top, total }
  }, [delegates, questionField])

  const selectedStatus = selectedDelegate ? getStatus(selectedDelegate) : "pending"

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050a2a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6 text-blue-300" />
            </div>
            <h1 className="text-xl font-light text-white">
              Admin <span className="font-semibold text-blue-300">Access</span>
            </h1>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {loginError}
            </div>
          )}

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setLoginError("")
            }}
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
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Payment screenshot"
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
          />
        </div>
      )}

      {selectedDelegate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedDelegate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1233] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedDelegate.name}</h2>
                <p className="text-sm text-white/50">{selectedDelegate.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedStatus === "pending" && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
                    Pending
                  </span>
                )}
                {selectedStatus === "approved" && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-500/15 text-green-300 border border-green-500/30">
                    Approved
                  </span>
                )}
                {selectedStatus === "rejected" && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-500/15 text-red-300 border border-red-500/30">
                    Rejected
                  </span>
                )}
                <button
                  className="text-xs text-white/50 hover:text-white"
                  onClick={() => setSelectedDelegate(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Profile</h3>
                <DetailRow label="Phone" value={selectedDelegate.phone} />
                <DetailRow label="Instagram" value={selectedDelegate.insta_id || "-"} />
                <DetailRow label="School" value={getSchool(selectedDelegate)} />
                <DetailRow label="Grade/Year" value={selectedDelegate.grade_year} />
                <DetailRow label="Attended MUNs" value={selectedDelegate.attended_muns} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Preferences</h3>
                <DetailRow label="Country Preference" value={selectedDelegate.country_preference || "-"} />
                <DetailRow label="Committee 1" value={getCommittee(selectedDelegate)} />
                <DetailRow label="Portfolio 1" value={getCountry(selectedDelegate)} />
                <DetailRow label="Committee 2" value={selectedDelegate.committee_2} />
                <DetailRow label="Portfolio 2" value={selectedDelegate.portfolio_2} />
                <DetailRow label="Committee 3" value={selectedDelegate.committee_3} />
                <DetailRow label="Portfolio 3" value={selectedDelegate.portfolio_3} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Other</h3>
                <DetailRow label="Experience" value={selectedDelegate.experience} />
                <DetailRow label="Referral" value={selectedDelegate.heard_about} />
                <DetailRow label="Submitted" value={formatDate(selectedDelegate.created_at)} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Payment</h3>
                {selectedDelegate.screenshot_url ? (
                  <div className="space-y-2">
                    <img
                      src={selectedDelegate.screenshot_url}
                      alt="Payment proof"
                      onClick={() => setExpandedImage(selectedDelegate.screenshot_url)}
                      className="w-full max-h-48 object-cover rounded-lg border border-white/10 cursor-pointer"
                    />
                    <p className="text-xs text-white/40">Click image to expand</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-yellow-300/70">
                    <ImageIcon className="w-4 h-4" /> No screenshot uploaded
                  </div>
                )}
              </div>
            </div>

            {selectedStatus === "rejected" && selectedDelegate.rejection_reason && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-xs uppercase tracking-wider text-red-300 font-semibold mb-1">
                  Rejection Reason
                </p>
                <p className="text-sm text-red-200/90">{selectedDelegate.rejection_reason}</p>
              </div>
            )}

            {selectedStatus === "pending" && (
              <div className="mt-6 space-y-3">
                {rejectPromptId === selectedDelegate.id ? (
                  <div className="space-y-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                    <p className="text-xs text-red-300 font-medium tracking-wide flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Reason for Rejection
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Invalid screenshot"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && rejectReason.trim()) {
                          handleAction(selectedDelegate.id, "rejected", rejectReason.trim())
                        }
                      }}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/50"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setRejectPromptId(null)
                          setRejectReason("")
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-medium hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (rejectReason.trim()) handleAction(selectedDelegate.id, "rejected", rejectReason.trim())
                        }}
                        disabled={!rejectReason.trim() || actionLoading === selectedDelegate.id}
                        className="flex-1 py-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-medium hover:bg-red-600/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === selectedDelegate.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Confirm Reject"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(selectedDelegate.id, "approved")}
                      disabled={actionLoading === selectedDelegate.id}
                      className="flex-1 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-medium hover:bg-green-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {actionLoading === selectedDelegate.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setRejectPromptId(selectedDelegate.id)
                        setRejectReason("")
                      }}
                      disabled={actionLoading === selectedDelegate.id}
                      className="flex-1 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-medium hover:bg-red-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {actionLoading === selectedDelegate.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-light">
          Sapphire <span className="font-semibold text-blue-300">HQ</span>
        </h1>
        <button
          onClick={() => fetchDelegates()}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="px-4 md:px-8 pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total delegates" value={delegates.length} icon={Users} tone="blue" />
          <StatCard label="Pending" value={statusCounts.pending} icon={Clock} tone="yellow" />
          <StatCard label="Approved" value={statusCounts.approved} icon={ThumbsUp} tone="green" />
          <StatCard label="Rejected" value={statusCounts.rejected} icon={ThumbsDown} tone="red" />
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0a1535]/80 to-[#050a2a]/90 backdrop-blur-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2 tracking-wide uppercase">
              <BarChart3 className="w-4 h-4 text-blue-400" /> Delegate count per committee
            </h2>
          </div>
          <div className="h-64 relative z-10">
            <ChartContainer
              config={{ count: { label: "Delegates", color: "#3b82f6" } }}
              className="h-64"
            >
              <BarChart data={committeeCounts} margin={{ top: 10, left: 0, right: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#94a3b8", fontSize: 10 }} 
                  interval={0} 
                  angle={-20} 
                  textAnchor="end" 
                  height={60} 
                  tickFormatter={(val: string) => val.length > 15 ? val.substring(0, 15) + "..." : val}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="Delegates" radius={[6, 6, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="space-y-1.5 text-xs text-white/70 relative z-10 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {committeeCounts.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between bg-white/[0.02] px-2 py-1.5 rounded-lg border border-white/5">
                <span className="truncate pr-2">{entry.name}</span>
                <span className="font-semibold text-blue-300">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-bl from-[#0a1535]/80 to-[#050a2a]/90 backdrop-blur-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <h2 className="text-sm font-semibold text-white/90 tracking-wide uppercase">Question breakdown</h2>
            <select
              value={questionField}
              onChange={(e) => setQuestionField(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80"
            >
              {QUESTION_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ChartContainer
              config={{ value: { label: "Responses", color: "#38bdf8" } }}
              className="h-64"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={questionData.data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {questionData.data.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          <div className="space-y-1.5 text-xs text-white/70 relative z-10 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {questionData.data.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between bg-white/[0.02] px-2 py-1.5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="truncate">{entry.name}</span>
                </div>
                <span className="font-semibold text-white/90 shrink-0">
                  {entry.value} <span className="text-white/40">({questionData.total ? Math.round((entry.value / questionData.total) * 100) : 0}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-12 mt-10">
        <h2 className="text-xl font-semibold text-white mb-6">Delegate Database</h2>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md">
          {/* Top Row: Type Filters + Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex flex-wrap gap-2">
              {(["pending", "approved", "rejected", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize flex items-center shadow-sm hover:scale-[1.02] active:scale-95 ${
                    filter === f
                      ? f === "approved" ? "bg-green-500/20 border border-green-500/40 text-green-300"
                        : f === "rejected" ? "bg-red-500/20 border border-red-500/40 text-red-300"
                        : f === "pending" ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                        : "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                      : "bg-black/20 border border-white/10 text-white/50 hover:text-white/90 hover:bg-white/5"
                  }`}
                >
                  {f === "pending" && <Clock className="w-4 h-4 mr-1.5" />}
                  {f === "approved" && <ThumbsUp className="w-4 h-4 mr-1.5" />}
                  {f === "rejected" && <ThumbsDown className="w-4 h-4 mr-1.5" />}
                  {f === "all" && <Users className="w-4 h-4 mr-1.5" />}
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => exportCsv(filteredDelegates, `sapphire-delegates-${Date.now()}.csv`)}
              className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {/* Bottom Row: Search & Advanced Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 flex-1 min-w-[250px]">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search name, email, committee, school..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
              />
            </div>

            <select
              value={committeeFilter}
              onChange={(e) => setCommitteeFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 outline-none hover:border-white/20 transition-colors"
            >
              <option value="all">All committees</option>
              {committeeOptions.map((committee) => (
                <option key={committee} value={committee}>
                  {committee}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name" | "status")}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 outline-none hover:border-white/20 transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="text-xs text-white/40 px-1 font-medium tracking-wide">
            Showing {filteredDelegates.length} <span className="opacity-50">of</span> {delegates.length} delegates
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : filteredDelegates.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No delegates match the current filters.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#0a1535]/80 to-[#050a2a]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="bg-blue-950/20 border-b border-blue-500/20">
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Name</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Email</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Phone</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">School</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Grade</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Attended</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Committee 1</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Portfolio 1</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Country Pref</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Screenshot</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Status</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide">Submitted</TableHead>
                  <TableHead className="text-blue-200/80 font-semibold tracking-wide text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDelegates.map((d) => {
                  const rowStatus = getStatus(d)
                  return (
                    <React.Fragment key={d.id}>
                      <TableRow className="hover:bg-blue-500/5 transition-colors border-b border-white/5">
                        <TableCell className="font-semibold text-white whitespace-nowrap">{d.name}</TableCell>
                        <TableCell className="text-white/80 font-medium">{d.email}</TableCell>
                        <TableCell className="text-white/70 whitespace-nowrap">{d.phone || "-"}</TableCell>
                        <TableCell className="text-white/70 whitespace-nowrap max-w-[200px] truncate">{getSchool(d) || "-"}</TableCell>
                        <TableCell className="text-white/70 whitespace-nowrap">{d.grade_year || "-"}</TableCell>
                        <TableCell className="text-white/70 whitespace-nowrap">{d.attended_muns || "-"}</TableCell>
                        <TableCell className="text-blue-300 font-medium whitespace-nowrap max-w-[200px] truncate">{getCommittee(d) || "-"}</TableCell>
                        <TableCell className="text-blue-300 font-medium whitespace-nowrap">{getCountry(d) || "-"}</TableCell>
                        <TableCell className="text-white/70 whitespace-nowrap">{d.country_preference || "-"}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {d.screenshot_url ? (
                            <button
                              onClick={() => setExpandedImage(d.screenshot_url)}
                              className="flex items-center gap-1 text-xs text-blue-200 hover:text-blue-100"
                            >
                              <ImageIcon className="w-3.5 h-3.5" /> View
                            </button>
                          ) : (
                            <span className="text-xs text-yellow-300/70">Missing</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                              rowStatus === "pending"
                                ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                                : rowStatus === "approved"
                                ? "bg-green-500/15 text-green-300 border border-green-500/30"
                                : "bg-red-500/15 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {rowStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-white/50">{formatDate(d.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setSelectedDelegate(d)}
                              className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/70 hover:text-white"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            {rowStatus === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAction(d.id, "approved")}
                                  disabled={actionLoading === d.id}
                                  className="flex-1 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-medium hover:bg-green-600/40 transition-all disabled:opacity-50 px-2 py-1"
                                >
                                  {actionLoading === d.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Approve"}
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectPromptId(d.id)
                                    setRejectReason("")
                                  }}
                                  disabled={actionLoading === d.id}
                                  className="flex-1 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-medium hover:bg-red-600/40 transition-all disabled:opacity-50 px-2 py-1"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {rejectPromptId === d.id && (
                        <TableRow className="border-b border-white/5">
                          <TableCell colSpan={TABLE_COLUMN_COUNT} className="bg-red-500/10">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-red-300 font-medium flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" /> Reason for rejection
                              </span>
                              <input
                                type="text"
                                placeholder="e.g. Invalid screenshot"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && rejectReason.trim()) {
                                    handleAction(d.id, "rejected", rejectReason.trim())
                                  }
                                }}
                                className="flex-1 min-w-[240px] bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50"
                              />
                              <button
                                onClick={() => {
                                  if (rejectReason.trim()) handleAction(d.id, "rejected", rejectReason.trim())
                                }}
                                disabled={!rejectReason.trim() || actionLoading === d.id}
                                className="rounded-lg bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-medium hover:bg-red-600/50 transition-all disabled:opacity-50 px-3 py-2"
                              >
                                {actionLoading === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm Reject"}
                              </button>
                              <button
                                onClick={() => {
                                  setRejectPromptId(null)
                                  setRejectReason("")
                                }}
                                className="rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-medium hover:bg-white/10 transition-all px-3 py-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}