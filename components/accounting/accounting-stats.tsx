"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"
import { useMemo } from "react"

interface AccountingStatsProps {
  accounting: any[]
  onFilterClick: (filter: string | null) => void
  activeFilter: string | null
}

export function AccountingStats({ accounting, onFilterClick, activeFilter }: AccountingStatsProps) {
  const stats = useMemo(() => {
    const income = accounting.filter((r) => r.type === "Ingreso").reduce((sum, r) => sum + r.amount, 0)
    const expenses = accounting.filter((r) => r.type === "Egreso").reduce((sum, r) => sum + r.amount, 0)
    const netIncome = income - expenses
    const profitMargin = income > 0 ? ((netIncome / income) * 100).toFixed(1) : "0"

    return [
      {
        title: "Ingresos Totales",
        value: `$${income.toLocaleString()}`,
        icon: TrendingUp,
        description: "Total ingresos",
        trend: "+12.5%",
        positive: true,
        filter: "Ingreso",
      },
      {
        title: "Egresos Totales",
        value: `$${expenses.toLocaleString()}`,
        icon: TrendingDown,
        description: "Total egresos",
        trend: "+8.2%",
        positive: false,
        filter: "Egreso",
      },
      {
        title: "Ingreso Neto",
        value: `$${netIncome.toLocaleString()}`,
        icon: Wallet,
        description: "Ingresos - Egresos",
        trend: `${profitMargin}% margen`,
        positive: netIncome > 0,
        filter: null,
      },
      {
        title: "Balance",
        value: netIncome > 0 ? "Positivo" : "Negativo",
        icon: PiggyBank,
        description: "Estado financiero",
        trend: netIncome > 0 ? "Saludable" : "Revisar",
        positive: netIncome > 0,
        filter: null,
      },
    ]
  }, [accounting])

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
              <div className="flex items-center gap-2 text-xs">
                <span className={stat.positive ? "text-green-500" : "text-red-500"}>{stat.trend}</span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
