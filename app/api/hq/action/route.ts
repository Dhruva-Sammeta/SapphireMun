import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sapphire2026"

export async function POST(req: NextRequest) {
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

    const { delegate_id, action } = await req.json()

    if (!delegate_id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    if (action === "approve") {
      // 2. Mark as verified in DB
      const { error: updateError } = await supabase
        .from("delegates")
        .update({
          payment_status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("delegate_id", delegate_id)
        .eq("payment_status", "pending")

      if (updateError) {
        console.error("Approve update error:", updateError)
        return NextResponse.json({ error: "Failed to update status in database." }, { status: 500 })
      }

      // 3. Trigger pass generation and email implicitly via the existing route
      // We must await this because serverless functions on Vercel terminate immediately after response
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      
      try {
        await fetch(`${baseUrl}/api/generate-pass`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delegate_id }),
        })
      } catch (err) {
        console.error("Pass generation trigger error:", err)
      }

      return NextResponse.json({ success: true, message: "Delegate approved and pass generation triggered." })
    } 
    
    else if (action === "reject") {
      // 2. Mark as rejected in DB
      const { data: delegate, error: updateError } = await supabase
        .from("delegates")
        .update({
          payment_status: "rejected",
        })
        .eq("delegate_id", delegate_id)
        .select("name, email, delegate_id")
        .single()

      if (updateError || !delegate) {
        console.error("Reject update error:", updateError)
        return NextResponse.json({ error: "Failed to reject delegate." }, { status: 500 })
      }

      // 3. Optionally Send Rejection Email via Resend
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(resendKey)
          const fromEmail = process.env.RESEND_FROM_EMAIL || "registrations@sapphiremun.com"

          await resend.emails.send({
            from: `Sapphire MUN <${fromEmail}>`,
            to: delegate.email,
            subject: `Action Required: Payment Verification Failed — ${delegate.delegate_id}`,
            html: `
              <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050a2a;color:#e6f0ff;padding:40px 32px;border-radius:16px;">
                <h1 style="font-size:24px;color:white;">Hi ${delegate.name},</h1>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;">
                  We were unable to verify the payment screenshot you uploaded for delegate ID <strong>${delegate.delegate_id}</strong>.
                </p>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;">
                  Please reply to this email to coordinate the resolution, or simply try submitting your screenshot again via the registration portal.
                </p>
                <p style="color:rgba(230,240,255,0.5);font-size:12px;margin-top:40px;">Sapphire MUN Registration Team</p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error("Rejection email error:", emailErr)
        }
      }

      return NextResponse.json({ success: true, message: "Delegate rejected." })
    }

  } catch (err) {
    console.error("HQ Action API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
