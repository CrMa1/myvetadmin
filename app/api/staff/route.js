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

    const staff = await query(
      `SELECT 
        s.id, 
        s.name as firstName, 
        s.last_name as lastName, 
        s.position_id as positionId,
        p.name as position, 
        s.email, 
        s.phone, 
        s.salary, 
        s.license, 
        s.hire_date as hireDate,
        s.created_at as createdAt
       FROM staff s
       LEFT JOIN positions p ON s.position_id = p.id
       WHERE s.user_id = ? AND s.clinic_id = ? 
       ORDER BY s.created_at DESC`,
      [userId, clinicId],
    )

    return NextResponse.json({ success: true, data: staff })
  } catch (error) {
    console.error("Get staff error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener personal" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

     // Verificar si el teléfono ya existe en este consultorio
    const existingPhone = await query(
      "SELECT id FROM staff WHERE phone = ? AND clinic_id = ?",
      [body.phone, body.clinicId]
    )

    if (existingPhone.length > 0) {
      return Response.json({ success: false, error: "El teléfono ya está registrado" }, { status: 400 })
    }

    // Si se proporciona email, verificar que no exista
    if (body.email) {
      const existingEmail = await query(
        "SELECT id FROM staff WHERE email = ? AND clinic_id = ?",
        [body.email, body.clinicId]
      )

      if (existingEmail.length > 0) {
        return Response.json({ success: false, error: "El email ya está registrado" }, { status: 400 })
      }
    }

    const result = await query(
      `INSERT INTO staff (user_id, clinic_id, name, last_name, position_id, email, phone, salary, license, hire_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.name,
        body.lastName,
        body.positionId,
        body.email || null,
        body.phone || null,
        body.salary || null,
        body.license || null,
        body.hireDate || new Date().toISOString().split("T")[0],
      ],
    )

    const newStaff = await query(
      `SELECT 
        s.id, 
        s.name, 
        s.last_name as lastName, 
        s.position_id as positionId,
        p.name as position, 
        s.email, 
        s.phone, 
        s.salary, 
        s.license, 
        s.hire_date as hireDate 
       FROM staff s
       LEFT JOIN positions p ON s.position_id = p.id
       WHERE s.id = ?`,
      [result.insertId],
    )

    return NextResponse.json({ success: true, data: newStaff[0] })
  } catch (error) {
    console.error("Create staff error:", error)
    return NextResponse.json({ success: false, error: "Error al crear empleado" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE staff 
       SET name = ?, last_name = ?, position_id = ?, email = ?, 
           phone = ?, salary = ?, license = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.name,
        body.lastName,
        body.positionId,
        body.email || null,
        body.phone || null,
        body.salary || null,
        body.license || null,
        body.id,
        body.userId,
        body.clinicId,
      ],
    )

    const updatedStaff = await query(
      `SELECT 
        s.id, 
        s.name, 
        s.last_name as lastName, 
        s.position_id as positionId,
        p.name as position, 
        s.email, 
        s.phone, 
        s.salary, 
        s.license, 
        s.hire_date as hireDate 
       FROM staff s
       LEFT JOIN positions p ON s.position_id = p.id
       WHERE s.id = ? AND s.user_id = ? AND s.clinic_id = ?`,
      [body.id, body.userId, body.clinicId],
    )

    if (updatedStaff.length === 0) {
      return NextResponse.json({ success: false, error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedStaff[0] })
  } catch (error) {
    console.error("Update staff error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar empleado" }, { status: 500 })
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

    const result = await query("DELETE FROM staff WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Empleado eliminado correctamente" })
  } catch (error) {
    console.error("Delete staff error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar empleado" }, { status: 500 })
  }
}
