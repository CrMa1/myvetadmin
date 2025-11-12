import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = users[0]

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" }, { status: 401 })
    }

    const clinics = await query("SELECT * FROM clinics WHERE user_id = ?", [user.id])

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        ...userWithoutPassword,
        clinics: clinics,
      },
      message: "Inicio de sesión exitoso",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Error al iniciar sesión" }, { status: 500 })
  }
}
