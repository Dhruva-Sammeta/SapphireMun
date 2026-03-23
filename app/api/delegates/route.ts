import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Sapphire#2026"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function verifyAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return false
  return auth.split(" ")[1] === ADMIN_PASSWORD
}

// GET /api/delegates — fetch all delegates, optionally filter by status
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const status = req.nextUrl.searchParams.get("status")
    const supabase = getSupabase()

    let query = supabase
      .from("delegates")
      .select("*")
      .order("created_at", { ascending: false })

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Fetch delegates error:", error)
      return NextResponse.json({ error: "Failed to fetch delegates." }, { status: 500 })
    }

    return NextResponse.json({ delegates: data || [] })
  } catch (err) {
    console.error("Delegates GET error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}

// PATCH /api/delegates — update status (approve/reject) + send email on approve
export async function PATCH(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status, reason } = await req.json()

    if (!id || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Valid id and status (approved/rejected) required." }, { status: 400 })
    }

    const supabase = getSupabase()

    const updatePayload: any = { status }
    if (status === "rejected" && reason) {
      updatePayload.rejection_reason = reason
    }

    const { data: delegate, error: updateError } = await supabase
      .from("delegates")
      .update(updatePayload)
      .eq("id", id)
      .select("name, email, committee, country")
      .single()

    if (updateError || !delegate) {
      console.error("Update delegate error:", updateError)
      return NextResponse.json({ error: "Failed to update delegate status." }, { status: 500 })
    }

    // Send email on approval
    if (status === "approved") {
      const resendKey = process.env.RESEND_API_KEY
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sapphiremun.com"

      if (resendKey) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(resendKey)

          await resend.emails.send({
            from: `Sapphire MUN <${fromEmail}>`,
            to: delegate.email,
            subject: "You're in! Welcome to Sapphire MUN 🎉",
            html: `
              <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050a2a;color:#e6f0ff;padding:40px 32px;border-radius:16px;">
                <img src="https://sapphiremun.com/images/sapphire-mun-hero-logo.png" alt="Sapphire MUN" style="height:48px;margin-bottom:24px;" />
                <h1 style="font-size:22px;color:white;margin:0 0 16px;">Hi ${delegate.name},</h1>
                <p style="color:rgba(230,240,255,0.8);line-height:1.7;margin:0 0 16px;">
                  Great news - your registration for <strong style="color:#0fe0ff;">Sapphire MUN Hyderabad 2.0</strong> has been <strong style="color:#22c55e;">approved</strong>!
                </p>
                <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;margin:20px 0;">
                  <p style="margin:4px 0;color:rgba(230,240,255,0.7);font-size:14px;"><strong>Committee:</strong> ${delegate.committee}</p>
                  <p style="margin:4px 0;color:rgba(230,240,255,0.7);font-size:14px;"><strong>Country/Role Preference:</strong> ${delegate.country}</p>
                </div>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;margin:12px 0;font-size:13px;font-style:italic;opacity:0.8;">
                  Note: Your preference for country/role will be accommodated if possible, but not guaranteed.
                </p>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;margin:0 0 8px;">
                  Your official delegate pass will be shared closer to the event. Stay tuned!
                </p>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;margin:0 0 8px;">
                  If you have any questions, you can contact us on Instagram <a href="https://instagram.com/sapphire_mun/" style="color:#0fe0ff;text-decoration:none;">@sapphire_mun</a> or email us at <a href="mailto:sapphire.mun1@gmail.com" style="color:#0fe0ff;text-decoration:none;">sapphire.mun1@gmail.com</a>.
                </p>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0;" />
                <p style="font-size:11px;color:rgba(230,240,255,0.25);text-align:center;margin:0;">
                  Sapphire MUN • sapphiremun.com
                </p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error("Approval email failed:", emailErr)
          // Don't fail the action — DB update already succeeded
        }
      }
    }

    // Send rejection email
    if (status === "rejected") {
      const resendKey = process.env.RESEND_API_KEY
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sapphiremun.com"

      if (resendKey) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(resendKey)

          await resend.emails.send({
            from: `Sapphire MUN <${fromEmail}>`,
            to: delegate.email,
            subject: "Registration Update - Sapphire MUN",
            html: `
              <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050a2a;color:#e6f0ff;padding:40px 32px;border-radius:16px;">
                <h1 style="font-size:22px;color:white;margin:0 0 16px;">Hi ${delegate.name},</h1>
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;margin:0 0 16px;">
                  Unfortunately, your registration could not be approved at this time.
                </p>
                ${reason ? `
                <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:16px;margin:20px 0;">
                  <p style="margin:0 0 8px;color:rgba(252,165,165,0.9);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Reason for Rejection</p>
                  <p style="margin:0;color:white;font-size:14px;line-height:1.6;">${reason}</p>
                </div>
                ` : ""}
                <p style="color:rgba(230,240,255,0.7);line-height:1.7;">
                  If you believe this is an error, please reply to this email, contact us on Instagram <a href="https://instagram.com/sapphire_mun/" style="color:#0fe0ff;text-decoration:none;">@sapphire_mun</a>, or email us at <a href="mailto:sapphire.mun1@gmail.com" style="color:#0fe0ff;text-decoration:none;">sapphire.mun1@gmail.com</a>.
                </p>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0;" />
                <p style="font-size:11px;color:rgba(230,240,255,0.25);text-align:center;margin:0;">
                  Sapphire MUN • sapphiremun.com
                </p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error("Rejection email failed:", emailErr)
        }
      }
    }

    return NextResponse.json({ success: true, message: `Delegate ${status}.` })
  } catch (err) {
    console.error("Delegates PATCH error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
