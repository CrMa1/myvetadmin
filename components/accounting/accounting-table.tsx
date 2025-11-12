"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState } from "react"
import { Search, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface AccountingTableProps {
  accounting: any[]
  onAdd: (record: any) => void
  onEdit: (record: any) => void
  onDelete: (id: string) => void
  filterType: string | null
  onClearFilter: () => void
}

export function AccountingTable({
  accounting,
  onAdd,
  onEdit,
  onDelete,
  filterType,
  onClearFilter,
}: AccountingTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    description: "",
    amount: "",
    status: "Completado",
  })

  const filteredAccounting = useMemo(() => {
    let filtered = accounting

    // Apply filter from stats
    if (filterType) {
      filtered = filtered.filter((record) => record.type === filterType)
    }

    // Filter by type dropdown
    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.category.toLowerCase().includes(query) ||
          record.description.toLowerCase().includes(query) ||
          record.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [accounting, searchQuery, typeFilter, filterType])

  const resetForm = () => {
    setFormData({
      type: "",
      category: "",
      description: "",
      amount: "",
      status: "Completado",
    })
  }

  const handleAdd = () => {
    if (!formData.type || !formData.category || !formData.description || !formData.amount) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const newRecord = {
      id: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
      ...formData,
      amount: Number.parseInt(formData.amount),
      date: new Date().toISOString(),
    }

    onAdd(newRecord)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClick = (record: any) => {
    setSelectedRecord(record)
    setFormData({
      type: record.type,
      category: record.category,
      description: record.description,
      amount: record.amount.toString(),
      status: record.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = () => {
    if (!formData.type || !formData.category || !formData.description || !formData.amount) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const updatedRecord = {
      ...selectedRecord,
      ...formData,
      amount: Number.parseInt(formData.amount),
    }

    onEdit(updatedRecord)
    setIsEditDialogOpen(false)
    resetForm()
    setSelectedRecord(null)
  }

  const handleDeleteClick = (record: any) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedRecord) {
      onDelete(selectedRecord.id)
      setIsDeleteDialogOpen(false)
      setSelectedRecord(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Registros Contables</CardTitle>
              <CardDescription>Historial de ingresos y egresos</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {filterType && (
                <Button variant="outline" size="sm" onClick={onClearFilter}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtro
                </Button>
              )}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ingreso">Ingresos</SelectItem>
                  <SelectItem value="Egreso">Egresos</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar registros..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Monto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAccounting.map((record) => {
                    const isIncome = record.type === "Ingreso"
                    const recordDate = new Date(record.date)

                    return (
                      <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{record.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isIncome ? (
                              <ArrowUpCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={isIncome ? "text-green-500" : "text-red-500"}>{record.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{record.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{record.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
                            {isIncome ? "+" : "-"}${record.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{format(recordDate, "dd MMM yyyy", { locale: es })}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={record.status === "Completado" ? "default" : "secondary"}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(record)}
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
          {filteredAccounting.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron registros</p>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Mostrando {filteredAccounting.length} de {accounting.length} registros
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                <span>
                  Ingresos: $
                  {filteredAccounting
                    .filter((r) => r.type === "Ingreso")
                    .reduce((sum, r) => sum + r.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
                <span>
                  Egresos: $
                  {filteredAccounting
                    .filter((r) => r.type === "Egreso")
                    .reduce((sum, r) => sum + r.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
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
            setSelectedRecord(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Nuevo Registro" : "Editar Registro"}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Complete los datos del nuevo registro" : "Modifique los datos del registro"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ej: Consultas"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describa el registro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Monto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Ej: 1500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedRecord(null)
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
              ¿Está seguro que desea eliminar el registro <strong>{selectedRecord?.description}</strong>? Esta acción no
              se puede deshacer.
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
