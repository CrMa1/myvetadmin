import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const categories = await query("SELECT * FROM item_categories ORDER BY name")
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Get item categories error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener categorías" }, { status: 500 })
  }
}
