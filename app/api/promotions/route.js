import { NextResponse } from "next/server"
import { query } from "@/lib/db-landing"

export async function GET() {
  try {
    console.log("[v0] Fetching active promotions from database")

    const promotions = await query(
      `SELECT * FROM promotions 
       WHERE is_active = TRUE 
       AND (start_date IS NULL OR start_date <= NOW())
       AND (end_date IS NULL OR end_date >= NOW())
       ORDER BY display_order ASC, created_at DESC`,
      [],
    )

    console.log("[v0] Promotions found:", promotions.length)

    return NextResponse.json({ promotions })
  } catch (error) {
    console.error("[v0] Error fetching promotions:", error)
    return NextResponse.json({ error: "Error al cargar promociones", promotions: [] }, { status: 500 })
  }
}
