import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    console.log("[v0] GET /api/patients - Request received")
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    console.log("[v0] Params:", { userId, clinicId })

    if (!userId || !clinicId) {
      console.log("[v0] Missing userId or clinicId")
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const patients = await query(
      `SELECT 
        p.id,
        p.name,
        p.owner as ownerName,
        p.species as animalType,
        p.breed,
        p.age,
        p.weight,
        p.sex,
        p.color,
        p.medical_history as medicalHistory,
        p.allergies as diseases,
        p.created_at as lastVisit
       FROM patients p
       WHERE p.user_id = ? AND p.clinic_id = ? 
       ORDER BY p.created_at DESC`,
      [userId, clinicId],
    )

    console.log("[v0] Patients found:", patients.length)
    console.log("[v0] First patient:", patients[0])

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

    if (!body.userId || !body.clinicId) {
      console.log("[v0] Missing userId or clinicId")
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO patients (user_id, clinic_id, name, owner, species, breed, age, weight, sex, color, medical_history, allergies)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.name,
        body.ownerName, // frontend sends ownerName, db expects owner
        body.animalType, // frontend sends animalType, db expects species
        body.breed || null,
        body.age || null,
        body.weight || null,
        body.sex || null,
        body.color || null,
        body.medicalHistory || null,
        body.diseases || null, // frontend sends diseases, db expects allergies
      ],
    )

    console.log("[v0] Insert result:", result)

    const newPatient = await query(
      `SELECT 
        id,
        name,
        owner as ownerName,
        species as animalType,
        breed,
        age,
        weight,
        sex,
        color,
        medical_history as medicalHistory,
        allergies as diseases,
        created_at as lastVisit
       FROM patients
       WHERE id = ?`,
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
    console.log("[v0] Request body:", body)

    if (!body.userId || !body.clinicId) {
      console.log("[v0] Missing userId or clinicId")
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE patients 
       SET name = ?, owner = ?, species = ?, breed = ?, age = ?, 
           weight = ?, sex = ?, color = ?, medical_history = ?, allergies = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.name,
        body.ownerName, // frontend sends ownerName, db expects owner
        body.animalType, // frontend sends animalType, db expects species
        body.breed || null,
        body.age || null,
        body.weight || null,
        body.sex || null,
        body.color || null,
        body.medicalHistory || null,
        body.diseases || null, // frontend sends diseases, db expects allergies
        body.id,
        body.userId,
        body.clinicId,
      ],
    )

    const updatedPatient = await query(
      `SELECT 
        id,
        name,
        owner as ownerName,
        species as animalType,
        breed,
        age,
        weight,
        sex,
        color,
        medical_history as medicalHistory,
        allergies as diseases,
        created_at as lastVisit
       FROM patients
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [body.id, body.userId, body.clinicId],
    )

    if (updatedPatient.length === 0) {
      console.log("[v0] Patient not found after update")
      return NextResponse.json({ success: false, error: "Paciente no encontrado" }, { status: 404 })
    }

    console.log("[v0] Patient updated:", updatedPatient[0])

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
