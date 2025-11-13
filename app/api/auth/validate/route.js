import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, phone } = await request.json()

    console.log("[v0] Validating email and phone:", { email, phone })

    const validationErrors = []

    // Verificar si el email ya existe
    if (email) {
      const existingEmailUsers = await query("SELECT id FROM users WHERE email = ?", [email])
      if (existingEmailUsers.length > 0) {
        validationErrors.push({ field: "email", message: "Este correo electrónico ya está registrado" })
      }
    }

    // Verificar si el teléfono ya existe
    if (phone) {
      const existingPhoneUsers = await query("SELECT id FROM users WHERE phone = ?", [phone])
      if (existingPhoneUsers.length > 0) {
        validationErrors.push({ field: "phone", message: "Este número de teléfono ya está registrado" })
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ success: false, errors: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Validación exitosa" })
  } catch (error) {
    console.error("[v0] Validation error:", error)
    return NextResponse.json({ success: false, error: "Error al validar datos" }, { status: 500 })
  }
}
