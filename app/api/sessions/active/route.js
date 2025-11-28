import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID de usuario requerido" }, { status: 400 })
    }

    // Obtener sesiones activas (últimos 30 minutos)
    const sessions = await query(
      `SELECT 
        id,
        session_token,
        device_info,
        ip_address,
        last_activity,
        created_at
       FROM user_sessions 
       WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
       ORDER BY last_activity DESC`,
      [userId],
    )

    return NextResponse.json({
      success: true,
      data: {
        sessions: sessions,
        count: sessions.length,
      },
    })
  } catch (error) {
    console.error("[v0] Get active sessions error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener sesiones activas" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "ID de sesión requerido" }, { status: 400 })
    }

    await query("DELETE FROM user_sessions WHERE id = ?", [sessionId])

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    })
  } catch (error) {
    console.error("[v0] Delete session error:", error)
    return NextResponse.json({ success: false, error: "Error al cerrar sesión" }, { status: 500 })
  }
}
