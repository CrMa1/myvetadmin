"use client"

import { Card } from "@/components/ui/card"

export function StatsCard({ label, value, icon: Icon, color = "text-primary", isActive = false, onClick, subtitle }) {
  return (
    <Card
      className={`p-4 transition-all ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${
        isActive ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className={`w-8 h-8 ${color}`} />}
      </div>
    </Card>
  )
}
