export class SessionManager {
  // Verificar si un usuario puede crear una nueva sesión
  static async canCreateSession(userId, planLimits) {
    const { query } = await import("@/lib/db")

    const activeSessions = await query(
      `SELECT COUNT(*) as count FROM user_sessions 
       WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 30 MINUTE)`,
      [userId],
    )

    const activeCount = activeSessions[0].count

    return {
      canCreate: !planLimits.max_devices || activeCount < planLimits.max_devices,
      currentSessions: activeCount,
      maxDevices: planLimits.max_devices,
    }
  }

  // Limpiar sesiones inactivas (más de 30 minutos)
  static async cleanInactiveSessions(userId) {
    const { query } = await import("@/lib/db")

    await query(
      `DELETE FROM user_sessions 
       WHERE user_id = ? AND last_activity < DATE_SUB(NOW(), INTERVAL 30 MINUTE)`,
      [userId],
    )
  }

  // Actualizar última actividad de una sesión
  static async updateSessionActivity(sessionToken) {
    const { query } = await import("@/lib/db")

    await query("UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?", [sessionToken])
  }

  // Verificar si un usuario excedió sus límites
  static async checkLimits(userId, planLimits) {
    const { query } = await import("@/lib/db")

    const checks = {
      clinics: { exceeded: false, current: 0, max: planLimits.max_clinics },
      patients: { exceeded: false, current: 0, max: planLimits.max_patients },
      consultations: { exceeded: false, current: 0, max: planLimits.max_consultations },
    }

    // Verificar clínicas
    if (planLimits.max_clinics) {
      const clinicsCount = await query("SELECT COUNT(*) as count FROM clinics WHERE user_id = ?", [userId])
      checks.clinics.current = clinicsCount[0].count
      checks.clinics.exceeded = clinicsCount[0].count >= planLimits.max_clinics
    }

    // Verificar pacientes
    if (planLimits.max_patients) {
      const patientsCount = await query("SELECT COUNT(*) as count FROM patients WHERE user_id = ?", [userId])
      checks.patients.current = patientsCount[0].count
      checks.patients.exceeded = patientsCount[0].count >= planLimits.max_patients
    }

    // Verificar consultas mensuales
    if (planLimits.max_consultations) {
      const consultationsCount = await query(
        `SELECT COUNT(*) as count FROM consultations 
         WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE())
         AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
        [userId],
      )
      checks.consultations.current = consultationsCount[0].count
      checks.consultations.exceeded = consultationsCount[0].count >= planLimits.max_consultations
    }

    return checks
  }
}
