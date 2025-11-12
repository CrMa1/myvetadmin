import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.clinicName || !body.clinicAddress || !body.clinicPhone) {
      return NextResponse.json(
        { success: false, error: "Todos los datos del consultorio son requeridos" },
        { status: 400 },
      )
    }

    // Verificar si el email ya existe
    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [body.email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ success: false, error: "El correo ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const userResult = await query(
      `INSERT INTO users (name, email, password, role, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        `${body.firstName || ""} ${body.lastName || ""}`.trim() || body.name,
        body.email,
        hashedPassword,
        body.role || "admin",
        body.phone || "",
      ],
    )

    const userId = userResult.insertId

    const clinicResult = await query(
      `INSERT INTO clinics (user_id, name, address, phone, email, city, state, postal_code) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.clinicName,
        body.clinicAddress,
        body.clinicPhone,
        body.clinicEmail || body.email,
        body.clinicCity || "",
        body.clinicState || "",
        body.clinicPostalCode || "",
      ],
    )

    const newUsers = await query("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?", [userId])

    const newClinics = await query("SELECT * FROM clinics WHERE id = ?", [clinicResult.insertId])

    return NextResponse.json({
      success: true,
      data: {
        ...newUsers[0],
        clinic: newClinics[0],
      },
      message: "Registro exitoso",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ success: false, error: "Error al registrar usuario" }, { status: 500 })
  }
}
