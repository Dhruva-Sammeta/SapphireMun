import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { createHash } from "crypto"

/**
 * POST /api/verify
 *
 * Hardened payment verification pipeline:
 *  1. Input validation + delegate_id format check
 *  2. File type + size + magic-byte validation
 *  3. Delegate existence + pending status + retry cap
 *  4. Image hash deduplication (SHA-256)
 *  5. Rate limiting (1 submission per 30s per delegate)
 *  6. Screenshot upload to Supabase Storage
 *  7. Status update (pending for manual review)
 */

const MAX_VERIFY_ATTEMPTS = 5
const RATE_LIMIT_MS = 30_000 // 30 seconds between submissions

// In-memory rate limiter (per-instance; good enough for single-server)
const rateLimitMap = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const screenshot = formData.get("screenshot") as File | null
    const delegateId = formData.get("delegate_id") as string | null

    // --- 1. Input validation ---
    if (!screenshot || !delegateId) {
      return NextResponse.json(
        { error: "Screenshot and delegate ID are required." },
        { status: 400 }
      )
    }

    // Validate delegate_id format (SMUN-DEL-XXXX)
    if (!/^SMUN-DEL-\d{4,}$/.test(delegateId)) {
      return NextResponse.json(
        { error: "Invalid delegate ID format." },
        { status: 400 }
      )
    }

    // --- 2. File validation ---
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(screenshot.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are accepted." },
        { status: 400 }
      )
    }

    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB." },
        { status: 400 }
      )
    }

    // Minimum file size check (prevents blank/tiny images)
    if (screenshot.size < 10_000) {
      return NextResponse.json(
        { error: "Screenshot appears too small. Please upload a clear, full payment screenshot." },
        { status: 400 }
      )
    }

    const arrayBuffer = await screenshot.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Magic byte validation
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { error: "Invalid image file." },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // --- 3. Delegate existence + status check ---
    const { data: delegate, error: fetchError } = await supabase
      .from("delegates")
      .select("*")
      .eq("delegate_id", delegateId)
      .single()

    if (fetchError || !delegate) {
      return NextResponse.json(
        { error: "Delegate not found." },
        { status: 404 }
      )
    }

    if (delegate.payment_status === "verified") {
      return NextResponse.json(
        { error: "Payment already verified.", status: "verified" },
        { status: 409 }
      )
    }

    // Check verification attempt count
    const currentAttempts = delegate.verify_attempts || 0
    if (currentAttempts >= MAX_VERIFY_ATTEMPTS) {
      return NextResponse.json(
        {
          error: "Maximum verification attempts exceeded. Please contact support.",
          status: "rejected",
        },
        { status: 429 }
      )
    }

    // --- 4. Rate limiting ---
    const lastAttempt = rateLimitMap.get(delegateId) || 0
    const now = Date.now()
    if (now - lastAttempt < RATE_LIMIT_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastAttempt)) / 1000)
      return NextResponse.json(
        { error: `Please wait ${waitSec} seconds before trying again.` },
        { status: 429 }
      )
    }
    rateLimitMap.set(delegateId, now)

    // --- 5. Image hash deduplication ---
    const imageHash = createHash("sha256").update(buffer).digest("hex")

    const { data: existingHash } = await supabase
      .from("delegates")
      .select("delegate_id")
      .eq("screenshot_hash", imageHash)
      .neq("delegate_id", delegateId)
      .maybeSingle()

    if (existingHash) {
      // Increment attempt counter
      await supabase
        .from("delegates")
        .update({ verify_attempts: currentAttempts + 1 })
        .eq("delegate_id", delegateId)

      return NextResponse.json(
        {
          error: "This exact screenshot has already been submitted by another delegate.",
          status: "rejected",
          reasons: ["Duplicate image detected. Each registration requires a unique payment."],
        },
        { status: 409 }
      )
    }

    // --- 6. Upload screenshot ---
    const extension = screenshot.name.split(".").pop() || "png"
    const fileName = `${delegateId.replace(/-/g, "_")}_payment_${Date.now()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, {
        contentType: screenshot.type,
        upsert: false, // No upsert — each attempt gets a unique filename
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { error: "Failed to upload screenshot." },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName)

    const screenshotUrl = urlData?.publicUrl || ""

    // --- 7. Update delegate record to pending ---
    const { error: updateError } = await supabase
      .from("delegates")
      .update({
        screenshot_url: screenshotUrl,
        screenshot_hash: imageHash,
        payment_status: "pending",
        verify_attempts: currentAttempts + 1,
      })
      .eq("delegate_id", delegateId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update registration." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: "pending",
      delegate_id: delegateId,
      message: "Payment submitted for manual review. You will receive your pass soon.",
    })
  } catch (err) {
    console.error("Verify API error:", err)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}
