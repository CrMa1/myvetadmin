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
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
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
  }

  const handleCurrencyChange = (value) => {
    const cleanValue = parseCurrency(value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      handleInputChange("salary", cleanValue)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.lastName) {
      showWarning("Por favor completa nombre y apellido")
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
        showError(result.error || "Error al guardar el veterinario")
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

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vet-name">Nombre *</Label>
                <Input
                  id="vet-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vet-lastName">Apellido *</Label>
                <Input
                  id="vet-lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vet-email">Email</Label>
                <Input
                  id="vet-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="vet-phone">Teléfono</Label>
                <Input
                  id="vet-phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    handleInputChange("phone", value)
                  }}
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="vet-salary">Salario</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="vet-salary"
                    value={formData.salary}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
                {formData.salary && (
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.salary)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="vet-license">Cédula Profesional</Label>
                <Input
                  id="vet-license"
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
