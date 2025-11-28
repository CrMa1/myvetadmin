import { query } from "@/lib/db"

export async function checkPlanLimits(userId, resourceType) {
  try {
    // Obtener plan del usuario
    const users = await query("SELECT plan_id FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      return {
        allowed: false,
        error: "Usuario no encontrado",
      }
    }

    const planId = users[0].plan_id || 1

    // Obtener límites del plan
    const limits = await query("SELECT * FROM plan_limits WHERE plan_id = ?", [planId])

    if (limits.length === 0) {
      return {
        allowed: false,
        error: "Plan no válido",
      }
    }

    const planLimits = limits[0]

    // Verificar según el tipo de recurso
    switch (resourceType) {
      case "clinic": {
        if (!planLimits.max_clinics) return { allowed: true }

        const count = await query("SELECT COUNT(*) as count FROM clinics WHERE user_id = ?", [userId])

        if (count[0].count >= planLimits.max_clinics) {
          return {
            allowed: false,
            error: `Has alcanzado el límite de ${planLimits.max_clinics} clínica(s) de tu plan`,
            current: count[0].count,
            max: planLimits.max_clinics,
          }
        }
        break
      }

      case "patient": {
        if (!planLimits.max_patients) return { allowed: true }

        const count = await query("SELECT COUNT(*) as count FROM patients WHERE user_id = ?", [userId])

        if (count[0].count >= planLimits.max_patients) {
          return {
            allowed: false,
            error: `Has alcanzado el límite de ${planLimits.max_patients} paciente(s) de tu plan`,
            current: count[0].count,
            max: planLimits.max_patients,
          }
        }
        break
      }

      case "consultation": {
        if (!planLimits.max_consultations) return { allowed: true }

        const count = await query(
          `SELECT COUNT(*) as count FROM consultations 
           WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE())
           AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
          [userId],
        )

        if (count[0].count >= planLimits.max_consultations) {
          return {
            allowed: false,
            error: `Has alcanzado el límite de ${planLimits.max_consultations} consulta(s) mensuales de tu plan`,
            current: count[0].count,
            max: planLimits.max_consultations,
          }
        }
        break
      }
    }

    return { allowed: true, limits: planLimits }
  } catch (error) {
    console.error("[v0] Check plan limits error:", error)
    return {
      allowed: false,
      error: "Error al verificar límites del plan",
    }
  }
}

export async function checkFeatureAccess(userId, featureCode) {
  try {
    const users = await query("SELECT plan_id FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      return { allowed: false, error: "Usuario no encontrado" }
    }

    const planId = users[0].plan_id || 1

    const features = await query("SELECT is_enabled FROM plan_features WHERE plan_id = ? AND feature_code = ?", [
      planId,
      featureCode,
    ])

    if (features.length === 0) {
      return {
        allowed: false,
        error: "Esta función no está disponible en tu plan actual",
      }
    }

    if (!features[0].is_enabled) {
      return {
        allowed: false,
        error: "Esta función no está disponible en tu plan actual",
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error("[v0] Check feature access error:", error)
    return {
      allowed: false,
      error: "Error al verificar acceso a la función",
    }
  }
}
