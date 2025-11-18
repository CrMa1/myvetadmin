import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener detalle completo del cliente (datos + pacientes + consultas)
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    // Obtener datos del cliente
    const clientSql = `
      SELECT 
        c.*,
        cs.name as status_name
      FROM clients c
      LEFT JOIN client_status cs ON c.status_id = cs.id
      WHERE c.id = ? AND c.user_id = ? AND c.clinic_id = ?
    `
    const clients = await query(clientSql, [id, userId, clinicId])

    if (clients.length === 0) {
      return NextResponse.json({ success: false, error: "Cliente no encontrado" }, { status: 404 })
    }

    const client = clients[0]

    // Obtener pacientes del cliente
    const patientsSql = `
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM consultations WHERE patient_id = p.id) as consultation_count
      FROM patients p
      WHERE p.client_id = ? AND p.user_id = ? AND p.clinic_id = ?
      ORDER BY p.created_at DESC
    `
    const patients = await query(patientsSql, [id, userId, clinicId])

    // Obtener todas las consultas de los pacientes del cliente
    let consultations = []
    if (patients.length > 0) {
      const patientIds = patients.map((p) => p.id)
      const placeholders = patientIds.map(() => "?").join(",")
      const consultationsSql = `
        SELECT 
          c.*,
          p.name as patient_name
        FROM consultations c
        LEFT JOIN patients p ON c.patient_id = p.id
        WHERE c.patient_id IN (${placeholders}) AND c.user_id = ? AND c.clinic_id = ?
        ORDER BY c.consultation_date DESC, c.created_at DESC
      `
      consultations = await query(consultationsSql, [...patientIds, userId, clinicId])
    }

    return NextResponse.json({
      success: true,
      data: {
        client: client,
        patients: patients,
        consultations: consultations,
      },
    })
  } catch (error) {
    console.error("Get client detail error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener detalle del cliente" }, { status: 500 })
  }
}
