import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const body = await request.json()

    console.log("[v0] Register request received:", {
      email: body.email,
      phone: body.phone,
      hasClinicData: !!body.clinicName,
      selectedPlan: body.planId, // Agregar plan seleccionado
    })

    if (!body.clinicName || !body.clinicAddress || !body.clinicPhone) {
      return NextResponse.json(
        { success: false, error: "Todos los datos del consultorio son requeridos" },
        { status: 400 },
      )
    }

    const existingEmail = await query("SELECT id FROM users WHERE email = ?", [body.email])
    if (existingEmail.length > 0) {
      return NextResponse.json({ success: false, error: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    const existingPhone = await query("SELECT id FROM users WHERE phone = ?", [body.phone])
    if (existingPhone.length > 0) {
      return NextResponse.json({ success: false, error: "El número de teléfono ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const planId = body.planId || 1 // Default plan básico

    const userResult = await query(
      `INSERT INTO users (name, email, password, role, plan_id, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `${body.firstName || ""} ${body.lastName || ""}`.trim() || body.name,
        body.email,
        hashedPassword,
        body.role || "admin",
        planId,
        body.phone || "",
      ],
    )

    const userId = userResult.insertId
    console.log("[v0] User created with ID:", userId, "Plan:", planId)

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

    console.log("[v0] Clinic created with ID:", clinicResult.insertId)

    const planLimits = await query("SELECT * FROM plan_limits WHERE plan_id = ?", [planId])
    const planFeatures = await query(
      "SELECT feature_code, feature_name, is_enabled FROM plan_features WHERE plan_id = ?",
      [planId],
    )

    const newUsers = await query("SELECT id, name, email, role, plan_id, phone, created_at FROM users WHERE id = ?", [
      userId,
    ])
    const newClinics = await query("SELECT * FROM clinics WHERE id = ?", [clinicResult.insertId])

    return NextResponse.json({
      success: true,
      data: {
        ...newUsers[0],
        clinic: newClinics[0],
        planLimits: planLimits[0] || null,
        planFeatures: planFeatures || [],
      },
      message: "Registro exitoso",
    })
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ success: false, error: "Error al registrar usuario" }, { status: 500 })
  }
}
