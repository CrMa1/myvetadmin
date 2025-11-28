import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { checkPlanLimit } from "@/lib/plan-limits-validator"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID de usuario requerido" }, { status: 400 })
    }

    const clinics = await query("SELECT * FROM clinics WHERE user_id = ? ORDER BY created_at DESC", [userId])

    return NextResponse.json({
      success: true,
      data: clinics,
    })
  } catch (error) {
    console.error("Get clinics error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener consultorios" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.name) {
      return NextResponse.json({ success: false, error: "Datos incompletos" }, { status: 400 })
    }

    const limitCheck = await checkPlanLimit(body.userId, "clinics")
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Límite de plan alcanzado",
          limitExceeded: true,
          limitInfo: {
            resourceType: "clinics",
            current: limitCheck.current,
            limit: limitCheck.limit,
            planName: limitCheck.planName,
          },
        },
        { status: 403 },
      )
    }

    const result = await query(
      `INSERT INTO clinics (user_id, name, address, phone, email, city, state, postal_code, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.name,
        body.address || "",
        body.phone || "",
        body.email || "",
        body.city || "",
        body.state || "",
        body.postalCode ? body.postalCode.replace(/-/g, "") : "",
        body.description || "",
      ],
    )

    const newClinic = await query("SELECT * FROM clinics WHERE id = ?", [result.insertId])

    return NextResponse.json({
      success: true,
      data: newClinic[0],
      message: "Consultorio creado exitosamente",
    })
  } catch (error) {
    console.error("Create clinic error:", error)
    return NextResponse.json({ success: false, error: "Error al crear consultorio" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.id) {
      return NextResponse.json({ success: false, error: "Datos incompletos" }, { status: 400 })
    }

    await query(
      `UPDATE clinics 
       SET name = ?, address = ?, phone = ?, email = ?, city = ?, state = ?, postal_code = ?, description = ?
       WHERE id = ? AND user_id = ?`,
      [
        body.name,
        body.address || "",
        body.phone || "",
        body.email || "",
        body.city || "",
        body.state || "",
        body.postalCode ? body.postalCode.replace(/-/g, "") : "",
        body.description || "",
        body.id,
        body.userId,
      ],
    )

    const updatedClinic = await query("SELECT * FROM clinics WHERE id = ? AND user_id = ?", [body.id, body.userId])

    if (updatedClinic.length === 0) {
      return NextResponse.json({ success: false, error: "Consultorio no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedClinic[0],
      message: "Consultorio actualizado exitosamente",
    })
  } catch (error) {
    console.error("Update clinic error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar consultorio" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!userId || !id) {
      return NextResponse.json({ success: false, error: "Datos incompletos" }, { status: 400 })
    }

    const result = await query("DELETE FROM clinics WHERE id = ? AND user_id = ?", [id, userId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Consultorio no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Consultorio eliminado correctamente",
    })
  } catch (error) {
    console.error("Delete clinic error:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar consultorio" }, { status: 500 })
  }
}
