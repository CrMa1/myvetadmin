import { query } from "@/lib/db"

/**
 * Verifica si el usuario ha alcanzado el límite de su plan para un tipo específico de recurso
 * @param {number} userId - ID del usuario
 * @param {string} limitType - Tipo de límite: 'clients', 'patients', 'consultations', 'clinics', 'inventory', 'staff'
 * @param {number} clinicId - ID de la clínica (opcional para algunos recursos)
 * @returns {Promise<{allowed: boolean, current: number, limit: number, planName: string}>}
 */
export async function checkPlanLimit(userId, limitType, clinicId = null) {
  try {
    // Obtener el plan del usuario y los límites
    const [userPlan] = await query(
      `SELECT u.plan_id, p.name as plan_name, pl.* 
       FROM users u
       INNER JOIN subscription_plans p ON u.plan_id = p.id
       INNER JOIN plan_limits pl ON p.id = pl.plan_id
       WHERE u.id = ?`,
      [userId],
    )

    if (!userPlan) {
      return {
        allowed: false,
        current: 0,
        limit: 0,
        planName: "Unknown",
        error: "Plan no encontrado",
      }
    }

    let currentCount = 0
    let limitValue = 0

    // Verificar el límite según el tipo de recurso
    switch (limitType) {
      case "clients":
        limitValue = userPlan.max_clients
        const clientsCount = await query(
          "SELECT COUNT(*) as count FROM clients WHERE user_id = ?" + (clinicId ? " AND clinic_id = ?" : ""),
          clinicId ? [userId, clinicId] : [userId],
        )
        currentCount = clientsCount[0].count
        break

      case "patients":
        limitValue = userPlan.max_patients
        const patientsCount = await query(
          "SELECT COUNT(*) as count FROM patients WHERE user_id = ?" + (clinicId ? " AND clinic_id = ?" : ""),
          clinicId ? [userId, clinicId] : [userId],
        )
        currentCount = patientsCount[0].count
        break

      case "consultations":
        limitValue = userPlan.max_consultations
        const consultationsCount = await query(
          "SELECT COUNT(*) as count FROM consultations WHERE user_id = ?" + (clinicId ? " AND clinic_id = ?" : ""),
          clinicId ? [userId, clinicId] : [userId],
        )
        currentCount = consultationsCount[0].count
        break

      case "clinics":
        limitValue = userPlan.max_clinics
        const clinicsCount = await query("SELECT COUNT(*) as count FROM clinics WHERE user_id = ?", [userId])
        currentCount = clinicsCount[0].count
        break

      case "inventory":
        limitValue = userPlan.max_inventory_items
        const inventoryCount = await query(
          "SELECT COUNT(*) as count FROM inventory WHERE user_id = ? AND deleted = 0" +
            (clinicId ? " AND clinic_id = ?" : ""),
          clinicId ? [userId, clinicId] : [userId],
        )
        currentCount = inventoryCount[0].count
        break

      case "staff":
        limitValue = userPlan.max_staff
        const staffCount = await query(
          "SELECT COUNT(*) as count FROM staff WHERE user_id = ?" + (clinicId ? " AND clinic_id = ?" : ""),
          clinicId ? [userId, clinicId] : [userId],
        )
        currentCount = staffCount[0].count
        break

      default:
        return {
          allowed: false,
          current: 0,
          limit: 0,
          planName: userPlan.plan_name,
          error: "Tipo de límite desconocido",
        }
    }

    // Verificar si el límite es ilimitado (-1)
    const allowed = limitValue === -1 || currentCount < limitValue

    return {
      allowed,
      current: currentCount,
      limit: limitValue,
      planName: userPlan.plan_name,
    }
  } catch (error) {
    console.error("[v0] Error checking plan limit:", error)
    throw error
  }
}

/**
 * Mapeo de nombres de recursos para mostrar en mensajes
 */
export const RESOURCE_NAMES = {
  clients: "clientes",
  patients: "pacientes",
  consultations: "consultas",
  clinics: "consultorios",
  inventory: "productos de inventario",
  staff: "miembros del personal",
}
