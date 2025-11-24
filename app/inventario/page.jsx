"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { StatsCard } from "@/components/shared/stats-card"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { formatCurrency, parseCurrency } from "@/lib/currency"

export default function InventoryPage() {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, showInfo, AlertContainer } = useAlertToast()
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    expiryDate: "",
    description: "",
  })

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId) {
      fetchInventory()
      fetchCategories()
    }
  }, [getUserId, getClinicId])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/inventory?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setInventory(result.data)
        setFilteredInventory(result.data)
      } else {
        showError(result.error || "Error al cargar el inventario")
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      showError("Error al cargar el inventario")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/item-categories")
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      } else {
        showWarning("No se pudieron cargar las categorías")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      supplier: "",
      expiryDate: "",
      description: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || "",
      category: item.categoryId?.toString() || "",
      quantity: item.stock || "",
      price: item.price || "",
      supplier: item.supplier || "",
      expiryDate: item.expiryDate || "",
      description: item.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/inventory?id=${id}&userId=${userId}&clinicId=${clinicId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Producto eliminado exitosamente")
        await fetchInventory()
      } else {
        showError(result.error || "Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      showError("Error al eliminar el producto")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.category || !formData.quantity) {
      showWarning("Por favor completa todos los campos requeridos")
      return
    }

    try {
      const url = "/api/inventory"
      const method = editingItem ? "PUT" : "POST"
      const userId = getUserId()
      const clinicId = getClinicId()
      const body = editingItem
        ? {
            name: formData.name,
            categoryId: formData.category,
            stock: formData.quantity,
            price: formData.price,
            supplier: formData.supplier,
            expiryDate: formData.expiryDate,
            description: formData.description,
            id: editingItem.id,
            userId,
            clinicId,
          }
        : {
            name: formData.name,
            categoryId: formData.category,
            stock: formData.quantity,
            price: formData.price,
            supplier: formData.supplier,
            expiryDate: formData.expiryDate,
            description: formData.description,
            userId,
            clinicId,
          }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(editingItem ? "Producto actualizado exitosamente" : "Producto agregado exitosamente")
        setIsDialogOpen(false)
        await fetchInventory()
      } else {
        showError(result.error || "Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error saving item:", error)
      showError("Error al guardar el producto")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    if (filter === "lowStock") {
      setFilteredInventory(inventory.filter((i) => i.stock <= (i.minStock || 10)))
    } else if (filter) {
      setFilteredInventory(inventory.filter((i) => i.category === filter))
    } else {
      setFilteredInventory(inventory)
    }
  }

  const handleSearch = (query) => {
    const filtered = inventory.filter(
      (i) =>
        (i.name?.toLowerCase() || "").includes(query.toLowerCase()) ||
        (i.category?.toLowerCase() || "").includes(query.toLowerCase()) ||
        (i.supplier?.toLowerCase() || "").includes(query.toLowerCase()),
    )
    setFilteredInventory(filtered)
  }

  const handleCurrencyChange = (value) => {
    const cleanValue = parseCurrency(value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      handleInputChange("price", cleanValue)
    }
  }

  if (loading) {
    return <LoadingPage message="Cargando inventario..." />
  }

  const userId = getUserId()
  const clinicId = getClinicId()

  if (!userId || !clinicId) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  const totalItems = inventory.length
  const lowStockItems = inventory.filter((i) => i.stock <= (i.minStock || 10)).length
  const totalValue = inventory.reduce((sum, item) => sum + (Number.parseFloat(item.price) || 0) * (item.stock || 0), 0)
  const avgItemValue = totalItems > 0 ? totalValue / totalItems : 0

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          label="Total de Productos"
          subtitle="Artículos en stock"
          value={totalItems}
          icon={Package}
          trend={{ value: 0, isPositive: true }}
          onClick={() => handleFilterClick(null)}
          isActive={activeFilter === null}
        />
        <StatsCard
          label="Stock Bajo"
          subtitle="Requieren reabastecimiento"
          value={lowStockItems}
          icon={AlertTriangle}
          trend={{ value: 0, isPositive: false }}
          onClick={() => handleFilterClick("lowStock")}
          isActive={activeFilter === "lowStock"}
          variant="warning"
        />
        <StatsCard
          label="Valor Total"
          subtitle="Inventario valorizado"
          value={formatCurrency(totalValue)}
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          label="Valor Promedio"
          subtitle="Por artículo"
          value={formatCurrency(avgItemValue)}
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <InventoryTable
        inventory={filteredInventory}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault()
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Precio</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
                {formData.price && (
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.price)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                {editingItem ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
