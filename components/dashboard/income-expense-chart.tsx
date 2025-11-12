"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { generateMockData } from "@/lib/config"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"

export function IncomeExpenseChart() {
  const chartData = useMemo(() => {
    const accountingData = generateMockData.accounting(60)

    // Group by week
    const weeklyData = new Map<string, { income: number; expenses: number }>()

    accountingData.forEach((record) => {
      const date = new Date(record.date)
      const weekStart = startOfWeek(date, { locale: es })
      const weekKey = format(weekStart, "dd MMM", { locale: es })

      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { income: 0, expenses: 0 })
      }

      const week = weeklyData.get(weekKey)!
      if (record.type === "Ingreso") {
        week.income += record.amount
      } else {
        week.expenses += record.amount
      }
    })

    return Array.from(weeklyData.entries())
      .map(([week, data]) => ({
        week,
        ingresos: data.income,
        egresos: data.expenses,
      }))
      .slice(-8) // Last 8 weeks
  }, [])

  const chartConfig = {
    ingresos: {
      label: "Ingresos",
      color: "hsl(var(--chart-2))",
    },
    egresos: {
      label: "Egresos",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Egresos</CardTitle>
        <CardDescription>Comparación semanal de finanzas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="egresos" fill="var(--color-egresos)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
