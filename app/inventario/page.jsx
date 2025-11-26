"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryForm } from "@/components/inventory/inventory-form"
import { StatsCard } from "@/components/shared/stats-card"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

export default function InventoryPage() {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, showInfo, AlertContainer } = useAlertToast()
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)

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
    setIsFormOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
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

  const handleSave = async (itemData) => {
    try {
      const url = "/api/inventory"
      const method = editingItem ? "PUT" : "POST"
      const userId = getUserId()
      const clinicId = getClinicId()

      const body = editingItem
        ? {
            ...itemData,
            id: editingItem.id,
            userId,
            clinicId,
          }
        : {
            ...itemData,
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
        setIsFormOpen(false)
        setEditingItem(null)
        await fetchInventory()
      } else {
        showError(result.error || "Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error saving item:", error)
      showError("Error al guardar el producto")
    }
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

  if (loading) {
    return <LoadingPage message="Cargando inventario..." />
  }

  const userId = getUserId()
  const clinicId = getClinicId()

  if (!userId || !clinicId) {
    return <div className="page-container">Por favor selecciona un consultorio</div>
  }

  const totalItems = inventory.length
  const lowStockItems = inventory.filter((i) => i.stock <= (i.minStock || 10)).length
  const totalValue = inventory.reduce((sum, item) => sum + (Number.parseFloat(item.price) || 0) * (item.stock || 0), 0)
  const avgItemValue = totalItems > 0 ? totalValue / totalItems : 0

  return (
    <div className="page-container">
      <AlertContainer />
      <div className="page-header">
        <h1 className="page-title">Inventario</h1>
        <Button onClick={handleAdd} className="btn-primary w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="stats-grid">
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterCategory={activeFilter}
        onClearFilter={() => setActiveFilter(null)}
      />

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        item={editingItem}
        categories={categories}
      />
    </div>
  )
}
