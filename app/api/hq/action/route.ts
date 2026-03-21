import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Sapphire#2026"

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
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sapphiremun.com"
    const resendKey = process.env.RESEND_API_KEY

    if (action === "approve") {
      // Update DB
      const { data: delegate, error: updateError } = await supabase
        .from("delegates")
        .update({
          payment_status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("delegate_id", delegate_id)
        .eq("payment_status", "pending")
        .select("name, email, delegate_id, committee_pref")
        .single()

      if (updateError || !delegate) {
        console.error("Approve update error:", updateError)
        return NextResponse.json({ error: "Failed to update status in database." }, { status: 500 })
      }

      // Send approval email
      if (resendKey) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(resendKey)

          await resend.emails.send({
            from: `Sapphire MUN <${fromEmail}>`,
            to: delegate.email,
            subject: `Payment Verified — Welcome to Sapphire MUN! 🎉`,
            html: `
              <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050a2a;color:#e6f0ff;padding:40px 32px;border-radius:16px;">
                <h1 style="font-size:24px;color:white;">Hi ${delegate.name},</h1>
                <p style="color:rgba(230,240,255,0.8);line-height:1.7;">
                  Great news! Your payment has been <strong style="color:#0fe0ff;">verified</strong> and your registration for Sapphire MUN Hyderabad 2.0 is confirmed.
                </p>
                <p style="color:rgba(230,240,255,0.8);line-height:1.7;">
                  <strong>Delegate ID:</strong> ${delegate.delegate_id}<br/>
                  <strong>Committee Preference:</strong> ${delegate.committee_pref}
                </p>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;">
                  Your official delegate pass will be sent to you closer to the event. Keep an eye on this email.
                </p>
                <p style="color:rgba(230,240,255,0.5);font-size:12px;margin-top:40px;">Sapphire MUN Registration Team</p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error("Approval email error:", emailErr)
          // Don't fail the action if email fails — DB update succeeded
        }
      }

      return NextResponse.json({ success: true, message: "Delegate approved and notified." })
    }

    else if (action === "reject") {
      const { data: delegate, error: updateError } = await supabase
        .from("delegates")
        .update({ payment_status: "rejected" })
        .eq("delegate_id", delegate_id)
        .select("name, email, delegate_id")
        .single()

      if (updateError || !delegate) {
        console.error("Reject update error:", updateError)
        return NextResponse.json({ error: "Failed to reject delegate." }, { status: 500 })
      }

      // Send rejection email
      if (resendKey) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(resendKey)

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
                  Please reply to this email or re-submit your payment screenshot via the registration portal.
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
