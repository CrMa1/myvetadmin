import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const sessionToken = body.sessionToken || request.headers.get("x-session-token")
    const userId = body.userId

    if (!sessionToken && !userId) {
      return NextResponse.json({ success: false, error: "Token de sesión o ID de usuario requerido" }, { status: 400 })
    }

    if (sessionToken) {
      // Primero obtener el user_id antes de eliminar
      const sessions = await query("SELECT user_id FROM user_sessions WHERE session_token = ?", [sessionToken])

      if (sessions.length > 0) {
        const userIdFromSession = sessions[0].user_id

        // Eliminar la sesión
        await query("DELETE FROM user_sessions WHERE session_token = ?", [sessionToken])

        const remainingSessions = await query(
          `SELECT COUNT(*) as count FROM user_sessions 
           WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 30 MINUTE)`,
          [userIdFromSession],
        )

        if (remainingSessions[0].count === 0) {
          await query("UPDATE users SET session_active = 0 WHERE id = ?", [userIdFromSession])
        }
      }
    } else if (userId) {
      await query("DELETE FROM user_sessions WHERE user_id = ?", [userId])
      await query("UPDATE users SET session_active = 0 WHERE id = ?", [userId])
    }

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ success: false, error: "Error al cerrar sesión" }, { status: 500 })
  }
}
