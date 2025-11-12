import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const patients = await query(
      `SELECT p.*, s.name as species 
       FROM patients p
       LEFT JOIN species s ON p.species_id = s.id
       WHERE p.user_id = ? AND p.clinic_id = ? 
       ORDER BY p.created_at DESC`,
      [userId, clinicId],
    )

    return NextResponse.json({
      success: true,
      data: patients,
    })
  } catch (error) {
    console.error("Get patients error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener pacientes" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO patients (user_id, clinic_id, name, owner, species_id, breed, age, weight, sex, color, medical_history, allergies)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.name,
        body.owner,
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

    const newPatient = await query(
      `SELECT p.*, s.name as species 
       FROM patients p
       LEFT JOIN species s ON p.species_id = s.id
       WHERE p.id = ?`,
      [result.insertId],
    )

    return NextResponse.json({
      success: true,
      data: newPatient[0],
    })
  } catch (error) {
    console.error("Create patient error:", error)
    return NextResponse.json({ success: false, error: "Error al crear paciente" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE patients 
       SET name = ?, owner = ?, species_id = ?, breed = ?, age = ?, 
           weight = ?, sex = ?, color = ?, medical_history = ?, allergies = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.name,
        body.owner,
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
      `SELECT p.*, s.name as species 
       FROM patients p
       LEFT JOIN species s ON p.species_id = s.id
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
    console.error("Update patient error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar paciente" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query("DELETE FROM patients WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Paciente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Paciente eliminado correctamente",
    })
  } catch (error) {
    console.error("Delete patient error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar paciente" }, { status: 500 })
  }
}
