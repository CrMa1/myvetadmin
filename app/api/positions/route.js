import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const positions = await query("SELECT * FROM positions ORDER BY name")
    return NextResponse.json({ success: true, data: positions })
  } catch (error) {
    console.error("Get positions error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener puestos" }, { status: 500 })
  }
}
