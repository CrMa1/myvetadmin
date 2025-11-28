import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const planId = searchParams.get("planId")

    if (!userId && !planId) {
      return NextResponse.json({ success: false, error: "ID de usuario o plan requerido" }, { status: 400 })
    }

    let limits, features

    if (userId) {
      // Obtener plan del usuario
      const users = await query("SELECT plan_id FROM users WHERE id = ?", [userId])

      if (users.length === 0) {
        return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
      }

      const userPlanId = users[0].plan_id || 1

      limits = await query("SELECT * FROM plan_limits WHERE plan_id = ?", [userPlanId])
      features = await query("SELECT feature_code, feature_name, is_enabled FROM plan_features WHERE plan_id = ?", [
        userPlanId,
      ])
    } else {
      limits = await query("SELECT * FROM plan_limits WHERE plan_id = ?", [planId])
      features = await query("SELECT feature_code, feature_name, is_enabled FROM plan_features WHERE plan_id = ?", [
        planId,
      ])
    }

    // Obtener contadores actuales del usuario
    let usage = {}
    if (userId) {
      const clinicsCount = await query("SELECT COUNT(*) as count FROM clinics WHERE user_id = ?", [userId])
      const patientsCount = await query("SELECT COUNT(*) as count FROM patients WHERE user_id = ?", [userId])
      const consultationsCount = await query(
        `SELECT COUNT(*) as count FROM consultations 
         WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE())
         AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
        [userId],
      )

      usage = {
        clinics: clinicsCount[0].count,
        patients: patientsCount[0].count,
        consultations: consultationsCount[0].count,
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        limits: limits[0] || null,
        features: features || [],
        usage: usage,
      },
    })
  } catch (error) {
    console.error("[v0] Get plan limits error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener límites del plan" }, { status: 500 })
  }
}
