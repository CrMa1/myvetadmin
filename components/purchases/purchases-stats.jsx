"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { ShoppingBag, CheckCircle2, XCircle, Clock } from "lucide-react"

export function PurchasesStats({ purchases, onFilterClick, activeFilter }) {
  const totalPurchases = purchases.length
  const paidPurchases = purchases.filter((p) => p.status === "paid").length
  const unpaidPurchases = purchases.filter((p) => p.status === "unpaid").length
  const incompletePurchases = purchases.filter(
    (p) => p.status !== "paid" && p.status !== "unpaid" && p.status !== "no_payment_required",
  ).length

  const stats = [
    {
      label: "Total de Compras",
      subtitle: "Todas tus transacciones",
      value: totalPurchases,
      icon: ShoppingBag,
      filter: null,
    },
    {
      label: "Compras Aprobadas",
      subtitle: "Pagos completados",
      value: paidPurchases,
      icon: CheckCircle2,
      filter: "paid",
    },
    {
      label: "Compras Rechazadas",
      subtitle: "Pagos fallidos",
      value: unpaidPurchases,
      icon: XCircle,
      filter: "unpaid",
    },
    {
      label: "En Proceso",
      subtitle: "Pagos pendientes",
      value: incompletePurchases,
      icon: Clock,
      filter: "incomplete",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          subtitle={stat.subtitle}
          value={stat.value}
          icon={stat.icon}
          isActive={activeFilter === stat.filter}
          onClick={() => onFilterClick(stat.filter === activeFilter ? null : stat.filter)}
        />
      ))}
    </div>
  )
}
