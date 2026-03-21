import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sapphire2026"

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Authorization
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.split(" ")[1]
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 403 })
    }

    // 2. Fetch pending delegates
    const supabase = getServiceSupabase()
    const { data: delegates, error } = await supabase
      .from("delegates")
      .select("id, delegate_id, name, email, phone, institution, committee_pref, screenshot_url, verify_attempts, created_at")
      .eq("payment_status", "pending")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Fetch delegates error:", error)
      return NextResponse.json({ error: "Failed to fetch delegates" }, { status: 500 })
    }

    return NextResponse.json({ delegates })
  } catch (err) {
    console.error("Delegates API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
