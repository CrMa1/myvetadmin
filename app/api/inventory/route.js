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

    const inventory = await query(
      `SELECT 
        i.*,
        i.category_id as categoryId,
        ic.name as category,
        i.expiry_date as expiryDate
       FROM inventory i
       LEFT JOIN item_categories ic ON i.category_id = ic.id
       WHERE i.user_id = ? AND i.clinic_id = ? 
       ORDER BY i.created_at DESC`,
      [userId, clinicId],
    )
    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Get inventory error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener inventario" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO inventory (user_id, clinic_id, name, category_id, type, stock, price, cost, unit, description, expiry_date, supplier)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.clinicId,
        body.name,
        body.categoryId,
        body.type || null,
        body.stock || 0,
        body.price,
        body.cost || null,
        body.unit || null,
        body.description || null,
        body.expiryDate || null,
        body.supplier || null,
      ],
    )

    const newItem = await query(
      `SELECT 
        i.*,
        i.category_id as categoryId,
        ic.name as category,
        i.expiry_date as expiryDate
       FROM inventory i
       LEFT JOIN item_categories ic ON i.category_id = ic.id
       WHERE i.id = ?`,
      [result.insertId],
    )

    return NextResponse.json({ success: true, data: newItem[0] })
  } catch (error) {
    console.error("Create inventory error:", error)
    return NextResponse.json({ success: false, error: "Error al crear producto" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    await query(
      `UPDATE inventory 
       SET name = ?, category_id = ?, type = ?, stock = ?, price = ?, 
           cost = ?, unit = ?, description = ?, expiry_date = ?, supplier = ?
       WHERE id = ? AND user_id = ? AND clinic_id = ?`,
      [
        body.name,
        body.categoryId,
        body.type || null,
        body.stock || 0,
        body.price,
        body.cost || null,
        body.unit || null,
        body.description || null,
        body.expiryDate || null,
        body.supplier || null,
        body.id,
        body.userId,
        body.clinicId,
      ],
    )

    const updatedItem = await query(
      `SELECT 
        i.*,
        i.category_id as categoryId,
        ic.name as category,
        i.expiry_date as expiryDate
       FROM inventory i
       LEFT JOIN item_categories ic ON i.category_id = ic.id
       WHERE i.id = ? AND i.user_id = ? AND i.clinic_id = ?`,
      [body.id, body.userId, body.clinicId],
    )

    if (updatedItem.length === 0) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedItem[0] })
  } catch (error) {
    console.error("Update inventory error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar producto" }, { status: 500 })
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

    const result = await query("DELETE FROM inventory WHERE id = ? AND user_id = ? AND clinic_id = ?", [
      id,
      userId,
      clinicId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Producto eliminado correctamente",
    })
  } catch (error) {
    console.error("Delete inventory error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar producto" }, { status: 500 })
  }
}
