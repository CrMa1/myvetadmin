"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ClientModal({ isOpen, onClose, onSubmit, editingClient, clientStatuses, apiError }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    statusId: "1",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (editingClient) {
      setFormData({
        firstName: editingClient.first_name || "",
        lastName: editingClient.last_name || "",
        phone: editingClient.phone || "",
        email: editingClient.email || "",
        address: editingClient.address || "",
        statusId: editingClient.status_id?.toString() || "1",
      })
      setTouched({})
      setErrors({})
    } else {
      resetForm()
    }
  }, [editingClient, isOpen])

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      statusId: "1",
    })
    setErrors({})
    setTouched({})
  }

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return !value.trim() ? "Campo requerido" : ""
      case "lastName":
        return !value.trim() ? "Campo requerido" : ""
      case "phone":
        if (!value.trim()) return "Campo requerido"
        if (!/^\d{10}$/.test(value)) return "Debe tener 10 dígitos"
        return ""
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email inválido"
        }
        return ""
      default:
        return ""
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validate on change if already touched
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}
    const requiredFields = ["firstName", "lastName", "phone"]

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    // Validate email if provided
    if (formData.email) {
      const emailError = validateField("email", formData.email)
      if (emailError) newErrors.email = emailError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
      return
    }

    onSubmit(formData, editingClient)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingClient ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {editingClient ? "Modifica los datos del cliente" : "Completa la información del nuevo cliente"}
          </p>
        </DialogHeader>

        {/* API error banner */}
        {apiError && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <p className="text-sm font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <Label htmlFor="firstName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                className={errors.firstName && touched.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && touched.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Apellidos */}
            <div>
              <Label htmlFor="lastName">
                Apellidos <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                className={errors.lastName && touched.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && touched.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="phone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                  handleInputChange("phone", value)
                }}
                onBlur={() => handleBlur("phone")}
                maxLength={10}
                placeholder="10 dígitos"
                className={errors.phone && touched.phone ? "border-red-500" : ""}
              />
              {errors.phone && touched.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="opcional"
                className={errors.email && touched.email ? "border-red-500" : ""}
              />
              {errors.email && touched.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Dirección */}
            <div className="col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
                placeholder="opcional"
              />
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="statusId">Estado</Label>
              <Select value={formData.statusId} onValueChange={(value) => handleInputChange("statusId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {clientStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary">
              {editingClient ? "Guardar Cambios" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
