import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    let dateCondition = ""
    const params = [userId, clinicId]

    if (startDate && endDate) {
      dateCondition = "AND transaction_date BETWEEN ? AND ?"
      params.push(startDate, endDate)
    } else {
      dateCondition = "AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)"
    }

    const [revenueResult] = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? ${dateCondition}`,
      params,
    )

    // Prepare params for consultation queries
    const consultationParams = [userId, clinicId]
    let consultationDateCondition = ""

    if (startDate && endDate) {
      consultationDateCondition = "AND consultation_date BETWEEN ? AND ?"
      consultationParams.push(startDate, endDate)
    } else {
      consultationDateCondition = "AND consultation_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)"
    }

    const [consultationRevenueResult] = await query(
      `SELECT COALESCE(SUM(cost), 0) as total 
       FROM consultations 
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}`,
      consultationParams,
    )

    const [expensesResult] = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Egreso' AND user_id = ? AND clinic_id = ? ${dateCondition}`,
      params,
    )

    const [appointmentsResult] = await query(
      `SELECT COUNT(*) as count 
       FROM consultations 
       WHERE status = 'Programada' AND user_id = ? AND clinic_id = ? AND consultation_date >= NOW()`,
      [userId, clinicId],
    )

    const [patientsResult] = await query(
      "SELECT COUNT(*) as count FROM patients WHERE user_id = ? AND clinic_id = ? AND client_id IS NOT NULL",
      [userId, clinicId],
    )

    const lowStockInventory = await query(
      `SELECT 
        i.*,
        i.min_stock as minStock,
        i.category_id as categoryId,
        ic.name as category,
        i.expiry_date as expiryDate
       FROM inventory i
       LEFT JOIN item_categories ic ON i.category_id = ic.id
       WHERE stock <= min_stock AND user_id = ? AND clinic_id = ?
       ORDER BY i.created_at DESC`,
      params,
    )

    const salesData = await query(
      `SELECT DATE(transaction_date) as date, SUM(amount) as revenue
       FROM accounting
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? ${dateCondition}
       GROUP BY DATE(transaction_date)
       ORDER BY date ASC`,
      params,
    )

    const consultationSalesData = await query(
      `SELECT DATE(consultation_date) as date, SUM(cost) as revenue
       FROM consultations
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}
       GROUP BY DATE(consultation_date)
       ORDER BY date ASC`,
      consultationParams,
    )

    const mergedSalesData = {}
    salesData.forEach((row) => {
      const dateStr = row.date instanceof Date ? row.date.toISOString().split("T")[0] : row.date
      mergedSalesData[dateStr] = (mergedSalesData[dateStr] || 0) + (Number.parseFloat(row.revenue) || 0)
    })
    consultationSalesData.forEach((row) => {
      const dateStr = row.date instanceof Date ? row.date.toISOString().split("T")[0] : row.date
      mergedSalesData[dateStr] = (mergedSalesData[dateStr] || 0) + (Number.parseFloat(row.revenue) || 0)
    })

    const incomeExpenseData = await query(
      `SELECT 
        WEEK(transaction_date) as week,
        YEAR(transaction_date) as year,
        SUM(CASE WHEN type = 'Ingreso' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'Egreso' THEN amount ELSE 0 END) as expenses
       FROM accounting
       WHERE user_id = ? AND clinic_id = ? ${dateCondition}
       GROUP BY WEEK(transaction_date), YEAR(transaction_date)
       ORDER BY year ASC, week ASC
       LIMIT 8`,
      params,
    )

    const consultationIncomeByWeek = await query(
      `SELECT 
        WEEK(consultation_date) as week,
        YEAR(consultation_date) as year,
        SUM(cost) as income
       FROM consultations
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}
       GROUP BY WEEK(consultation_date), YEAR(consultation_date)
       ORDER BY year ASC, week ASC`,
      consultationParams,
    )

    const mergedIncomeExpenseData = {}
    incomeExpenseData.forEach((row) => {
      const key = `${row.year}-${row.week}`
      mergedIncomeExpenseData[key] = {
        week: row.week,
        year: row.year,
        income: Number.parseFloat(row.income) || 0,
        expenses: Number.parseFloat(row.expenses) || 0,
      }
    })
    consultationIncomeByWeek.forEach((row) => {
      const key = `${row.year}-${row.week}`
      if (mergedIncomeExpenseData[key]) {
        mergedIncomeExpenseData[key].income += Number.parseFloat(row.income) || 0
      } else {
        mergedIncomeExpenseData[key] = {
          week: row.week,
          year: row.year,
          income: Number.parseFloat(row.income) || 0,
          expenses: 0,
        }
      }
    })

    const appointments = await query(
      `SELECT c.*, p.name as patient_name, CONCAT(cl.first_name, ' ', cl.last_name) as owner_name, s.name as species_name
       FROM consultations c
       LEFT JOIN patients p ON c.patient_id = p.id
       LEFT JOIN clients cl ON p.client_id = cl.id
       LEFT JOIN species s ON p.species_id = s.id
       WHERE c.user_id = ? AND c.clinic_id = ? AND c.consultation_date >= NOW() 
       ORDER BY c.consultation_date ASC 
       LIMIT 5`,
      [userId, clinicId],
    )

    const accountingRevenue = Number.parseFloat(revenueResult.total) || 0
    const consultationRevenue = Number.parseFloat(consultationRevenueResult.total) || 0
    const totalRevenue = accountingRevenue + consultationRevenue
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
        salesData: Object.keys(mergedSalesData)
          .sort()
          .map((date) => ({
            date,
            revenue: mergedSalesData[date],
          })),
        incomeExpenseData: Object.values(mergedIncomeExpenseData)
          .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year
            return a.week - b.week
          })
          .slice(-8)
          .map((row) => ({
            week: `Semana ${row.week}`,
            income: row.income,
            expenses: row.expenses,
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
        lowStockInventory: lowStockInventory,
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
