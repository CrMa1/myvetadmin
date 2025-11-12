import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener kardex del paciente (datos + consultas)
export async function GET(request, { params }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const patients = await query("SELECT * FROM patients WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (patients.length === 0) {
      return NextResponse.json({ success: false, error: "Paciente no encontrado" }, { status: 404 })
    }

    const consultations = await query(
      `SELECT * FROM consultations 
       WHERE patient_id = ? AND user_id = ? AND clinic_id = ?
       ORDER BY consultation_date DESC, created_at DESC`,
      [id, userId, clinicId],
    )

    return NextResponse.json({
      success: true,
      data: {
        patient: patients[0],
        consultations: consultations,
      },
    })
  } catch (error) {
    console.error("Get patient kardex error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener kardex del paciente" }, { status: 500 })
  }
}
