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

    const [revenueResult] = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      [userId, clinicId],
    )

    const [expensesResult] = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Egreso' AND user_id = ? AND clinic_id = ? AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      [userId, clinicId],
    )

    const [appointmentsResult] = await query(
      `SELECT COUNT(*) as count 
       FROM consultations 
       WHERE status = 'Programada' AND user_id = ? AND clinic_id = ? AND consultation_date >= NOW()`,
      [userId, clinicId],
    )

    const [patientsResult] = await query("SELECT COUNT(*) as count FROM patients WHERE user_id = ? AND clinic_id = ?", [
      userId,
      clinicId,
    ])

    const salesData = await query(
      `SELECT DATE(transaction_date) as date, SUM(amount) as revenue
       FROM accounting
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(transaction_date)
       ORDER BY date ASC`,
      [userId, clinicId],
    )

    const incomeExpenseData = await query(
      `SELECT 
        WEEK(transaction_date) as week,
        YEAR(transaction_date) as year,
        SUM(CASE WHEN type = 'Ingreso' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'Egreso' THEN amount ELSE 0 END) as expenses
       FROM accounting
       WHERE user_id = ? AND clinic_id = ? AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
       GROUP BY WEEK(transaction_date), YEAR(transaction_date)
       ORDER BY year ASC, week ASC
       LIMIT 8`,
      [userId, clinicId],
    )

    const appointments = await query(
      `SELECT c.*, p.name as patient_name, p.owner as owner_name, s.name as species_name
       FROM consultations c
       LEFT JOIN patients p ON c.patient_id = p.id
       LEFT JOIN species s ON p.species_id = s.id
       WHERE c.user_id = ? AND c.clinic_id = ? AND c.consultation_date >= NOW() 
       ORDER BY c.consultation_date ASC 
       LIMIT 5`,
      [userId, clinicId],
    )

    const totalRevenue = Number.parseFloat(revenueResult.total) || 0
    const totalExpenses = Number.parseFloat(expensesResult.total) || 0

    const responseData = {
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalExpenses,
          netIncome: totalRevenue - totalExpenses,
          scheduledAppointments: appointmentsResult.count || 0,
          activePatients: patientsResult.count || 0,
        },
        salesData: salesData.map((row) => ({
          date: row.date,
          revenue: Number.parseFloat(row.revenue) || 0,
        })),
        incomeExpenseData: incomeExpenseData.map((row) => ({
          week: `Semana ${row.week}`,
          income: Number.parseFloat(row.income) || 0,
          expenses: Number.parseFloat(row.expenses) || 0,
        })),
        appointments: appointments.map((apt) => ({
          id: apt.id,
          patientName: apt.patient_name,
          ownerName: apt.owner_name,
          species: apt.species_name,
          reason: apt.reason,
          date: apt.consultation_date,
          status: apt.status,
        })),
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener datos del dashboard",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
