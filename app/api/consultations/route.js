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

    const consultations = await query(
      `SELECT 
        id, 
        patient_id as patientId, 
        patient_name as patientName, 
        owner_name as ownerName, 
        accompanied_by as accompaniedBy,
        reason, 
        diagnosis, 
        treatment, 
        notes, 
        consultation_date as date, 
        veterinarian, 
        status, 
        cost 
       FROM consultations 
       WHERE user_id = ? AND clinic_id = ?
       ORDER BY consultation_date DESC`,
      [userId, clinicId],
    )

    return NextResponse.json({ success: true, data: consultations })
  } catch (error) {
    console.error("Get consultations error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener consultas" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.userId || !data.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO consultations 
       (user_id, clinic_id, patient_id, patient_name, owner_name, accompanied_by, reason, diagnosis, treatment, notes, consultation_date, veterinarian, status, cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.clinicId,
        data.patientId || null,
        data.patientName,
        data.ownerName,
        data.accompaniedBy,
        data.reason,
        data.diagnosis || null,
        data.treatment || null,
        data.notes || null,
        data.date || new Date().toISOString().split("T")[0],
        data.veterinarian || null,
        "Completada",
        data.cost || null,
      ],
    )

    const newConsultation = await query(
      `SELECT 
        id, 
        patient_id as patientId, 
        patient_name as patientName, 
        owner_name as ownerName, 
        accompanied_by as accompaniedBy,
        reason, 
        diagnosis, 
        treatment, 
        notes, 
        consultation_date as date, 
        veterinarian, 
        status, 
        cost 
       FROM consultations 
       WHERE id = ?`,
      [result.insertId],
    )

    return NextResponse.json({ success: true, data: newConsultation[0] })
  } catch (error) {
    console.error("Create consultation error:", error)
    return NextResponse.json({ success: false, error: "Error al crear consulta" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()

    if (!data.userId || !data.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE consultations 
       SET patient_name = ?, owner_name = ?, accompanied_by = ?, reason = ?, diagnosis = ?, 
           treatment = ?, notes = ?, consultation_date = ?, veterinarian = ?, cost = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        data.patientName,
        data.ownerName,
        data.accompaniedBy,
        data.reason,
        data.diagnosis || null,
        data.treatment || null,
        data.notes || null,
        data.date,
        data.veterinarian || null,
        data.cost || null,
        data.id,
        data.userId,
        data.clinicId,
      ],
    )

    const updated = await query(
      `SELECT 
        id, 
        patient_id as patientId, 
        patient_name as patientName, 
        owner_name as ownerName, 
        accompanied_by as accompaniedBy,
        reason, 
        diagnosis, 
        treatment, 
        notes, 
        consultation_date as date, 
        veterinarian, 
        status, 
        cost 
       FROM consultations 
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [data.id, data.userId, data.clinicId],
    )

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Consulta no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated[0] })
  } catch (error) {
    console.error("Update consultation error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar consulta" }, { status: 500 })
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

    const result = await query("DELETE FROM consultations WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Consulta no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete consultation error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar consulta" }, { status: 500 })
  }
}
