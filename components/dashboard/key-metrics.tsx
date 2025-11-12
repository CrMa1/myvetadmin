"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Package } from "lucide-react"
import { generateMockData } from "@/lib/config"
import { useMemo } from "react"

export function KeyMetrics() {
  const metrics = useMemo(() => {
    const salesData = generateMockData.sales(30)
    const accountingData = generateMockData.accounting(30)
    const appointmentsData = generateMockData.appointments(20)
    const patientsData = generateMockData.patients(50)

    // Calculate total revenue (last 30 days)
    const totalRevenue = salesData.reduce((sum, day) => sum + day.amount, 0)
    const previousRevenue = salesData.slice(0, 15).reduce((sum, day) => sum + day.amount, 0)
    const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100

    // Calculate total appointments (upcoming)
    const upcomingAppointments = appointmentsData.filter((apt) => new Date(apt.date) > new Date()).length

    // Calculate active patients
    const activePatients = patientsData.filter(
      (patient) => new Date(patient.lastVisit) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    ).length

    // Calculate net income
    const income = accountingData
      .filter((record) => record.type === "Ingreso")
      .reduce((sum, record) => sum + record.amount, 0)
    const expenses = accountingData
      .filter((record) => record.type === "Egreso")
      .reduce((sum, record) => sum + record.amount, 0)
    const netIncome = income - expenses
    const netIncomeChange = ((netIncome - expenses) / expenses) * 100

    return [
      {
        title: "Ingresos Totales",
        value: `$${totalRevenue.toLocaleString()}`,
        change: revenueChange,
        icon: DollarSign,
        description: "Últimos 30 días",
      },
      {
        title: "Citas Programadas",
        value: upcomingAppointments.toString(),
        change: 12.5,
        icon: Calendar,
        description: "Próximas citas",
      },
      {
        title: "Pacientes Activos",
        value: activePatients.toString(),
        change: 8.2,
        icon: Users,
        description: "Últimos 90 días",
      },
      {
        title: "Ingreso Neto",
        value: `$${netIncome.toLocaleString()}`,
        change: netIncomeChange,
        icon: Package,
        description: "Ingresos - Egresos",
      },
    ]
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositive = metric.change >= 0

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={isPositive ? "text-green-500" : "text-red-500"}>
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
