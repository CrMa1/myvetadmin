import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function POST(request) {
  try {
    console.log("[v0] Fetching available plans: ", request)
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = authResult.user.id

    // Get user's current plan
    const [userPlan] = await query(
      `SELECT u.plan_id, sp.price_monthly, sp.display_order 
       FROM users u 
       LEFT JOIN subscription_plans sp ON u.plan_id = sp.id 
       WHERE u.id = ?`,
      [userId],
    )

    if (!userPlan || !userPlan.plan_id) {
      return NextResponse.json({ error: "Plan actual no encontrado" }, { status: 404 })
    }

    // Get available plans (higher than current plan)
    const availablePlans = await query(
      `SELECT * FROM subscription_plans 
       WHERE is_active = 1 
       AND (display_order > ? OR (display_order = ? AND price_monthly > ?))
       ORDER BY display_order ASC, price_monthly ASC`,
      [userPlan.display_order, userPlan.display_order, userPlan.price_monthly],
    )

    // Parse JSON features
    const parsedPlans = availablePlans.map((plan) => ({
      ...plan,
      features: typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features,
    }))

    return NextResponse.json({
      plans: parsedPlans,
      currentPlanId: userPlan.plan_id,
    })
  } catch (error) {
    console.error("[v0] Error fetching available plans:", error)
    return NextResponse.json({ error: "Error al cargar planes disponibles" }, { status: 500 })
  }
}
