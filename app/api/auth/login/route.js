import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const userAgent = request.headers.get("user-agent") || "Unknown"
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"

    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = users[0]

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" }, { status: 401 })
    }

    const planLimits = await query("SELECT * FROM plan_limits WHERE plan_id = ?", [user.plan_id || 1])

    if (planLimits.length === 0) {
      return NextResponse.json({ success: false, error: "Plan no válido. Contacte al administrador." }, { status: 400 })
    }

    const limits = planLimits[0]

    const activeSessions = await query(
      `SELECT COUNT(*) as count FROM user_sessions 
       WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 30 MINUTE)`,
      [user.id],
    )

    const activeSessionCount = activeSessions[0].count

    if (limits.max_devices && activeSessionCount >= limits.max_devices) {
      return NextResponse.json(
        {
          success: false,
          error: `Tu plan permite un máximo de ${limits.max_devices} dispositivo(s) conectado(s) simultáneamente. Actualmente tienes ${activeSessionCount} sesión(es) activa(s). Por favor, cierra sesión en otro dispositivo o actualiza tu plan.`,
          message: `Tu plan permite un máximo de ${limits.max_devices} dispositivo(s) conectado(s) simultáneamente. Actualmente tienes ${activeSessionCount} sesión(es) activa(s). Por favor, cierra sesión en otro dispositivo o actualiza tu plan.`,
          code: "MAX_DEVICES_REACHED",
          data: {
            currentSessions: activeSessionCount,
            maxDevices: limits.max_devices,
          },
        },
        { status: 403 },
      )
    }

    const sessionToken = crypto.randomBytes(64).toString("hex")

    await query(
      `INSERT INTO user_sessions (user_id, session_token, device_info, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [user.id, sessionToken, `${userAgent.substring(0, 100)}`, ipAddress, userAgent],
    )

    await query("UPDATE users SET session_active = 1 WHERE id = ?", [user.id])

    const clinics = await query("SELECT * FROM clinics WHERE user_id = ?", [user.id])

    const planFeatures = await query(
      "SELECT feature_code, feature_name, is_enabled FROM plan_features WHERE plan_id = ?",
      [user.plan_id || 1],
    )

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        ...userWithoutPassword,
        clinics: clinics,
        sessionToken: sessionToken,
        planLimits: limits,
        planFeatures: planFeatures,
      },
      message: "Inicio de sesión exitoso",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Error al iniciar sesión" }, { status: 500 })
  }
}
