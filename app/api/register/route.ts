import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      name, email, school, committee, country, experience,
      phone, grade_year, attended_muns, 
      committee_2, portfolio_2, committee_3, portfolio_3, heard_about 
    } = body

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !school?.trim() || !committee?.trim() || !country?.trim()) {
      return NextResponse.json({ error: "Name, email, phone, school, primary committee, and primary portfolio are required." }, { status: 400 })
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
        phone: phone.trim(),
        school: school.trim(),
        grade_year: (grade_year || "").trim(),
        attended_muns: (attended_muns || "").trim(),
        experience: (experience || "").trim(),
        committee: committee.trim(),
        country: country.trim(),
        committee_2: (committee_2 || "").trim(),
        portfolio_2: (portfolio_2 || "").trim(),
        committee_3: (committee_3 || "").trim(),
        portfolio_3: (portfolio_3 || "").trim(),
        heard_about: (heard_about || "").trim(),
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
