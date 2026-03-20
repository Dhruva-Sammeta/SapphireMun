import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"

/**
 * GET /api/check-in/[delegate_id]
 * Scanned at the event entrance. Validates delegate and marks checked_in.
 *
 * Responses:
 *  - valid: first scan, now checked in
 *  - already_checked_in: delegate was already scanned
 *  - invalid: delegate not found or payment not verified
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { delegate_id: string } }
) {
  try {
    const { delegate_id } = params
    const supabase = getServiceSupabase()

    const { data: delegate, error } = await supabase
      .from("delegates")
      .select("delegate_id, name, institution, payment_status, checked_in")
      .eq("delegate_id", delegate_id)
      .single()

    if (error || !delegate) {
      return NextResponse.json({ status: "invalid", message: "Delegate not found." }, { status: 404 })
    }

    if (delegate.payment_status !== "verified") {
      return NextResponse.json(
        { status: "invalid", message: `Payment status: ${delegate.payment_status}. Entry denied.` },
        { status: 403 }
      )
    }

    if (delegate.checked_in) {
      return NextResponse.json({
        status: "already_checked_in",
        delegate_id: delegate.delegate_id,
        name: delegate.name,
        institution: delegate.institution,
        message: "This delegate has already checked in.",
      })
    }

    // Mark as checked in
    await supabase
      .from("delegates")
      .update({ checked_in: true })
      .eq("delegate_id", delegate_id)

    return NextResponse.json({
      status: "valid",
      delegate_id: delegate.delegate_id,
      name: delegate.name,
      institution: delegate.institution,
      message: "Check-in successful. Welcome!",
    })
  } catch (err) {
    console.error("Check-in error:", err)
    return NextResponse.json({ status: "error", message: "Server error." }, { status: 500 })
  }
}
