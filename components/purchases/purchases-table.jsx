"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

export function PurchasesTable({ purchases, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      paid: "bg-green-500/10 text-green-700 dark:text-green-400",
      unpaid: "bg-red-500/10 text-red-700 dark:text-red-400",
      no_payment_required: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      incomplete: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    }
    return colors[status] || "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }

  const getStatusLabel = (status) => {
    const labels = {
      paid: "Aprobado",
      unpaid: "Rechazado",
      no_payment_required: "Completado",
      incomplete: "En Proceso",
    }
    return labels[status] || status
  }

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      (purchase.plan_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (purchase.customer_email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (getStatusLabel(purchase.status)?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (purchase.payment_method?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">Historial de Compras</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Todas tus transacciones realizadas</CardDescription>
          </div>
          <div className="search-input-wrapper">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar compras..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="sm:hidden space-y-4">
          {filteredPurchases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No se encontraron compras</p>
          ) : (
            filteredPurchases.map((purchase) => (
              <Card key={purchase.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">{purchase.plan_name}</p>
                    <Badge variant="outline" className={`${getStatusColor(purchase.status)} mt-1`}>
                      {getStatusLabel(purchase.status)}
                    </Badge>
                  </div>
                  {purchase.receipt_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(purchase.receipt_url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Monto</p>
                      <p className="font-medium font-mono">{formatCurrency(purchase.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Método</p>
                      <p className="font-medium">{purchase.payment_method}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm">{formatDate(purchase.created)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{purchase.customer_email}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="hidden sm:block table-wrapper">
          <div className="table-scroll">
            <table className="table-responsive">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Monto</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hide-mobile">
                    Método de Pago
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hide-tablet">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <p className="text-muted-foreground">No se encontraron compras</p>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm">{formatDate(purchase.created)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{purchase.plan_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-mono">{formatCurrency(purchase.amount)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={getStatusColor(purchase.status)}>
                          {getStatusLabel(purchase.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hide-mobile">
                        <p className="text-sm">{purchase.payment_method}</p>
                      </td>
                      <td className="px-4 py-3 hide-tablet">
                        <p className="text-sm text-muted-foreground">{purchase.customer_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {purchase.receipt_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => window.open(purchase.receipt_url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ver
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Mostrando {filteredPurchases.length} compra(s)</p>
        </div>
      </CardContent>
    </Card>
  )
}
