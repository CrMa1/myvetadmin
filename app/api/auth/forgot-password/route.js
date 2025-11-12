import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email es requerido" }, { status: 400 })
    }

    // Verificar si el usuario existe
    const users = await query("SELECT id, name, email FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json({
        success: true,
        message: "Si el correo existe, recibirás un enlace de recuperación",
      })
    }

    const user = users[0]

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en la base de datos
    await query("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [
      user.id,
      token,
      expiresAt,
    ])

    // En producción, aquí enviarías un email real
    // Por ahora, solo simulamos el envío
    const resetLink = `https://www.myvetadmin.com/restablecer-contrasena?token=${token}`

    console.log(`[v0] Password reset link for ${email}: ${resetLink}`)

    // Simular envío de email (en producción usar un servicio como SendGrid, Resend, etc.)
    // await sendEmail({
    //   to: email,
    //   subject: "Recuperación de contraseña - MyVetAdmin",
    //   html: `
    //     <h2>Recuperación de contraseña</h2>
    //     <p>Hola ${user.name},</p>
    //     <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    //     <a href="${resetLink}">${resetLink}</a>
    //     <p>Este enlace expirará en 1 hora.</p>
    //     <p>Si no solicitaste este cambio, ignora este correo.</p>
    //   `
    // })

    return NextResponse.json({
      success: true,
      message: "Si el correo existe, recibirás un enlace de recuperación",
      // Solo para desarrollo - remover en producción
      devToken: token,
    })
  } catch (error) {
    console.error("Error in forgot-password:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
