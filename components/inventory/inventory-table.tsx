"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState } from "react"
import { Search, Edit, Trash2, AlertTriangle, Package, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface InventoryTableProps {
  inventory: any[]
  onAdd: (item: any) => void
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  filterCategory: string | null
  onClearFilter: () => void
}

export function InventoryTable({
  inventory,
  onAdd,
  onEdit,
  onDelete,
  filterCategory,
  onClearFilter,
}: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    minStock: "",
    price: "",
    supplier: "",
  })

  const filteredInventory = useMemo(() => {
    let filtered = inventory

    // Apply filter from stats
    if (filterCategory === "lowStock") {
      filtered = filtered.filter((item) => item.stock <= item.minStock)
    } else if (filterCategory === "Medicamento") {
      filtered = filtered.filter((item) => item.category === "Medicamento")
    }

    // Filter by category dropdown
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.supplier.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [inventory, searchQuery, categoryFilter, filterCategory])

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Agotado", variant: "destructive" as const, alert: true }
    if (stock <= minStock) return { label: "Stock Bajo", variant: "secondary" as const, alert: true }
    return { label: "Disponible", variant: "default" as const, alert: false }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      stock: "",
      minStock: "",
      price: "",
      supplier: "",
    })
  }

  const handleAdd = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.stock ||
      !formData.minStock ||
      !formData.price ||
      !formData.supplier
    ) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const newItem = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      ...formData,
      stock: Number.parseInt(formData.stock),
      minStock: Number.parseInt(formData.minStock),
      price: Number.parseInt(formData.price),
    }

    onAdd(newItem)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClick = (item: any) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      minStock: item.minStock.toString(),
      price: item.price.toString(),
      supplier: item.supplier,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.stock ||
      !formData.minStock ||
      !formData.price ||
      !formData.supplier
    ) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const updatedItem = {
      ...selectedItem,
      ...formData,
      stock: Number.parseInt(formData.stock),
      minStock: Number.parseInt(formData.minStock),
      price: Number.parseInt(formData.price),
    }

    onEdit(updatedItem)
    setIsEditDialogOpen(false)
    resetForm()
    setSelectedItem(null)
  }

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id)
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription className="hidden sm:block">
                Medicamentos, alimentos y productos disponibles
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {filterCategory && (
                <Button variant="outline" size="sm" onClick={onClearFilter} className="w-full sm:w-auto bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtro
                </Button>
              )}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Medicamento">Medicamentos</SelectItem>
                  <SelectItem value="Alimento">Alimentos</SelectItem>
                  <SelectItem value="Producto">Productos</SelectItem>
                  <SelectItem value="Servicio">Servicios</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="table-wrapper">
            <div className="table-scroll">
              <table className="w-full hidden md:table">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Proveedor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item.stock, item.minStock)
                    const stockPercentage = (item.stock / (item.minStock * 3)) * 100

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{item.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.category === "Medicamento" && (
                                <p className="text-xs text-muted-foreground">
                                  {(item as any).medicationType} - {(item as any).dosage}
                                </p>
                              )}
                              {item.category === "Alimento" && (
                                <p className="text-xs text-muted-foreground">
                                  {(item as any).foodType} - {(item as any).weight}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{item.stock} unidades</p>
                              {stockStatus.alert && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                            </div>
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  stockPercentage > 50
                                    ? "bg-green-500"
                                    : stockPercentage > 20
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Mín: {item.minStock}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">${item.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: ${(item.stock * item.price).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{item.supplier}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(item)}
                            >
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
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            ) : (
              filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item.stock, item.minStock)
                const stockPercentage = (item.stock / (item.minStock * 3)) * 100

                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <Package className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">ID: {item.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0 ml-2">
                        {item.category}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stock:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.stock} unidades</span>
                          {stockStatus.alert && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            stockPercentage > 50
                              ? "bg-green-500"
                              : stockPercentage > 20
                                ? "bg-orange-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      <Badge variant={stockStatus.variant} className="w-full justify-center">
                        {stockStatus.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Stock Mínimo</p>
                        <p className="font-medium">{item.minStock} unidades</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Precio Unitario</p>
                        <p className="font-medium">${item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Valor Total</p>
                        <p className="font-medium text-lg">${(item.stock * item.price).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Proveedor</p>
                        <p>{item.supplier}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Stats footer - hidden on mobile when showing cards */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground hidden md:flex">
            <p>
              Mostrando {filteredInventory.length} de {inventory.length} productos
            </p>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>
                {filteredInventory.filter((item) => item.stock <= item.minStock).length} productos con stock bajo
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            resetForm()
            setSelectedItem(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Nuevo Producto" : "Editar Producto"}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Complete los datos del nuevo producto" : "Modifique los datos del producto"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Producto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Vacuna Antirrábica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medicamento">Medicamento</SelectItem>
                    <SelectItem value="Alimento">Alimento</SelectItem>
                    <SelectItem value="Producto">Producto</SelectItem>
                    <SelectItem value="Servicio">Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Actual <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Ej: 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">
                  Stock Mínimo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Ej: 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  Precio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Ej: 250"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">
                Proveedor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Ej: Farmacia Veterinaria SA"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedItem(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={isAddDialogOpen ? handleAdd : handleEdit}>
              {isAddDialogOpen ? "Agregar" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el producto <strong>{selectedItem?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
