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
 *  7. Gemini Vision 5-layer verification with anti-spoof prompt
 *  8. Extracted UTR uniqueness check (database)
 *  9. Status update + pass generation trigger
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

    // --- 7. Gemini Vision Verification ---
    let paymentStatus: "verified" | "flagged" | "rejected" = "verified"
    let flagReasons: string[] = []
    let extractedUtr = ""
    let detectedAmount = ""

    try {
      const geminiApiKey = process.env.GEMINI_API_KEY
      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not configured")
      }

      const expectedFee = process.env.REGISTRATION_FEE_INR || "1"
      const expectedUpi = (process.env.UPI_ID || "").toUpperCase()
      const expectedName = (
        process.env.RECEIVER_NAME ||
        process.env.BANK_ACCOUNT_NAME ||
        ""
      ).toUpperCase()
      const base64Image = buffer.toString("base64")

      const prompt = `You are a strict payment fraud detection system. Analyze this UPI payment screenshot with ZERO tolerance for manipulation.

EXPECTED PAYMENT DETAILS:
- Exact Amount: ₹${expectedFee} (must match exactly — not more, not less)
${expectedUpi ? `- Receiver UPI ID should contain: ${expectedUpi}` : ""}
${expectedName ? `- Receiver Name should contain: ${expectedName}` : ""}

PERFORM ALL 5 VERIFICATION CHECKS:

CHECK 1 — UTR EXTRACTION:
Extract the EXACT 12-digit UTR / Transaction Reference Number / UPI Reference from the image.
Common labels: "UTR", "Ref No", "Transaction ID", "Reference Number", "UPI Ref No", "Transaction Reference".
The UTR is ALWAYS exactly 12 numeric digits. If you find multiple numbers, pick the one labelled as a transaction reference.
If you cannot find a clear 12-digit UTR, set utr_extracted to null.

CHECK 2 — AMOUNT VERIFICATION:
Find the payment amount. It MUST be exactly ₹${expectedFee}.
Look for the primary amount displayed (usually large text at the top, or next to "Amount", "Paid", "Debited").
Any discrepancy = FAIL.

CHECK 3 — RECEIVER VERIFICATION:
${expectedUpi || expectedName ? `Verify that the receiver/payee information matches expected values.
The receiver name should contain "${expectedName}" or UPI ID should contain "${expectedUpi}".
Partial matches are acceptable (e.g. names may be abbreviated).` : "Skip this check if no expected values are provided."}

CHECK 4 — AUTHENTICITY & FORGERY DETECTION:
Examine the image VERY carefully for signs of:
- Text that looks digitally overlaid or edited (font inconsistencies, kerning issues)
- Elements that don't align with genuine UPI app interfaces (Google Pay, PhonePe, Paytm, BHIM, etc.)
- Screenshot generators or mock payment apps (these often have subtle UI differences)
- Pixelation or blurring around text or numbers that suggests editing
- Missing standard elements (payment app logo, timestamp, status indicator, bank name)
- Suspiciously clean or template-like appearance
- Any text that says "pending", "failed", "processing", "requested" = FAIL

CHECK 5 — TRANSACTION COMPLETENESS:
- Must show a COMPLETED/SUCCESSFUL payment (green checkmark, "Success", "Paid", "Completed")
- Must have a visible timestamp/date
- Must be from a recognized UPI payment app interface

CRITICAL ANTI-SPOOF RULES:
- If ANY element looks edited, set verified=false immediately
- If the image is just a text message, note, or non-UPI screenshot = FAIL
- If it shows a payment REQUEST rather than a completed PAYMENT = FAIL
- If amount shown anywhere does NOT match ₹${expectedFee} = FAIL
- If no clear 12-digit UTR can be found = set utr_extracted to null and verified to false

Return ONLY valid JSON (no markdown, no backticks, no explanation) with this structure:
{
  "verified": boolean,
  "utr_extracted": string | null,
  "amount_detected": string | null,
  "receiver_detected": string | null,
  "confidence": number,
  "is_completed_payment": boolean,
  "app_detected": string | null,
  "forgery_indicators": string[],
  "reasons": string[]
}

SCORING:
- confidence must be between 0.0 and 1.0
- verified=true ONLY if confidence >= 0.80 AND all checks pass
- Include ALL issues found in "reasons" array (empty if fully verified)
- "forgery_indicators" = specific manipulation signs found (empty if none)`

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: screenshot.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.05, // Near-zero for maximum consistency
              responseMimeType: "application/json",
            },
          }),
        }
      )

      if (!geminiRes.ok) {
        throw new Error(`Gemini API error: ${await geminiRes.text()}`)
      }

      const geminiData = await geminiRes.json()
      let aiResponseText =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiResponseText) {
        throw new Error("Empty response from AI")
      }

      // Strip markdown formatting if present
      aiResponseText = aiResponseText
        .replace(/^\s*```json/i, "")
        .replace(/```\s*$/, "")
        .trim()

      const aiResult = JSON.parse(aiResponseText)

      // Extract fields
      extractedUtr = aiResult.utr_extracted || ""
      detectedAmount = aiResult.amount_detected || ""

      // --- Decision logic ---

      // Hard reject: forgery indicators found
      if (aiResult.forgery_indicators && aiResult.forgery_indicators.length > 0) {
        paymentStatus = "rejected"
        flagReasons = [
          "Possible manipulation detected in the screenshot.",
          ...aiResult.forgery_indicators,
        ]
      }
      // Hard reject: not a completed payment
      else if (aiResult.is_completed_payment === false) {
        paymentStatus = "rejected"
        flagReasons = aiResult.reasons || ["Screenshot does not show a completed payment"]
      }
      // Hard reject: very low confidence
      else if (aiResult.confidence !== undefined && aiResult.confidence < 0.4) {
        paymentStatus = "rejected"
        flagReasons = aiResult.reasons || ["Very low verification confidence"]
      }
      // AI says not verified
      else if (aiResult.verified !== true) {
        // Medium confidence → flag for manual review
        if (aiResult.confidence !== undefined && aiResult.confidence >= 0.4) {
          paymentStatus = "flagged"
        } else {
          paymentStatus = "rejected"
        }
        flagReasons = aiResult.reasons || ["AI flagged for manual review"]
      }
      // AI says verified but low confidence → flag
      else if (aiResult.confidence !== undefined && aiResult.confidence < 0.80) {
        paymentStatus = "flagged"
        flagReasons = ["Verification confidence below threshold", ...(aiResult.reasons || [])]
      }

      // No UTR extracted → always flag at minimum
      if (!extractedUtr || !/^\d{12}$/.test(extractedUtr)) {
        if (paymentStatus === "verified") {
          paymentStatus = "flagged"
          flagReasons.push("Could not extract a valid 12-digit UTR from the screenshot")
        }
      }
    } catch (aiError) {
      console.error("AI verification error:", aiError)
      paymentStatus = "flagged"
      flagReasons.push("Automated verification system error - manual review required")
    }

    // --- 8. UTR Uniqueness Check ---
    if (extractedUtr && /^\d{12}$/.test(extractedUtr)) {
      const { data: existingUtr } = await supabase
        .from("delegates")
        .select("delegate_id")
        .eq("payment_ref", extractedUtr)
        .neq("delegate_id", delegateId)
        .maybeSingle()

      if (existingUtr) {
        // Increment attempts
        await supabase
          .from("delegates")
          .update({ verify_attempts: currentAttempts + 1 })
          .eq("delegate_id", delegateId)

        return NextResponse.json(
          {
            error: "This transaction has already been used for another registration.",
            status: "rejected",
            reasons: ["Duplicate UTR detected. This payment has already been claimed by another delegate."],
          },
          { status: 409 }
        )
      }
    }

    // --- 9. Update delegate record ---
    const updatePayload: Record<string, unknown> = {
      screenshot_url: screenshotUrl,
      screenshot_hash: imageHash,
      payment_status: paymentStatus,
      verify_attempts: currentAttempts + 1,
      verified_at: paymentStatus === "verified" ? new Date().toISOString() : null,
    }

    if (extractedUtr && /^\d{12}$/.test(extractedUtr)) {
      updatePayload.payment_ref = extractedUtr
    }
    if (detectedAmount) {
      updatePayload.amount_detected = detectedAmount
    }
    if (flagReasons.length > 0) {
      updatePayload.flag_reasons = JSON.stringify(flagReasons)
    }

    const { error: updateError } = await supabase
      .from("delegates")
      .update(updatePayload)
      .eq("delegate_id", delegateId)

    if (updateError) {
      console.error("Update error:", updateError)
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "This transaction ID has already been claimed.", status: "rejected" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "Failed to update registration." },
        { status: 500 }
      )
    }

    // If verified, trigger pass generation
    if (paymentStatus === "verified") {
      fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/generate-pass`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delegate_id: delegateId }),
        }
      ).catch((err) => console.error("Pass generation trigger error:", err))
    }

    return NextResponse.json({
      status: paymentStatus,
      delegate_id: delegateId,
      ...(extractedUtr && { utr_extracted: extractedUtr }),
      ...(paymentStatus === "flagged" && {
        message: "Payment submitted for manual review. You will receive your pass within 24 hours.",
        reasons: flagReasons,
      }),
      ...(paymentStatus === "rejected" && {
        message: "Payment verification failed.",
        reasons: flagReasons,
      }),
    })
  } catch (err) {
    console.error("Verify API error:", err)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}
