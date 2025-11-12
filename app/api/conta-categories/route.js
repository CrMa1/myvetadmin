import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let sql = "SELECT * FROM conta_categories"
    const params = []

    if (type) {
      sql += " WHERE type = ?"
      params.push(type)
    }

    sql += " ORDER BY name"

    const categories = await query(sql, params)
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Get conta categories error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener categorías" }, { status: 500 })
  }
}
