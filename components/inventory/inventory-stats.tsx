"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, DollarSign, Boxes } from "lucide-react"
import { useMemo } from "react"

interface InventoryStatsProps {
  inventory: any[]
  onFilterClick: (filter: string | null) => void
  activeFilter: string | null
}

export function InventoryStats({ inventory, onFilterClick, activeFilter }: InventoryStatsProps) {
  const stats = useMemo(() => {
    const totalItems = inventory.length
    const lowStock = inventory.filter((item) => item.stock <= item.minStock).length
    const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.price, 0)
    const medications = inventory.filter((item) => item.category === "Medicamento").length

    return [
      {
        title: "Total Productos",
        value: totalItems.toString(),
        icon: Package,
        description: "En inventario",
        filter: null,
      },
      {
        title: "Stock Bajo",
        value: lowStock.toString(),
        icon: AlertTriangle,
        description: "Requieren reabastecimiento",
        alert: lowStock > 0,
        filter: "lowStock",
      },
      {
        title: "Valor Total",
        value: `$${totalValue.toLocaleString()}`,
        icon: DollarSign,
        description: "Inventario valorizado",
        filter: null,
      },
      {
        title: "Medicamentos",
        value: medications.toString(),
        icon: Boxes,
        description: "Productos médicos",
        filter: "Medicamento",
      },
    ]
  }, [inventory])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter
        return (
          <Card
            key={stat.title}
            className={`${stat.alert ? "border-orange-500" : ""} ${stat.filter ? "cursor-pointer hover:border-primary transition-colors" : ""} ${isActive ? "border-primary" : ""}`}
            onClick={() => stat.filter && onFilterClick(isActive ? null : stat.filter)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.alert ? "text-orange-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.alert ? "text-orange-500" : "text-muted-foreground"}`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
