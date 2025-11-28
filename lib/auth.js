import { query } from "./db"

/**
 * Verifies authentication from request
 * For now, it extracts userId from query params or body
 * In production, this should verify JWT tokens from headers/cookies
 */
export async function verifyAuth(request) {
  try {
    // Try to get userId from searchParams (GET requests)
    const { searchParams } = new URL(request.url)
    let userId = searchParams.get("userId")
    let newPlanId = searchParams.get("newPlanId")

    // If not in searchParams, try to get from body (POST/PUT requests)
    if (!userId) {
      try {
        const body = await request.json()
        userId = body.userId
        newPlanId = body.newPlanId
      } catch {
        // Body might already be consumed or empty
      }
    }

    if (!userId) {
      return {
        authenticated: false,
        error: "User ID no proporcionado",
      }
    }

    // Verify user exists and get user data
    const [user] = await query(`SELECT id, name, email, plan_id, role FROM users WHERE id = ?`, [userId])

    if (!user) {
      return {
        authenticated: false,
        error: "Usuario no encontrado",
      }
    }

    return {
      authenticated: true,
      newPlanId: newPlanId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        planId: user.plan_id,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("[v0] Auth verification error:", error)
    return {
      authenticated: false,
      error: "Error verificando autenticación",
    }
  }
}
