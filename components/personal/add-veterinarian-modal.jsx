"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAlertToast } from "@/components/ui/alert-toast"
import { useAuth } from "@/contexts/auth-context"
import { parseCurrency, formatCurrency } from "@/lib/currency"

export function AddVeterinarianModal({ open, onOpenChange, onSuccess }) {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, AlertContainer } = useAlertToast()
  const [apiError, setApiError] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    salary: "",
    license: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" })
    }
    if (apiError) setApiError("")
  }

  const handleCurrencyChange = (value) => {
    const cleanValue = parseCurrency(value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      handleInputChange("salary", cleanValue)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Campo requerido"
    if (!formData.lastName.trim()) errors.lastName = "Campo requerido"
    if (!formData.email) errors.email = "Campo requerido"
    if (!formData.phone) errors.phone = "Campo requerido"
    if (!formData.salary) errors.salary = "Campo requerido"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const userId = getUserId()
      const clinicId = getClinicId()

      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          positionId: "1", // ID 1 for Veterinarian
          userId,
          clinicId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess("Veterinario agregado exitosamente")
        setFormData({
          name: "",
          lastName: "",
          email: "",
          phone: "",
          salary: "",
          license: "",
        })
        onSuccess(result.data)
      } else {
        if (setApiError) {
          setApiError(result.error || "Error al guardar el empleado")
        } else {
          showError(result.error || "Error al guardar el empleado")
        }
      }
    } catch (error) {
      console.error("Error saving veterinarian:", error)
      showError("Error al guardar el veterinario")
    }
  }

  return (
    <>
      <AlertContainer />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Veterinario</DialogTitle>
          </DialogHeader>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
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
                />
                {formErrors.lastName && <span className="text-xs text-destructive ml-2">{formErrors.lastName}</span>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1.5 ${formErrors.email ? "border-destructive" : ""}`}
                />
                {formErrors.email && <span className="text-xs text-destructive ml-2">{formErrors.email}</span>}
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    handleInputChange("phone", value)
                  }}
                  maxLength={10}
                  className={`mt-1.5 ${formErrors.phone ? "border-destructive" : ""}`}
                />
                {formErrors.phone && <span className="text-xs text-destructive ml-2">{formErrors.phone}</span>}
              </div>

              <div>
                <Label htmlFor="salary">Salario</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    placeholder="0.00"
                    className={`pl-7 ${formErrors.salary ? "border-destructive" : ""}`}
                  />
                </div>
                {formErrors.salary && <span className="text-xs text-destructive ml-2">{formErrors.salary}</span>}
                {formData.salary && (
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.salary)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="license">Cédula Profesional</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => handleInputChange("license", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Veterinario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
