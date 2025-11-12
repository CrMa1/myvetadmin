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

    const accounting = await query(
      `SELECT 
        a.*,
        a.category_id as categoryId,
        c.name as category,
        a.transaction_date as date
       FROM accounting a
       LEFT JOIN conta_categories c ON a.category_id = c.id
       WHERE a.user_id = ? AND a.clinic_id = ? 
       ORDER BY a.transaction_date DESC, a.created_at DESC`,
      [userId, clinicId],
    )
    return NextResponse.json({ success: true, data: accounting })
  } catch (error) {
    console.error("Get accounting error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener registros contables" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO accounting (user_id, clinic_id, type, category_id, amount, description, reference, transaction_date, payment_method, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.type,
        body.categoryId,
        body.amount,
        body.description || null,
        body.reference || null,
        body.date || new Date().toISOString().split("T")[0],
        body.paymentMethod || "Efectivo",
        body.createdBy || null,
      ],
    )

    const newRecord = await query(
      `SELECT 
        a.*,
        a.category_id as categoryId,
        c.name as category,
        a.transaction_date as date
       FROM accounting a
       LEFT JOIN conta_categories c ON a.category_id = c.id
       WHERE a.id = ?`,
      [result.insertId],
    )

    return NextResponse.json({ success: true, data: newRecord[0] })
  } catch (error) {
    console.error("Create accounting error:", error)
    return NextResponse.json({ success: false, error: "Error al crear registro" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE accounting 
       SET type = ?, category_id = ?, amount = ?, description = ?, 
           reference = ?, transaction_date = ?, payment_method = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.type,
        body.categoryId,
        body.amount,
        body.description || null,
        body.reference || null,
        body.date,
        body.paymentMethod || "Efectivo",
        body.id,
        body.userId,
        body.clinicId,
      ],
    )

    const updated = await query(
      `SELECT 
        a.*,
        a.category_id as categoryId,
        c.name as category,
        a.transaction_date as date
       FROM accounting a
       LEFT JOIN conta_categories c ON a.category_id = c.id
       WHERE a.id = ? AND a.user_id = ? AND a.clinic_id = ?`,
      [body.id, body.userId, body.clinicId],
    )

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Registro no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated[0] })
  } catch (error) {
    console.error("Update accounting error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar registro" }, { status: 500 })
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

    const result = await query("DELETE FROM accounting WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Registro no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Registro eliminado correctamente",
    })
  } catch (error) {
    console.error("Delete accounting error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar registro" }, { status: 500 })
  }
}
