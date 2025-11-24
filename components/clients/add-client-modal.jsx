"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useAlertToast } from "@/components/ui/alert-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AddClientModal({ open, onOpenChange, onClientAdded }) {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning } = useAlertToast()
  const [newClientData, setNewClientData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setNewClientData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
      })
      setFormErrors({})
      setApiError("")
    }
  }, [open])

  const handleInputChange = (field, value) => {
    setNewClientData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) {
      setApiError("")
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!newClientData.firstName.trim()) {
      errors.firstName = "Campo requerido"
    }

    if (!newClientData.lastName.trim()) {
      errors.lastName = "Campo requerido"
    }

    if (!newClientData.phone.trim()) {
      errors.phone = "Campo requerido"
    } else if (!/^\d{10}$/.test(newClientData.phone)) {
      errors.phone = "Debe tener 10 dígitos"
    }

    if (newClientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClientData.email)) {
      errors.email = "Email inválido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveNewClient = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showWarning("Por favor completa todos los campos requeridos correctamente")
      return
    }

    try {
      setIsSubmitting(true)
      setApiError("")

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newClientData,
          userId: getUserId(),
          clinicId: getClinicId(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess("Cliente agregado exitosamente")

        if (onClientAdded) {
          onClientAdded({
            id: result.data.id,
            first_name: newClientData.firstName,
            last_name: newClientData.lastName,
            phone: newClientData.phone,
            email: newClientData.email,
            address: newClientData.address,
          })
        }

        onOpenChange(false)
      } else {
        setApiError(result.error || "Error al guardar el cliente")
        showError(result.error || "Error al guardar el cliente")
      }
    } catch (error) {
      console.error("Error saving client:", error)
      setApiError("Error de conexión. Por favor intenta de nuevo.")
      showError("Error al guardar el cliente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Completa la información del nuevo cliente</p>
        </DialogHeader>

        <form onSubmit={handleSaveNewClient} className="grid gap-4">
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="clientName">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientName"
              value={newClientData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={formErrors.firstName ? "border-destructive" : ""}
            />
            {formErrors.firstName && <p className="text-xs text-destructive mt-1">{formErrors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="clientLastName">
              Apellidos <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientLastName"
              value={newClientData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={formErrors.lastName ? "border-destructive" : ""}
            />
            {formErrors.lastName && <p className="text-xs text-destructive mt-1">{formErrors.lastName}</p>}
          </div>

          <div>
            <Label htmlFor="clientPhone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientPhone"
              value={newClientData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                handleInputChange("phone", value)
              }}
              placeholder="10 dígitos"
              maxLength={10}
              className={formErrors.phone ? "border-destructive" : ""}
            />
            {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={newClientData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="opcional"
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <Label htmlFor="clientAddress">Dirección</Label>
            <Textarea
              id="clientAddress"
              value={newClientData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
              placeholder="opcional"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
