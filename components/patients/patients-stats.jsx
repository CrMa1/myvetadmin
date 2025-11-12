"use client"

import { Card } from "@/components/ui/card"
import { Dog, Cat, Bird, Rabbit } from "lucide-react"

export function PatientsStats({ patients, onFilterByType, activeFilter }) {
  const totalPatients = patients.length
  const dogs = patients.filter((p) => p.animalType === "Perro").length
  const cats = patients.filter((p) => p.animalType === "Gato").length
  const birds = patients.filter((p) => p.animalType === "Ave").length
  const others = patients.filter((p) => !["Perro", "Gato", "Ave"].includes(p.animalType)).length

  const stats = [
    {
      label: "Total Pacientes",
      value: totalPatients,
      icon: Dog,
      color: "text-primary",
      filter: null,
    },
    {
      label: "Perros",
      value: dogs,
      icon: Dog,
      color: "text-accent",
      filter: "Perro",
    },
    {
      label: "Gatos",
      value: cats,
      icon: Cat,
      color: "text-accent",
      filter: "Gato",
    },
    {
      label: "Aves",
      value: birds,
      icon: Bird,
      color: "text-accent",
      filter: "Ave",
    },
    {
      label: "Otros",
      value: others,
      icon: Rabbit,
      color: "text-muted-foreground",
      filter: "Otros",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter

        return (
          <Card
            key={stat.label}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isActive ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onFilterByType(stat.filter)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
