"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { UserPlus, Users, Star, UserX } from "lucide-react"

export function ClientsStats({ clients, onFilterClick, activeFilter }) {
  const getStatusCount = (statusName) => {
    return clients.filter((c) => c.status_name === statusName).length
  }

  const stats = [
    {
      label: "Nuevos",
      subtitle: "Clientes recién registrados",
      value: getStatusCount("Nuevo"),
      icon: UserPlus,
      filter: "Nuevo",
    },
    {
      label: "Frecuentes",
      subtitle: "Clientes regulares",
      value: getStatusCount("Frecuente"),
      icon: Users,
      filter: "Frecuente",
    },
    {
      label: "Especiales",
      subtitle: "Clientes VIP o especiales",
      value: getStatusCount("Especial"),
      icon: Star,
      filter: "Especial",
    },
    {
      label: "Inactivos",
      subtitle: "Sin actividad reciente",
      value: getStatusCount("Inactivo"),
      icon: UserX,
      filter: "Inactivo",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          subtitle={stat.subtitle}
          value={stat.value}
          icon={stat.icon}
          isActive={activeFilter === stat.filter}
          onClick={() => onFilterClick(stat.filter === activeFilter ? null : stat.filter)}
        />
      ))}
    </div>
  )
}
