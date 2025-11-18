import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    console.log("[v0] Fetching clients for user:", userId, "clinic:", clinicId)

    if (!userId || !clinicId) {
      return Response.json({ success: false, error: "User ID y Clinic ID son requeridos" }, { status: 400 })
    }

    const sql = `
      SELECT 
        c.*,
        cs.name as status_name,
        (SELECT COUNT(*) FROM patients WHERE patients.client_id = c.id AND patients.clinic_id = c.clinic_id) as patient_count
      FROM clients c
      LEFT JOIN client_status cs ON c.status_id = cs.id
      WHERE c.user_id = ? AND c.clinic_id = ?
      ORDER BY c.created_at DESC
    `

    const clients = await query(sql, [userId, clinicId])

    console.log("[v0] Clients fetched:", clients.length)

    return Response.json({ success: true, data: clients })
  } catch (error) {
    console.error("[v0] Error fetching clients:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, clinicId, firstName, lastName, phone, email, address, statusId } = body

    console.log("[v0] Creating client:", { firstName, lastName, phone })

    if (!userId || !clinicId || !firstName || !lastName || !phone) {
      return Response.json({ success: false, error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Verificar si el teléfono ya existe en este consultorio
    const existingPhone = await query(
      "SELECT id FROM clients WHERE phone = ? AND clinic_id = ?",
      [phone, clinicId]
    )

    if (existingPhone.length > 0) {
      return Response.json({ success: false, error: "El teléfono ya está registrado" }, { status: 400 })
    }

    // Si se proporciona email, verificar que no exista
    if (email) {
      const existingEmail = await query(
        "SELECT id FROM clients WHERE email = ? AND clinic_id = ?",
        [email, clinicId]
      )

      if (existingEmail.length > 0) {
        return Response.json({ success: false, error: "El email ya está registrado" }, { status: 400 })
      }
    }

    const sql = `
      INSERT INTO clients (user_id, clinic_id, first_name, last_name, phone, email, address, status_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await query(sql, [
      userId,
      clinicId,
      firstName,
      lastName,
      phone,
      email || null,
      address || null,
      statusId || 1, // Default a 'Nuevo'
    ])

    console.log("[v0] Client created successfully:", result.insertId)

    return Response.json({ success: true, data: { id: result.insertId } })
  } catch (error) {
    console.error("[v0] Error creating client:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, userId, clinicId, firstName, lastName, phone, email, address, statusId } = body

    console.log("[v0] Updating client:", id)

    if (!id || !userId || !clinicId) {
      return Response.json({ success: false, error: "ID, User ID y Clinic ID son requeridos" }, { status: 400 })
    }

    // Verificar que el teléfono no esté en uso por otro cliente
    const existingPhone = await query(
      "SELECT id FROM clients WHERE phone = ? AND clinic_id = ? AND id != ?",
      [phone, clinicId, id]
    )

    if (existingPhone.length > 0) {
      return Response.json({ success: false, error: "El teléfono ya está registrado por otro cliente" }, { status: 400 })
    }

    // Si se proporciona email, verificar que no esté en uso
    if (email) {
      const existingEmail = await query(
        "SELECT id FROM clients WHERE email = ? AND clinic_id = ? AND id != ?",
        [email, clinicId, id]
      )

      if (existingEmail.length > 0) {
        return Response.json({ success: false, error: "El email ya está registrado por otro cliente" }, { status: 400 })
      }
    }

    const sql = `
      UPDATE clients 
      SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, status_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ? AND clinic_id = ?
    `

    await query(sql, [
      firstName,
      lastName,
      phone,
      email || null,
      address || null,
      statusId,
      id,
      userId,
      clinicId,
    ])

    console.log("[v0] Client updated successfully")

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating client:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    console.log("[v0] Deleting client:", id)

    if (!id || !userId || !clinicId) {
      return Response.json({ success: false, error: "ID, User ID y Clinic ID son requeridos" }, { status: 400 })
    }

    const sql = "DELETE FROM clients WHERE id = ? AND user_id = ? AND clinic_id = ?"
    await query(sql, [id, userId, clinicId])

    console.log("[v0] Client deleted successfully")

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting client:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
