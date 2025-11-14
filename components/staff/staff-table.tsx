"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import { Search, Edit, Trash2, Mail, Phone, Plus, X } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StaffTableProps {
  staff: any[]
  onAdd: (staff: any) => void
  onEdit: (staff: any) => void
  onDelete: (id: string) => void
  filterPosition: string | null
  onClearFilter: () => void
}

export function StaffTable({ staff, onAdd, onEdit, onDelete, filterPosition, onClearFilter }: StaffTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phone: "",
    license: "",
    salary: "",
  })

  const filteredStaff = useMemo(() => {
    let filtered = staff

    // Apply position filter from stats
    if (filterPosition) {
      filtered = filtered.filter((s) => s.position === filterPosition)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (member) =>
          member.firstName.toLowerCase().includes(query) ||
          member.lastName.toLowerCase().includes(query) ||
          member.position.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [staff, searchQuery, filterPosition])

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      Veterinario: "default",
      "Asistente Médico": "secondary",
      Recepcionista: "outline",
      Técnico: "secondary",
    }
    return colors[position] || "outline"
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      phone: "",
      license: "",
      salary: "",
    })
  }

  const handleAdd = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.position ||
      !formData.email ||
      !formData.phone ||
      !formData.salary
    ) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const newStaff = {
      id: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
      ...formData,
      salary: Number.parseInt(formData.salary),
      hireDate: new Date().toISOString(),
    }

    onAdd(newStaff)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClick = (staffMember: any) => {
    setSelectedStaff(staffMember)
    setFormData({
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      position: staffMember.position,
      email: staffMember.email,
      phone: staffMember.phone,
      license: staffMember.license || "",
      salary: staffMember.salary.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.position ||
      !formData.email ||
      !formData.phone ||
      !formData.salary
    ) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const updatedStaff = {
      ...selectedStaff,
      ...formData,
      salary: Number.parseInt(formData.salary),
    }

    onEdit(updatedStaff)
    setIsEditDialogOpen(false)
    resetForm()
    setSelectedStaff(null)
  }

  const handleDeleteClick = (staffMember: any) => {
    setSelectedStaff(staffMember)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedStaff) {
      onDelete(selectedStaff.id)
      setIsDeleteDialogOpen(false)
      setSelectedStaff(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Personal</CardTitle>
              <CardDescription>Todos los empleados registrados en el sistema</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {filterPosition && (
                <Button variant="outline" size="sm" onClick={onClearFilter}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtro
                </Button>
              )}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar personal..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Puesto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contacto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Licencia</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Salario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha Ingreso</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.map((member) => {
                    const hireDate = new Date(member.hireDate)
                    const yearsEmployed = Math.floor((Date.now() - hireDate.getTime()) / (365 * 24 * 60 * 60 * 1000))

                    return (
                      <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{member.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{`${member.firstName} ${member.lastName}`}</p>
                            {yearsEmployed > 0 && (
                              <p className="text-xs text-muted-foreground">{yearsEmployed} años en la clínica</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getPositionColor(member.position) as any}>{member.position}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{member.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-mono">{member.license}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">${member.salary.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">mensual</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{format(hireDate, "dd MMM yyyy", { locale: es })}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(member)}
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
          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontró personal</p>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Mostrando {filteredStaff.length} de {staff.length} empleados
            </p>
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
            setSelectedStaff(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Nuevo Empleado" : "Editar Empleado"}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Complete los datos del nuevo empleado" : "Modifique los datos del empleado"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellido <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">
                Puesto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veterinario">Veterinario</SelectItem>
                  <SelectItem value="Asistente Médico">Asistente Médico</SelectItem>
                  <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="55-1234-5678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license">Licencia Profesional</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  placeholder="Ej: VET-12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">
                  Salario Mensual <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Ej: 15000"
                />
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
                setSelectedStaff(null)
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
              ¿Está seguro que desea eliminar a{" "}
              <strong>
                {selectedStaff?.firstName} {selectedStaff?.lastName}
              </strong>
              ? Esta acción no se puede deshacer.
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
