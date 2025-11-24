"use client"

import { Dog, Cat, Bird, Rabbit } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function PatientsStats({ patients, onFilterClick, activeFilter }) {
  const totalPatients = patients.length
  const dogs = patients.filter((p) => p.species === "Perro").length
  const cats = patients.filter((p) => p.species === "Gato").length
  const birds = patients.filter((p) => p.species === "Ave").length
  const others = patients.filter((p) => !["Perro", "Gato", "Ave"].includes(p.species)).length

  const stats = [
    {
      label: "Total Pacientes",
      value: totalPatients,
      icon: Dog,
      filter: null,
      subtitle: "Registrados en el sistema",
    },
    {
      label: "Perros",
      value: dogs,
      icon: Dog,
      filter: "Perro",
      subtitle: "Pacientes caninos",
    },
    {
      label: "Gatos",
      value: cats,
      icon: Cat,
      filter: "Gato",
      subtitle: "Pacientes felinos",
    },
    {
      label: "Aves",
      value: birds,
      icon: Bird,
      filter: "Ave",
      subtitle: "Pacientes aviares",
    },
    {
      label: "Otros",
      value: others,
      icon: Rabbit,
      filter: "Otros",
      subtitle: "Otras especies",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter

        return (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={Icon}
            color="text-primary"
            isActive={isActive}
            onClick={() => onFilterClick(stat.filter)}
            subtitle={stat.subtitle}
          />
        )
      })}
    </div>
  )
}
