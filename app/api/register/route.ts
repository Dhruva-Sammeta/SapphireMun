import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, school, committee, country, experience } = body

    // Validation
    if (!name?.trim() || !email?.trim() || !school?.trim() || !committee?.trim() || !country?.trim()) {
      return NextResponse.json({ error: "Name, email, school, committee, and country are required." }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
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

    // Insert
    const { data, error } = await supabase
      .from("delegates")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        school: school.trim(),
        committee: committee.trim(),
        country: country.trim(),
        experience: (experience || "").trim(),
        status: "pending",
      })
      .select("id, name, email")
      .single()

    if (error) {
      console.error("Registration insert error:", error)
      if (error.code === "23505") {
        return NextResponse.json({ error: "This email is already registered." }, { status: 409 })
      }
      return NextResponse.json({ error: "Failed to submit registration. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true, delegate: data }, { status: 201 })
  } catch (err) {
    console.error("Register API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
