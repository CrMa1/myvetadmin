import { NextResponse } from "next/server"
import { query } from "@/lib/db-landing"

export async function GET() {
  try {
    console.log("[v0] Fetching testimonials from database")

    const testimonials = await query(
      `SELECT * FROM testimonials 
       WHERE is_active = TRUE 
       ORDER BY is_featured DESC, display_order ASC, created_at DESC`,
      [],
    )

    console.log("[v0] Testimonials found:", testimonials.length)

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("[v0] Error fetching testimonials:", error)
    return NextResponse.json({ error: "Error al cargar testimonios", testimonials: [] }, { status: 500 })
  }
}
