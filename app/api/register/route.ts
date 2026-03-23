import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string || ""
    const email = formData.get("email") as string || ""
    const phone = formData.get("phone") as string || ""
    const school = formData.get("school") as string || ""
    const committee = formData.get("committee") as string || ""
    const country = formData.get("country") as string || ""
    const experience = formData.get("experience") as string || ""
    const grade_year = formData.get("grade_year") as string || ""
    const attended_muns = formData.get("attended_muns") as string || ""
    const committee_2 = formData.get("committee_2") as string || ""
    const portfolio_2 = formData.get("portfolio_2") as string || ""
    const committee_3 = formData.get("committee_3") as string || ""
    const portfolio_3 = formData.get("portfolio_3") as string || ""
    const heard_about = formData.get("heard_about") as string || ""
    const screenshot = formData.get("screenshot") as File | null

    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !school.trim() || !committee.trim() || !country.trim()) {
      return NextResponse.json({ error: "Name, email, phone, school, primary committee, and primary portfolio are required." }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    if (!screenshot) {
      return NextResponse.json({ error: "A payment screenshot is absolutely mandatory." }, { status: 400 })
    }

    // Check for existing registration
    const { data: existing } = await supabase
      .from("delegates")
      .select("id, status")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      if (existing.status === "approved") {
        return NextResponse.json({ error: "This email is already registered and approved." }, { status: 409 })
      }
      return NextResponse.json({ error: "This email already has a pending registration." }, { status: 409 })
    }

    // File validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(screenshot.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are accepted." }, { status: 400 })
    }
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB." }, { status: 400 })
    }

    // Upload to Supabase Storage
    const ext = screenshot.name.split(".").pop() || "png"
    const uniqueSuffix = Date.now() + "_" + Math.random().toString(36).substring(2, 9)
    const fileName = `${uniqueSuffix}.${ext}`

    const arrayBuffer = await screenshot.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadErr } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, { contentType: screenshot.type, upsert: false })

    if (uploadErr) {
      console.error("Upload error:", uploadErr)
      return NextResponse.json({ error: "Failed to upload screenshot. Please try again." }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName)

    const screenshotUrl = urlData?.publicUrl || ""

    // Insert to database
    const { data, error } = await supabase
      .from("delegates")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        school: school.trim(),
        grade_year: grade_year.trim(),
        attended_muns: attended_muns.trim(),
        experience: experience.trim(),
        committee: committee.trim(),
        country: country.trim(),
        committee_2: committee_2.trim(),
        portfolio_2: portfolio_2.trim(),
        committee_3: committee_3.trim(),
        portfolio_3: portfolio_3.trim(),
        heard_about: heard_about.trim(),
        screenshot_url: screenshotUrl,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: "Register failed: " + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, delegate: data })
  } catch (err) {
    console.error("Register API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
