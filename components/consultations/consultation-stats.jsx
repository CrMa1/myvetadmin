"use client"

import { Calendar, CheckCircle, Clock, FileText } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function ConsultationStats({ consultations, onFilterClick, activeFilter }) {
  const totalConsultations = consultations.length
  const completedConsultations = consultations.filter((c) => c.status === "Completada").length
  const pendingConsultations = consultations.filter((c) => c.status === "Pendiente").length
  const inProgressConsultations = consultations.filter((c) => c.status === "En Proceso").length

  const stats = [
    {
      label: "Total Consultas",
      value: totalConsultations,
      icon: FileText,
      color: "text-primary",
      filter: null,
      subtitle: "Registros totales",
    },
    {
      label: "Completadas",
      value: completedConsultations,
      icon: CheckCircle,
      color: "text-green-500",
      filter: "Completada",
      subtitle: "Finalizadas exitosamente",
    },
    {
      label: "En Proceso",
      value: inProgressConsultations,
      icon: Clock,
      color: "text-yellow-500",
      filter: "En Proceso",
      subtitle: "En atención actualmente",
    },
    {
      label: "Pendientes",
      value: pendingConsultations,
      icon: Calendar,
      color: "text-blue-500",
      filter: "Pendiente",
      subtitle: "Por atender",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter

        return (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={Icon}
            color={stat.color}
            isActive={isActive}
            onClick={() => onFilterClick(stat.filter)}
            subtitle={stat.subtitle}
          />
        )
      })}
    </div>
  )
}
