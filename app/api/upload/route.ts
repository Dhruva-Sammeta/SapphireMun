import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const screenshot = formData.get("screenshot") as File | null
    const delegateId = formData.get("delegate_id") as string | null

    if (!screenshot || !delegateId) {
      return NextResponse.json({ error: "Screenshot and delegate ID are required." }, { status: 400 })
    }

    // File validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(screenshot.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are accepted." }, { status: 400 })
    }
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB." }, { status: 400 })
    }
    if (screenshot.size < 10_000) {
      return NextResponse.json({ error: "Image is too small. Please upload a clear screenshot." }, { status: 400 })
    }

    const arrayBuffer = await screenshot.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify delegate exists and is pending
    const { data: delegate, error: fetchErr } = await supabase
      .from("delegates")
      .select("id, status")
      .eq("id", delegateId)
      .single()

    if (fetchErr || !delegate) {
      return NextResponse.json({ error: "Delegate not found." }, { status: 404 })
    }
    if (delegate.status === "approved") {
      return NextResponse.json({ error: "Already approved." }, { status: 409 })
    }

    // Upload to Supabase Storage
    const ext = screenshot.name.split(".").pop() || "png"
    const fileName = `${delegateId}_${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, { contentType: screenshot.type, upsert: false })

    if (uploadErr) {
      console.error("Upload error:", uploadErr)
      return NextResponse.json({ error: "Failed to upload screenshot." }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName)

    const screenshotUrl = urlData?.publicUrl || ""

    // Update delegate with screenshot URL
    const { error: updateErr } = await supabase
      .from("delegates")
      .update({ screenshot_url: screenshotUrl })
      .eq("id", delegateId)

    if (updateErr) {
      console.error("Update error:", updateErr)
      return NextResponse.json({ error: "Failed to save screenshot." }, { status: 500 })
    }

    return NextResponse.json({ success: true, screenshot_url: screenshotUrl })
  } catch (err) {
    console.error("Upload API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
