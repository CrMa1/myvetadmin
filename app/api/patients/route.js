import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    console.log("[v0] GET /api/patients - Request received")
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")
    const clientId = searchParams.get("clientId") // Agregar filtro por clientId

    console.log("[v0] Params:", { userId, clinicId, clientId })

    if (!userId || !clinicId) {
      console.log("[v0] Missing userId or clinicId")
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    let sqlQuery = `
      SELECT 
        p.id,
        p.name,
        p.client_id,
        CONCAT(c.first_name, ' ', c.last_name) as ownerName,
        p.species as animalType,
        p.species_id,
        p.breed,
        p.age,
        p.weight,
        p.sex,
        p.color,
        p.medical_history as medicalHistory,
        p.allergies as diseases,
        p.created_at as lastVisit
       FROM patients p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.user_id = ? AND p.clinic_id = ?`

    const params = [userId, clinicId]

    if (clientId) {
      sqlQuery += ` AND p.client_id = ?`
      params.push(clientId)
    }

    sqlQuery += ` ORDER BY p.created_at DESC`

    const patients = await query(sqlQuery, params)

    console.log("[v0] Patients found:", patients.length)

    return NextResponse.json({
      success: true,
      data: patients,
    })
  } catch (error) {
    console.error("[v0] Get patients error:", error)
    return NextResponse.json({ success: false, error: error.message || "Error al obtener pacientes" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log("[v0] POST /api/patients - Request received")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    if (!body.userId || !body.clinicId || !body.clientId) {
      console.log("[v0] Missing required fields")
      return NextResponse.json(
        { success: false, error: "userId, clinicId y clientId son requeridos" },
        { status: 400 },
      )
    }

    const result = await query(
      `INSERT INTO patients (user_id, clinic_id, client_id, name, species_id, breed, age, weight, sex, color, medical_history, allergies)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.clientId,
        body.name,
        body.speciesId,
        body.breed || null,
        body.age || null,
        body.weight || null,
        body.sex || null,
        body.color || null,
        body.medicalHistory || null,
        body.allergies || null,
      ],
    )

    console.log("[v0] Insert result:", result)

    const newPatient = await query(
      `SELECT 
        p.id,
        p.name,
        p.client_id,
        CONCAT(c.first_name, ' ', c.last_name) as ownerName,
        p.species_id,
        p.breed,
        p.age,
        p.weight,
        p.sex,
        p.color,
        p.medical_history as medicalHistory,
        p.allergies as diseases,
        p.created_at as lastVisit
       FROM patients p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ?`,
      [result.insertId],
    )

    console.log("[v0] New patient created:", newPatient[0])

    return NextResponse.json({
      success: true,
      data: newPatient[0],
    })
  } catch (error) {
    console.error("[v0] Create patient error:", error)
    return NextResponse.json({ success: false, error: error.message || "Error al crear paciente" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    console.log("[v0] PUT /api/patients - Request received")
    const body = await request.json()

    if (!body.userId || !body.clinicId || !body.clientId) {
      return NextResponse.json(
        { success: false, error: "userId, clinicId y clientId son requeridos" },
        { status: 400 },
      )
    }

    await query(
      `UPDATE patients 
       SET name = ?, client_id = ?, species_id = ?, breed = ?, age = ?, 
           weight = ?, sex = ?, color = ?, medical_history = ?, allergies = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.name,
        body.clientId,
        body.speciesId,
        body.breed || null,
        body.age || null,
        body.weight || null,
        body.sex || null,
        body.color || null,
        body.medicalHistory || null,
        body.allergies || null,
        body.id,
        body.userId,
        body.clinicId,
      ],
    )

    const updatedPatient = await query(
      `SELECT 
        p.id,
        p.name,
        p.client_id,
        CONCAT(c.first_name, ' ', c.last_name) as ownerName,
        p.species_id,
        p.breed,
        p.age,
        p.weight,
        p.sex,
        p.color,
        p.medical_history as medicalHistory,
        p.allergies as diseases,
        p.created_at as lastVisit
       FROM patients p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ? AND p.user_id = ? AND p.clinic_id = ?`,
      [body.id, body.userId, body.clinicId],
    )

    if (updatedPatient.length === 0) {
      return NextResponse.json({ success: false, error: "Paciente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedPatient[0],
    })
  } catch (error) {
    console.error("[v0] Update patient error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error al actualizar paciente" },
      { status: 500 },
    )
  }
}

export async function DELETE(request) {
  try {
    console.log("[v0] DELETE /api/patients - Request received")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    console.log("[v0] Params:", { id, userId, clinicId })

    if (!userId || !clinicId) {
      console.log("[v0] Missing userId or clinicId")
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query("DELETE FROM patients WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    console.log("[v0] Delete result:", result)

    if (result.affectedRows === 0) {
      console.log("[v0] Patient not found for deletion")
      return NextResponse.json({ success: false, error: "Paciente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Paciente eliminado correctamente",
    })
  } catch (error) {
    console.error("[v0] Delete patient error:", error)
    return NextResponse.json({ success: false, error: error.message || "Error al eliminar paciente" }, { status: 500 })
  }
}
