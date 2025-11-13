"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { TrendingUp } from "lucide-react"

export function SalesChart({ data }) {
  const hasData = data && data.length > 0

  const salesData = hasData
    ? data.map((item) => ({
        ...item,
        dateFormatted: format(new Date(item.date), "dd MMM", { locale: es }),
      }))
    : [{ dateFormatted: "Sin datos", revenue: 0 }]

  const chartConfig = {
    revenue: {
      label: "Ingresos",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Día</CardTitle>
        <CardDescription>
          {hasData ? "Últimos 30 días de ventas" : "No hay datos de ingresos en los últimos 30 días"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">Sin ingresos registrados</p>
            <p className="text-sm text-muted-foreground">Los ingresos aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dateFormatted" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value / 1000}k`} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Ingresos"]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
