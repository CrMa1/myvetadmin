import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID de usuario requerido" }, { status: 400 })
    }

    const users = await query("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: users[0] })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener perfil" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ success: false, error: "ID de usuario requerido" }, { status: 400 })
    }

    const updateFields = []
    const updateValues = []

    if (data.name) {
      updateFields.push("name = ?")
      updateValues.push(data.name)
    }
    if (data.email) {
      updateFields.push("email = ?")
      updateValues.push(data.email)
    }
    if (data.phone) {
      updateFields.push("phone = ?")
      updateValues.push(data.phone)
    }
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      updateFields.push("password = ?")
      updateValues.push(hashedPassword)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: "No hay campos para actualizar" }, { status: 400 })
    }

    updateValues.push(data.id)

    await query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    const updatedUsers = await query("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?", [
      data.id,
    ])

    return NextResponse.json({ success: true, data: updatedUsers[0] })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar perfil" }, { status: 500 })
  }
}
