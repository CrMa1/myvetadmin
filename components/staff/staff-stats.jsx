"use client"

import { Users, UserCog, Stethoscope, Briefcase } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function StaffStats({ staff, onFilterClick, activeFilter }) {
  const totalStaff = staff.length
  const veterinarians = staff.filter((s) => s.position && s.position.toLowerCase().includes("veterinari")).length
  const assistants = staff.filter((s) => s.position && s.position.toLowerCase().includes("asistent")).length
  const others = staff.filter(
    (s) =>
      s.position && !s.position.toLowerCase().includes("veterinari") && !s.position.toLowerCase().includes("asistent"),
  ).length

  const stats = [
    {
      label: "Total Personal",
      value: totalStaff,
      icon: Users,
      color: "text-primary",
      filter: null,
      subtitle: "Empleados registrados",
    },
    {
      label: "Veterinarios",
      value: veterinarians,
      icon: Stethoscope,
      color: "text-accent",
      filter: "Veterinario",
      subtitle: "Personal médico",
    },
    {
      label: "Asistentes",
      value: assistants,
      icon: UserCog,
      color: "text-accent",
      filter: "Asistente",
      subtitle: "Personal de apoyo",
    },
    {
      label: "Otros",
      value: others,
      icon: Briefcase,
      color: "text-muted-foreground",
      filter: "Otros",
      subtitle: "Otras posiciones",
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
