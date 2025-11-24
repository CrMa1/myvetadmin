"use client"

import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart"
import { StatsCard } from "@/components/shared/stats-card"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { Loader2, DollarSign, Users, Calendar, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/currency"

export default function DashboardPage() {
  const { getUserId, getClinicId } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" })

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()

    if (userId && clinicId) {
      fetchDashboardData(userId, clinicId)
    }
  }, [getUserId, getClinicId])

  const fetchDashboardData = async (userId, clinicId, startDate = "", endDate = "") => {
    try {
      setLoading(true)
      let url = `/api/dashboard?userId=${userId}&clinicId=${clinicId}`

      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`
      }

      const response = await fetch(url)
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

  const handleQuickFilter = (filter) => {
    const userId = getUserId()
    const clinicId = getClinicId()
    const today = new Date()
    let startDate, endDate

    switch (filter) {
      case "today":
        startDate = today.toISOString().split("T")[0]
        endDate = startDate
        break
      case "week":
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        startDate = weekStart.toISOString().split("T")[0]
        endDate = today.toISOString().split("T")[0]
        break
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0]
        endDate = today.toISOString().split("T")[0]
        break
      default:
        startDate = ""
        endDate = ""
    }

    setDateRange({ startDate, endDate })
    fetchDashboardData(userId, clinicId, startDate, endDate)
  }

  const handleCustomFilter = () => {
    const userId = getUserId()
    const clinicId = getClinicId()

    if (dateRange.startDate && dateRange.endDate) {
      fetchDashboardData(userId, clinicId, dateRange.startDate, dateRange.endDate)
    }
  }

  const handleResetFilter = () => {
    const userId = getUserId()
    const clinicId = getClinicId()
    setDateRange({ startDate: "", endDate: "" })
    fetchDashboardData(userId, clinicId)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Cargando datos del consultorio...</p>
        </div>

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
  const totalExpenses = metrics.totalExpenses || 0
  const totalPatients = metrics.activePatients || 0
  const totalAppointments = metrics.scheduledAppointments || 0
  const revenue = metrics.netIncome || 0
  const revenueChange = metrics.revenueChange || 0
  const patientsChange = metrics.patientsChange || 0
  const appointmentsChange = metrics.appointmentsChange || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la clínica</p>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQuickFilter("today")}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickFilter("week")}>
            Esta Semana
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickFilter("month")}>
            Este Mes
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilter}>
            Ver Todo
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 block">Fecha Inicio</label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 block">Fecha Fin</label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <Button onClick={handleCustomFilter}>Filtrar</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Ingresos Totales"
          subtitle="Total acumulado"
          value={`${formatCurrency(totalRevenue.toFixed(2))}`}
          icon={DollarSign}
          trend={{ value: revenueChange, isPositive: revenueChange >= 0 }}
        />
        <StatsCard
          label="Egresos Totales"
          subtitle="Total de gastos"
          value={`${formatCurrency(totalExpenses.toFixed(2))}`}
          icon={TrendingDown}
          trend={{ value: totalExpenses, isPositive: false }}
        />
        <StatsCard
          label="Total de Pacientes"
          subtitle="Pacientes registrados"
          value={totalPatients}
          icon={Users}
          trend={{ value: patientsChange, isPositive: patientsChange >= 0 }}
        />
        <StatsCard
          label="Citas Totales"
          subtitle="Consultas realizadas"
          value={totalAppointments}
          icon={Calendar}
          trend={{ value: appointmentsChange, isPositive: appointmentsChange >= 0 }}
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
