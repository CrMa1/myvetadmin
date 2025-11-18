import { query } from "@/lib/db"

export async function GET(request) {
  try {
    console.log("[v0] Fetching client status")

    const sql = "SELECT * FROM client_status ORDER BY id"
    const statuses = await query(sql)

    console.log("[v0] Client statuses fetched:", statuses.length)

    return Response.json({ success: true, data: statuses })
  } catch (error) {
    console.error("[v0] Error fetching client status:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
