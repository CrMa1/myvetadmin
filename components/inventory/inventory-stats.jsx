"use client"

import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function InventoryStats({ inventory, onFilterClick, activeFilter }) {
  const totalItems = inventory.length
  const lowStock = inventory.filter((i) => i.stock <= (i.minStock || 10)).length
  const totalValue = inventory.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.stock || 0), 0)
  const categories = [...new Set(inventory.map((i) => i.category))].length

  const stats = [
    {
      label: "Total Productos",
      value: totalItems,
      icon: Package,
      color: "text-primary",
      filter: null,
      subtitle: "Productos registrados",
    },
    {
      label: "Stock Bajo",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-red-500",
      filter: "lowStock",
      subtitle: "Requiere reabastecimiento",
    },
    {
      label: "Valor Inventario",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      filter: null,
      subtitle: "Valor total del stock",
    },
    {
      label: "Categorías",
      value: categories,
      icon: TrendingUp,
      color: "text-accent",
      filter: null,
      subtitle: "Tipos de productos",
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
            onClick={stat.filter ? () => onFilterClick(stat.filter) : undefined}
            subtitle={stat.subtitle}
          />
        )
      })}
    </div>
  )
}
