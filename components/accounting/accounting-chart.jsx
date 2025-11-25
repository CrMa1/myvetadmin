"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { generateMockData } from "@/lib/config"
import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, startOfMonth } from "date-fns"
import { es } from "date-fns/locale"

export function AccountingChart() {
  const chartData = useMemo(() => {
    const accounting = generateMockData.accounting(90)

    // Group by month
    const monthlyData = new Map()

    accounting.forEach((record) => {
      const date = new Date(record.date)
      const monthStart = startOfMonth(date)
      const monthKey = format(monthStart, "MMM yyyy", { locale: es })

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0, net: 0 })
      }

      const month = monthlyData.get(monthKey)
      if (record.type === "Ingreso") {
        month.income += record.amount
      } else {
        month.expenses += record.amount
      }
      month.net = month.income - month.expenses
    })

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        ingresos: data.income,
        egresos: data.expenses,
        neto: data.net,
      }))
      .slice(-6) // Last 6 months
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
    neto: {
      label: "Neto",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Tendencia Financiera</CardTitle>
        <CardDescription className="text-sm">Ingresos, egresos y balance neto mensual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs sm:text-sm" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
              className="text-xs sm:text-sm"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="ingresos" stroke="var(--color-ingresos)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="egresos" stroke="var(--color-egresos)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="neto" stroke="var(--color-neto)" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
