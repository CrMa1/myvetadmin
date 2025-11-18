import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return Response.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    console.log("[v0] Fetching upcoming consultations for notifications:", { userId, clinicId })

    const upcomingConsultations = await query(
      `SELECT 
        c.id,
        c.consultation_date as date,
        CONCAT(cl.first_name, ' ', cl.last_name) as ownerName,
        p.name as patientName,
        c.reason,
        c.status,
        u.name as veterinarian
      FROM consultations c
      INNER JOIN patients p ON c.patient_id = p.id
      INNER JOIN clients cl ON p.client_id = cl.id
      INNER JOIN users u ON c.veterinarian_id = u.id
      WHERE c.user_id = ? 
        AND c.clinic_id = ?
        AND c.consultation_date >= CURDATE()
        AND c.status != 'Completada'
      ORDER BY c.consultation_date ASC, c.id ASC
      LIMIT 10`,
      [userId, clinicId],
    )

    console.log("[v0] Found upcoming consultations:", upcomingConsultations.length)

    return Response.json({
      success: true,
      data: upcomingConsultations || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching notifications:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
