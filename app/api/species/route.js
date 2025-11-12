import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const species = await query("SELECT * FROM species ORDER BY name")
    return NextResponse.json({ success: true, data: species })
  } catch (error) {
    console.error("Get species error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener especies" }, { status: 500 })
  }
}
