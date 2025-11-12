"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, UserCheck, DollarSign } from "lucide-react"
import { useMemo } from "react"

interface StaffStatsProps {
  staff: any[]
  onFilterClick: (filter: string | null) => void
  activeFilter: string | null
}

export function StaffStats({ staff, onFilterClick, activeFilter }: StaffStatsProps) {
  const stats = useMemo(() => {
    const totalStaff = staff.length
    const veterinarians = staff.filter((s) => s.position === "Veterinario").length
    const assistants = staff.filter((s) => s.position === "Asistente Médico").length
    const totalPayroll = staff.reduce((sum, s) => sum + s.salary, 0)

    return [
      {
        title: "Total Empleados",
        value: totalStaff.toString(),
        icon: Users,
        description: "Personal activo",
        filter: null,
      },
      {
        title: "Veterinarios",
        value: veterinarians.toString(),
        icon: Stethoscope,
        description: "Médicos certificados",
        filter: "Veterinario",
      },
      {
        title: "Asistentes",
        value: assistants.toString(),
        icon: UserCheck,
        description: "Personal de apoyo",
        filter: "Asistente Médico",
      },
      {
        title: "Nómina Mensual",
        value: `$${totalPayroll.toLocaleString()}`,
        icon: DollarSign,
        description: "Total salarios",
        filter: null,
      },
    ]
  }, [staff])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter
        return (
          <Card
            key={stat.title}
            className={`${stat.filter ? "cursor-pointer hover:border-primary transition-colors" : ""} ${isActive ? "border-primary" : ""}`}
            onClick={() => stat.filter && onFilterClick(isActive ? null : stat.filter)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
