"use client"

import { SalesChart } from "@/components/dashboard/sales-chart"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { getUserId, getClinicId } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()

    if (userId && clinicId) {
      fetchDashboardData(userId, clinicId)
    }
  }, [getUserId, getClinicId])

  const fetchDashboardData = async (userId, clinicId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error("Error al cargar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la clínica</p>
      </div>

      <KeyMetrics data={dashboardData?.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart data={dashboardData?.salesData} />
        <IncomeExpenseChart data={dashboardData?.incomeExpenseData} />
      </div>

      <RecentAppointments data={dashboardData?.appointments} />
    </div>
  )
}
