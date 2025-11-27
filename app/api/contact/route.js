import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validar campos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Nombre, email, asunto y mensaje son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "El formato del email no es válido" }, { status: 400 })
    }

    // Obtener información adicional de la petición
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Insertar en la base de datos
    const result = await query(
      `INSERT INTO contact_requests (name, email, phone, subject, message, ip_address, user_agent, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Nuevo')`,
      [name, email, phone || null, subject, message, ipAddress, userAgent],
    )

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de contacto enviada exitosamente",
        id: result.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// GET para obtener todas las solicitudes (para un futuro panel de admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let sql = `
      SELECT id, name, email, phone, subject, message, status, created_at, updated_at
      FROM contact_requests
    `

    const values = []

    if (status) {
      sql += " WHERE status = ?"
      values.push(status)
    }

    sql += " ORDER BY created_at DESC"

    const requests = await query(sql,values,)
    return NextResponse.json({ success: true, data: requests })

} catch (error) {
    return NextResponse.json({ error: "Error al obtener las solicitudes" }, { status: 500 })
  }
}
