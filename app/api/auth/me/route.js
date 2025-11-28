import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = authResult.user.id

    // Get updated user data
    const [user] = await query(
      `SELECT u.id, u.name, u.email, u.plan_id, u.role, u.phone, 
              sp.name as plan_name
       FROM users u
       LEFT JOIN subscription_plans sp ON u.plan_id = sp.id
       WHERE u.id = ?`,
      [userId],
    )

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan_id: user.plan_id,
        plan_name: user.plan_name,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching user data:", error)
    return NextResponse.json({ error: "Error al obtener datos del usuario" }, { status: 500 })
  }
}
