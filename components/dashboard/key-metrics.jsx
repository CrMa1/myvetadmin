"use client"

import { DollarSign, Calendar, Users, Package } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function KeyMetrics({ data }) {
  const metrics = [
    {
      title: "Ingresos Totales",
      value: data ? `$${data.totalRevenue.toLocaleString()}` : "$0",
      icon: DollarSign,
      subtitle: "Últimos 30 días",
    },
    {
      title: "Citas Programadas",
      value: data ? data.scheduledAppointments.toString() : "0",
      icon: Calendar,
      subtitle: "Próximas citas",
    },
    {
      title: "Pacientes Activos",
      value: data ? data.activePatients.toString() : "0",
      icon: Users,
      subtitle: "Total registrados",
    },
    {
      title: "Ingreso Neto",
      value: data ? `$${data.netIncome.toLocaleString()}` : "$0",
      icon: Package,
      subtitle: "Ingresos - Egresos",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <StatsCard
          key={metric.title}
          label={metric.title}
          value={metric.value}
          icon={metric.icon}
          subtitle={metric.subtitle}
          color="text-muted-foreground"
        />
      ))}
    </div>
  )
}
