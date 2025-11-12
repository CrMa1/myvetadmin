"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountingTable } from "@/components/accounting/accounting-table"
import { AccountingStats } from "@/components/accounting/accounting-stats"
import { AccountingChart } from "@/components/accounting/accounting-chart"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"

export default function AccountingPage() {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [accounting, setAccounting] = useState([])
  const [filteredAccounting, setFilteredAccounting] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    date: "",
  })

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId) {
      fetchAccounting()
      fetchCategories()
    }
  }, [getUserId, getClinicId])

  const fetchAccounting = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/accounting?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setAccounting(result.data)
        setFilteredAccounting(result.data)
      } else {
        showError(result.error || "Error al cargar registros")
      }
    } catch (error) {
      console.error("Error fetching accounting:", error)
      showError("Error al cargar los registros")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/conta-categories")
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
    setEditingRecord(null)
    setFormData({
      type: "",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      type: record.type || "",
      category: record.categoryId?.toString() || "",
      amount: record.amount || "",
      description: record.description || "",
      date: record.date || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return

    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/accounting?id=${id}&userId=${userId}&clinicId=${clinicId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Registro eliminado exitosamente")
        await fetchAccounting()
      } else {
        showError(result.error || "Error al eliminar el registro")
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      showError("Error al eliminar el registro")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.type || !formData.category || !formData.amount) {
      showWarning("Por favor completa todos los campos requeridos")
      return
    }

    try {
      const url = "/api/accounting"
      const method = editingRecord ? "PUT" : "POST"
      const userId = getUserId()
      const clinicId = getClinicId()
      const body = editingRecord
        ? {
            type: formData.type,
            categoryId: formData.category,
            amount: formData.amount,
            description: formData.description,
            date: formData.date,
            id: editingRecord.id,
            userId,
            clinicId,
          }
        : {
            type: formData.type,
            categoryId: formData.category,
            amount: formData.amount,
            description: formData.description,
            date: formData.date,
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
        showSuccess(editingRecord ? "Registro actualizado exitosamente" : "Registro agregado exitosamente")
        setIsDialogOpen(false)
        await fetchAccounting()
      } else {
        showError(result.error || "Error al guardar el registro")
      }
    } catch (error) {
      console.error("Error saving record:", error)
      showError("Error al guardar el registro")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilterClick = (type) => {
    setActiveFilter(type)
    if (type) {
      setFilteredAccounting(accounting.filter((a) => a.type === type))
    } else {
      setFilteredAccounting(accounting)
    }
  }

  const handleSearch = (query) => {
    const filtered = accounting.filter(
      (a) =>
        (a.category?.toLowerCase() || "").includes(query.toLowerCase()) ||
        (a.description?.toLowerCase() || "").includes(query.toLowerCase()),
    )
    setFilteredAccounting(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando registros contables..." />
  }

  const userId = getUserId()
  const clinicId = getClinicId()

  if (!userId || !clinicId) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Contabilidad</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      <AccountingStats accounting={accounting} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <AccountingChart accounting={accounting} />

      <AccountingTable
        accounting={filteredAccounting}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Editar Registro" : "Agregar Nuevo Registro"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="amount">Monto *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault()
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
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
                {editingRecord ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
