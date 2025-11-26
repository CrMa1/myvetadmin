"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle, PackageX } from "lucide-react"
import { useRouter } from "next/navigation"

export function LowStockInventory({ data }) {
  const router = useRouter()
  const hasLowStock = data && data.length > 0
  console.log("LowStockInventory data:", data)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Inventario con Stock Bajo
            </CardTitle>
            <CardDescription>
              {hasLowStock ? "Productos que requieren reabastecimiento" : "Todos los productos tienen stock suficiente"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/inventario")}>
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!hasLowStock ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">Stock en buen estado</p>
            <p className="text-sm text-muted-foreground">No hay productos con stock bajo en este momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => {
              const stockPercentage = item.minStock > 0 ? (item.stock / item.minStock) * 100 : 100
              const isOutOfStock = item.stock === 0

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {isOutOfStock ? (
                      <PackageX className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    ) : (
                      <Package className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className={`font-medium ${isOutOfStock ? "text-destructive" : "text-orange-600"}`}>
                            {item.stock} / {item.minStock} unidades
                          </span>
                        </div>
                        <div className="w-full sm:w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOutOfStock ? "bg-destructive" : "bg-orange-500"}`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Proveedor: {item.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium">${item.price.toLocaleString()}</p>
                    <Badge variant={isOutOfStock ? "destructive" : "secondary"} className="mt-1">
                      {isOutOfStock ? "Agotado" : "Stock Bajo"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
