"use client"

import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react"
import { StatsCard } from "@/components/shared/stats-card"

export function AccountingStats({ accounting, onFilterClick, activeFilter }) {
  const totalIncome = accounting.filter((a) => a.type === "Ingreso").reduce((sum, a) => sum + Number(a.amount || 0), 0)
  const totalExpense = accounting.filter((a) => a.type === "Egreso").reduce((sum, a) => sum + Number(a.amount || 0), 0)
  const netBalance = totalIncome - totalExpense

  const stats = [
    {
      label: "Total",
      value: accounting.length,
      icon: Wallet,
      color: "text-primary",
      filter: null,
      subtitle: "Movimientos totales",
    },
    {
      label: "Ingresos",
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
      filter: "Ingreso",
      subtitle: `${accounting.filter((a) => a.type === "Ingreso").length} registros`,
    },
    {
      label: "Egresos",
      value: `$${totalExpense.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-500",
      filter: "Egreso",
      subtitle: `${accounting.filter((a) => a.type === "Egreso").length} registros`,
    },
    {
      label: "Balance",
      value: `$${netBalance.toLocaleString()}`,
      icon: DollarSign,
      color: netBalance >= 0 ? "text-green-500" : "text-red-500",
      filter: null,
      subtitle: "Ingresos - Egresos",
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
            onClick={stat.filter !== null ? () => onFilterClick(stat.filter) : undefined}
            subtitle={stat.subtitle}
          />
        )
      })}
    </div>
  )
}
