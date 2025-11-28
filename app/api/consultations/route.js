import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { checkPlanLimit } from "@/lib/plan-limits-validator"

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
        consultations.id, 
        consultations.user_id as userId,
        consultations.clinic_id as clinicId,
        consultations.client_id as clientId,
        consultations.patient_id as patientId,
        consultations.veterinarian_id as veterinarianId,
        CONCAT(clients.first_name, ' ', clients.last_name) as clientName,
        CONCAT(patients.name, ' ', patients.breed) as patientName,
        reason, 
        diagnosis, 
        treatment, 
        notes, 
        consultation_date as date, 
        status, 
        cost,
        staff.name as veterinarian
       FROM consultations 
       INNER JOIN patients ON consultations.patient_id = patients.id
       INNER JOIN clients ON consultations.client_id = clients.id
       INNER JOIN staff ON consultations.veterinarian_id = staff.id
       WHERE consultations.user_id = ? AND consultations.clinic_id = ?
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

    const limitCheck = await checkPlanLimit(data.userId, "consultations", data.clinicId)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Límite de plan alcanzado",
          limitExceeded: true,
          limitInfo: {
            resourceType: "consultations",
            current: limitCheck.current,
            limit: limitCheck.limit,
            planName: limitCheck.planName,
          },
        },
        { status: 403 },
      )
    }

    console.log("Creating consultation with data:", data)
    const result = await query(
      `INSERT INTO consultations 
       (user_id, clinic_id, client_id, patient_id, veterinarian_id, reason, diagnosis, treatment, notes, consultation_date, status, cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.clinicId,
        data.clientId,
        data.patientId,
        data.veterinarianId,
        data.reason,
        data.diagnosis || null,
        data.treatment || null,
        data.notes || null,
        data.date || new Date().toISOString().split("T")[0],
        data.status || "Programada",
        data.cost || null,
      ],
    )

    const newConsultation = await query(
      `SELECT 
        consultations.id, 
        consultations.user_id as userId,
        consultations.clinic_id as clinicId,
        consultations.client_id as clientId,
        consultations.patient_id as patientId,
        consultations.veterinarian_id as veterinarianId,
        CONCAT(clients.first_name, ' ', clients.last_name) as clientName,
        CONCAT(patients.name, ' ', patients.breed) as patientName,
        reason, 
        diagnosis, 
        treatment, 
        notes, 
        consultation_date as date, 
        status, 
        cost,
        staff.name as veterinarian
       FROM consultations 
       INNER JOIN patients ON consultations.patient_id = patients.id
       INNER JOIN clients ON consultations.client_id = clients.id
       INNER JOIN staff ON consultations.veterinarian_id = staff.id
       WHERE consultations.id = ?`,
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
       SET reason = ?, diagnosis = ?, treatment = ?, notes = ?, consultation_date = ?, 
           veterinarian_id = ?, status = ?, cost = ?, client_id = ?, patient_id = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        data.reason,
        data.diagnosis || null,
        data.treatment || null,
        data.notes || null,
        data.date,
        data.veterinarianId || null,
        data.status || "Programada",
        data.cost || null,
        data.clientId || null,
        data.patientId || null,
        data.id,
        data.userId,
        data.clinicId,
      ],
    )

    const updated = await query(
      `SELECT 
        consultations.id, 
        consultations.user_id as userId,
        consultations.clinic_id as clinicId,
        consultations.client_id as clientId,
        consultations.patient_id as patientId,
        consultations.veterinarian_id as veterinarianId,
        CONCAT(clients.first_name, ' ', clients.last_name) as clientName,
        CONCAT(patients.name, ' (', patients.breed, ')') as patientName,
        consultations.reason, 
        consultations.diagnosis, 
        consultations.treatment, 
        consultations.notes, 
        consultations.consultation_date as date, 
        consultations.status, 
        consultations.cost,
        staff.name as veterinarian
       FROM consultations 
       LEFT JOIN patients ON consultations.patient_id = patients.id
       LEFT JOIN clients ON consultations.client_id = clients.id
       LEFT JOIN staff ON consultations.veterinarian_id = staff.id
       WHERE consultations.id = ? AND consultations.user_id = ? AND consultations.clinic_id = ?`,
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
