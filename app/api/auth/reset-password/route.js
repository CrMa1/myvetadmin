import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token y contraseña son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      )
    }

    // Verificar token
    const tokens = await query(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token],
    )

    if (tokens.length === 0) {
      return NextResponse.json({ success: false, error: "Token inválido o expirado" }, { status: 400 })
    }

    const resetToken = tokens[0]

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar contraseña del usuario
    await query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, resetToken.user_id])

    // Marcar token como usado
    await query("UPDATE password_reset_tokens SET used = TRUE WHERE id = ?", [resetToken.id])

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error in reset-password:", error)
    return NextResponse.json({ success: false, error: "Error al restablecer la contraseña" }, { status: 500 })
  }
}
