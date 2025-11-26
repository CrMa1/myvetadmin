"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/currency"

export function InventoryTable({ inventory, onEdit, onDelete, onSearch, filterCategory, onClearFilter }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id)
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Medicamento: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      Alimento: "bg-green-500/10 text-green-700 dark:text-green-400",
      Producto: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      Servicio: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    }
    return colors[category] || "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }

  const getStockStatus = (stock, minStock) => {
    const stockNum = stock || 0
    const minStockNum = minStock || 10

    if (stockNum <= minStockNum) {
      return { label: "Stock Bajo", variant: "destructive" }
    }
    if (stockNum <= minStockNum * 2) {
      return { label: "Stock Medio", variant: "warning" }
    }
    return { label: "Stock Normal", variant: "success" }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.supplier?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Lista de Productos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Medicamentos, alimentos y productos disponibles
              </CardDescription>
            </div>
            <div className="search-input-wrapper">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="sm:hidden space-y-4">
            {filteredInventory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No se encontraron productos</p>
            ) : (
              filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item.stock, item.minStock)
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="outline" className={`${getCategoryColor(item.category)} mt-1`}>
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Stock</p>
                          <p className="font-medium font-mono">{item.stock || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Mín. Stock</p>
                          <p className="font-medium font-mono">{item.minStock || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Precio</p>
                          <p className="font-medium font-mono">{formatCurrency(item.price || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Estado</p>
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Proveedor</p>
                        <p className="text-sm">{item.supplier}</p>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          <div className="hidden sm:block table-wrapper">
            <div className="table-scroll">
              <table className="table-responsive">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hide-tablet">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hide-mobile">
                      Mín. Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hide-tablet">
                      Proveedor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <p className="text-muted-foreground">No se encontraron productos</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item.stock, item.minStock)
                      return (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono text-muted-foreground hide-tablet">{item.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-sm">{item.name}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-mono">{item.stock || 0}</p>
                          </td>
                          <td className="px-4 py-3 hide-mobile">
                            <p className="text-sm font-mono text-muted-foreground">{item.minStock || 0}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-mono">{formatCurrency(item.price || 0)}</p>
                          </td>
                          <td className="px-4 py-3 hide-tablet">
                            <p className="text-sm text-muted-foreground">{item.supplier}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Mostrando {filteredInventory.length} producto(s)</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="modal-content max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el producto <strong>{selectedItem?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} className="w-full sm:w-auto">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
