"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState } from "react"
import { Search, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, X } from "lucide-react"
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

export function AccountingTable({ accounting, onAdd, onEdit, onDelete, filterType, onClearFilter }) {
  console.log("Accounting data:", accounting)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredAccounting = useMemo(() => {
    let filtered = accounting

    if (filterType) {
      filtered = filtered.filter((record) => record.type === filterType)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter)
    }

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

  const handleEditClick = (record) => {
    onEdit(record)
  }

  const handleDeleteClick = (record) => {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Registros Contables</CardTitle>
              <CardDescription className="text-sm">Historial de ingresos y egresos</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {filterType && (
                <Button variant="outline" size="sm" onClick={onClearFilter} className="w-full sm:w-auto bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtro
                </Button>
              )}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ingreso">Ingresos</SelectItem>
                  <SelectItem value="Egreso">Egresos</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar registros..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block table-wrapper">
            <div className="table-scroll">
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

          <div className="md:hidden space-y-4">
            {filteredAccounting.map((record) => {
              const isIncome = record.type === "Ingreso"
              const recordDate = new Date(record.date)

              return (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isIncome ? (
                            <ArrowUpCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <div>
                            <p className={`font-semibold ${isIncome ? "text-green-500" : "text-red-500"}`}>
                              {record.type}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{record.id}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{record.category}</Badge>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Descripción</p>
                        <p className="font-medium">{record.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Monto</p>
                          <p className={`text-lg font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
                            {isIncome ? "+" : "-"}${record.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fecha</p>
                          <p className="text-sm font-medium">{format(recordDate, "dd MMM yyyy", { locale: es })}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant={record.status === "Completado" ? "default" : "secondary"}>
                          {record.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(record)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive bg-transparent"
                            onClick={() => handleDeleteClick(record)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredAccounting.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron registros</p>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Mostrando {filteredAccounting.length} de {accounting.length} registros
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
