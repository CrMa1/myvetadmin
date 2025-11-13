"use client"

import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart"
import { StatsCard } from "@/components/shared/stats-card"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { Loader2, DollarSign, Users, Calendar, TrendingUp } from "lucide-react"

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
          <p className="text-muted-foreground">Cargando datos del consultorio...</p>
        </div>

        {/* Skeleton for metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton for charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton for appointments */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const metrics = dashboardData?.metrics || {}
  const totalRevenue = metrics.totalRevenue || 0
  const totalPatients = metrics.totalPatients || 0
  const totalAppointments = metrics.totalAppointments || 0
  const revenue = metrics.revenue || 0
  const revenueChange = metrics.revenueChange || 0
  const patientsChange = metrics.patientsChange || 0
  const appointmentsChange = metrics.appointmentsChange || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la clínica</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ingresos Totales"
          subtitle="Total acumulado"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: revenueChange, isPositive: revenueChange >= 0 }}
        />
        <StatsCard
          title="Total de Pacientes"
          subtitle="Pacientes registrados"
          value={totalPatients}
          icon={Users}
          trend={{ value: patientsChange, isPositive: patientsChange >= 0 }}
        />
        <StatsCard
          title="Citas Totales"
          subtitle="Consultas realizadas"
          value={totalAppointments}
          icon={Calendar}
          trend={{ value: appointmentsChange, isPositive: appointmentsChange >= 0 }}
        />
        <StatsCard
          title="Ingresos del Mes"
          subtitle="Este mes"
          value={`$${revenue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: revenueChange, isPositive: revenueChange >= 0 }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart data={dashboardData?.salesData} />
        <IncomeExpenseChart data={dashboardData?.incomeExpenseData} />
      </div>

      <RecentAppointments data={dashboardData?.appointments} />
    </div>
  )
}
