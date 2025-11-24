"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency, parseCurrency } from "@/lib/currency"

export function StaffModal({ open, onOpenChange, editingStaff, positions, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || "",
    lastName: editingStaff?.lastName || "",
    position: editingStaff?.position?.toString() || "",
    email: editingStaff?.email || "",
    phone: editingStaff?.phone || "",
    salary: editingStaff?.salary ? editingStaff.salary.toString() : "",
    license: editingStaff?.license || "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [apiError, setApiError] = useState("")

  useState(() => {
    if (editingStaff) {
      setFormData({
        name: editingStaff.name || "",
        lastName: editingStaff.lastName || "",
        position: editingStaff.position?.toString() || "",
        email: editingStaff.email || "",
        phone: editingStaff.phone || "",
        salary: editingStaff.salary ? editingStaff.salary.toString() : "",
        license: editingStaff.license || "",
      })
    } else {
      setFormData({
        name: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        salary: "",
        license: "",
      })
    }
    setFormErrors({})
    setApiError("")
  }, [editingStaff, open])

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Campo requerido"
    if (!formData.lastName.trim()) errors.lastName = "Campo requerido"
    if (!formData.position) errors.position = "Campo requerido"
    if (!formData.email) errors.email = "Campo requerido"
    if (!formData.phone) errors.phone = "Campo requerido"
    if (!formData.salary) errors.salary = "Campo requerido"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" })
    }
    if (apiError) setApiError("")
  }

  const handlePhoneChange = (value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 10)
    handleInputChange("phone", cleanValue)
  }

  const handleCurrencyChange = (value) => {
    const cleanValue = parseCurrency(value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      handleInputChange("salary", cleanValue)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit(formData, setApiError)
  }

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setFormErrors({})
      setApiError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingStaff ? "Editar Empleado" : "Agregar Nuevo Empleado"}</DialogTitle>
          {!editingStaff && <p className="text-sm text-muted-foreground">Registra la información del nuevo empleado</p>}
          {editingStaff && <p className="text-sm text-muted-foreground">Modifique los datos del empleado</p>}
        </DialogHeader>

        {apiError && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <p className="text-sm font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
                placeholder="Nombre del empleado"
              />
              {formErrors.name && <span className="text-xs text-destructive ml-2">{formErrors.name}</span>}
            </div>

            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`mt-1.5 ${formErrors.lastName ? "border-destructive" : ""}`}
                placeholder="Apellido del empleado"
              />
              {formErrors.lastName && <span className="text-xs text-destructive ml-2">{formErrors.lastName}</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="position">Puesto *</Label>
            <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
              <SelectTrigger className={`mt-1.5 ${formErrors.position ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Seleccionar puesto" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id.toString()}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.position && <span className="text-xs text-destructive ml-2">{formErrors.position}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1.5 ${formErrors.email ? "border-destructive" : ""}`}
                placeholder="correo@ejemplo.com"
              />
              {formErrors.email && <span className="text-xs text-destructive ml-2">{formErrors.email}</span>}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`mt-1.5 ${formErrors.phone ? "border-destructive" : ""}`}
                placeholder="5512345678"
                maxLength={10}
              />
              {formData.phone && (
                <p className="text-xs text-muted-foreground mt-1">{formData.phone.length}/10 caracteres</p>
              )}
              {formErrors.phone && <span className="text-xs text-destructive ml-2">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary">Salario Mensual</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  placeholder="0.00"
                  className={`pl-7 ${formErrors.salary ? "border-destructive" : ""}`}
                />
              </div>
              {formData.salary && (
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.salary)}</p>
              )}
              {formErrors.salary && <span className="text-xs text-destructive ml-2">{formErrors.salary}</span>}
            </div>

            <div>
              <Label htmlFor="license">Licencia Profesional</Label>
              <Input
                id="license"
                value={formData.license}
                onChange={(e) => handleInputChange("license", e.target.value)}
                className="mt-1.5"
                placeholder="Cédula o licencia"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : editingStaff ? "Guardar Cambios" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
