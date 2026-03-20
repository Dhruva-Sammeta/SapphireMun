import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { generatePass } from "@/lib/pass-generator"

/**
 * POST /api/generate-pass
 * Triggered after successful payment verification.
 * Generates the PDF pass and sends it via email.
 *
 * Body: { delegate_id: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { delegate_id } = await req.json()
    if (!delegate_id) {
      return NextResponse.json({ error: "delegate_id is required." }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Fetch delegate record
    const { data: delegate, error: fetchError } = await supabase
      .from("delegates")
      .select("*")
      .eq("delegate_id", delegate_id)
      .single()

    if (fetchError || !delegate) {
      return NextResponse.json({ error: "Delegate not found." }, { status: 404 })
    }

    if (delegate.payment_status !== "verified") {
      return NextResponse.json({ error: "Payment not verified." }, { status: 403 })
    }

    if (delegate.pass_url) {
      // Pass already generated — avoid double generation
      return NextResponse.json({ pass_url: delegate.pass_url, already_generated: true })
    }

    // Generate the pass
    const passUrl = await generatePass({
      delegate_id: delegate.delegate_id,
      name: delegate.name,
      institution: delegate.institution,
      committee_pref: delegate.committee_pref,
      country_pref: delegate.country_pref,
    })

    // Update database with pass URL
    await supabase
      .from("delegates")
      .update({ pass_url: passUrl })
      .eq("delegate_id", delegate_id)

    // Send email with pass
    try {
      const resendKey = process.env.RESEND_API_KEY
      const fromEmail = process.env.RESEND_FROM_EMAIL || "registrations@sapphiremun.com"

      if (resendKey) {
        const { Resend } = await import("resend")
        const resend = new Resend(resendKey)

        await resend.emails.send({
          from: `Sapphire MUN <${fromEmail}>`,
          to: delegate.email,
          subject: `Your Delegate Pass — ${delegate.delegate_id}`,
          html: buildEmailHTML(delegate.name, delegate.delegate_id, passUrl),
        })
      } else {
        console.warn("RESEND_API_KEY not set — skipping email send.")
      }
    } catch (emailErr) {
      // Don't fail the whole request if email fails
      console.error("Email send error:", emailErr)
    }

    return NextResponse.json({ pass_url: passUrl, delegate_id })
  } catch (err) {
    console.error("Generate pass error:", err)
    return NextResponse.json({ error: "Failed to generate pass." }, { status: 500 })
  }
}

function buildEmailHTML(name: string, delegateId: string, passUrl: string): string {
  return `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050a2a;color:#e6f0ff;padding:40px 32px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:24px;font-weight:300;margin:0;">Sapphire <span style="font-weight:700;">MUN</span></h1>
        <p style="font-size:12px;color:rgba(15,224,255,0.8);letter-spacing:2px;margin-top:4px;text-transform:uppercase;">Hyderabad 2.0 Edition</p>
      </div>
      
      <p style="font-size:16px;color:#e6f0ff;">Hello ${name},</p>
      <p style="font-size:14px;color:rgba(230,240,255,0.7);line-height:1.7;">
        Your payment has been successfully verified! Your official delegate pass is ready.
      </p>
      
      <div style="text-align:center;margin:32px 0;padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(15,224,255,0.2);border-radius:12px;">
        <p style="font-size:12px;color:rgba(230,240,255,0.4);margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Delegate ID</p>
        <p style="font-size:24px;font-weight:700;color:#0fe0ff;margin:0;letter-spacing:2px;">${delegateId}</p>
      </div>
      
      <div style="text-align:center;margin:24px 0;">
        <a href="${passUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#0fe0ff,#0ab7d1);color:#001223;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Download Your Pass
        </a>
      </div>
      
      <p style="font-size:13px;color:rgba(230,240,255,0.5);line-height:1.6;margin-top:32px;">
        Please save this pass — you'll need to show the QR code at the event entrance for check-in.
      </p>
      
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0;" />
      <p style="font-size:11px;color:rgba(230,240,255,0.25);text-align:center;">
        Sapphire MUN • sapphiremun.com
      </p>
    </div>
  `
}
