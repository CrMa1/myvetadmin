"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Package } from "lucide-react"

export function KeyMetrics({ data }) {
  if (!data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: "Ingresos Totales",
      value: `$${data.totalRevenue.toLocaleString()}`,
      change: 15.2,
      icon: DollarSign,
      description: "Últimos 30 días",
    },
    {
      title: "Citas Programadas",
      value: data.scheduledAppointments.toString(),
      change: 12.5,
      icon: Calendar,
      description: "Próximas citas",
    },
    {
      title: "Pacientes Activos",
      value: data.activePatients.toString(),
      change: 8.2,
      icon: Users,
      description: "Total registrados",
    },
    {
      title: "Ingreso Neto",
      value: `$${data.netIncome.toLocaleString()}`,
      change: data.netIncome >= 0 ? 10.5 : -5.3,
      icon: Package,
      description: "Ingresos - Egresos",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
