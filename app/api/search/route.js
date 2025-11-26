import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const querySearch = searchParams.get("q")
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!querySearch) {
      return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
    }

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const searchTerm = `%${querySearch}%`

    try {
      const clients = await query(
        `SELECT 
                    c.*,
                    cs.name as status_name,
                    (SELECT COUNT(*) FROM patients WHERE patients.client_id = c.id AND patients.clinic_id = c.clinic_id) as patient_count
                FROM clients c
                LEFT JOIN client_status cs ON c.status_id = cs.id
                WHERE (c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)
                AND c.user_id = ? AND c.clinic_id = ?
                LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, searchTerm, userId, clinicId],
      )

      const patients = await query(
        `SELECT 
                    p.id,
                    p.name,
                    p.client_id,
                    CONCAT(c.first_name, ' ', c.last_name) as ownerName,
                    c.phone as ownerPhone,
                    c.email as ownerEmail,
                    c.address as ownerAddress,
                    species.name as animalType,
                    p.species_id,
                    p.breed,
                    p.age,
                    p.weight,
                    p.sex,
                    p.color,
                    p.medical_history as medicalHistory,
                    p.allergies as diseases,
                    p.last_visit as lastVisit
                FROM patients p
                INNER JOIN clients c ON p.client_id = c.id
                INNER JOIN species ON p.species_id = species.id
                WHERE (p.name LIKE ? OR species.name LIKE ? OR p.breed LIKE ?)
                AND p.user_id = ? AND p.clinic_id = ?
                LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, userId, clinicId],
      )

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
                WHERE (patients.name LIKE ? OR clients.first_name LIKE ? OR clients.last_name LIKE ? OR consultations.reason LIKE ?)
                AND consultations.user_id = ? AND consultations.clinic_id = ?
                LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, searchTerm, userId, clinicId],
      )

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
                WHERE (s.name LIKE ? OR s.last_name LIKE ? OR p.name LIKE ? OR s.email LIKE ?)
                AND s.user_id = ? AND s.clinic_id = ?
                LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, searchTerm, userId, clinicId],
      )

      const inventory = await query(
        `SELECT 
          i.*,
          i.min_stock as minStock,
          i.category_id as categoryId,
          ic.name as category,
          i.expiry_date as expiryDate
        FROM inventory i
        LEFT JOIN item_categories ic ON i.category_id = ic.id
        WHERE (i.name LIKE ? OR ic.name LIKE ? OR i.supplier LIKE ?)
        AND i.user_id = ? AND i.clinic_id = ?
        LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, userId, clinicId],
      )

      return NextResponse.json({
        success: true,
        data: {
          clients: clients,
          patients: patients,
          consultations: consultations,
          staff: staff,
          inventory: inventory,
        },
      })
    } catch (error) {
      console.error("[v0] Search error:", error)
      return NextResponse.json({ success: false, error: "Error al realizar la búsqueda" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Search error:", error)
    return NextResponse.json({ success: false, error: "Error al realizar la búsqueda" }, { status: 500 })
  }
}
