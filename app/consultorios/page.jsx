"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { PlanLimitModal } from "@/components/modals/plan-limit-modal"

export default function ClinicsPage() {
  const { user, selectedClinic, selectClinic, getUserId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClinic, setEditingClinic] = useState(null)
  const [apiError, setApiError] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    postalCode: "",
    description: "",
  })
  const [planLimitInfo, setPlanLimitInfo] = useState(null)
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false)

  useEffect(() => {
    const userId = getUserId()
    if (userId) {
      fetchClinics()
    }
  }, [getUserId])

  const fetchClinics = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch(`/api/clinics?userId=${userId}`)
      const result = await response.json()

      if (result.success) {
        setClinics(result.data)
      } else {
        showError(result.error || "Error al cargar consultorios")
      }
    } catch (error) {
      console.error("Error fetching clinics:", error)
      showError("Error al cargar los consultorios")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingClinic(null)
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      postalCode: "",
      description: "",
    })
    setFormErrors({})
    setApiError("")
    setIsDialogOpen(true)
  }

  const handleEdit = (clinic) => {
    setEditingClinic(clinic)
    setFormData({
      name: clinic.name || "",
      address: clinic.address || "",
      phone: clinic.phone || "",
      email: clinic.email || "",
      city: clinic.city || "",
      state: clinic.state || "",
      postalCode: clinic.postal_code || "",
      description: clinic.description || "",
    })
    setFormErrors({})
    setApiError("")
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este consultorio?")) return

    try {
      const userId = getUserId()
      const response = await fetch(`/api/clinics?id=${id}&userId=${userId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Consultorio eliminado exitosamente")
        await fetchClinics()
        if (selectedClinic && selectedClinic.id === id) {
          localStorage.removeItem("selectedClinic")
          window.location.href = "/seleccionar-consultorio"
        }
      } else {
        showError(result.error || "Error al eliminar el consultorio")
      }
    } catch (error) {
      console.error("Error deleting clinic:", error)
      showError("Error al eliminar el consultorio")
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Campo requerido"
    if (!formData.address.trim()) errors.address = "Campo requerido"
    if (!formData.phone.trim()) errors.phone = "Campo requerido"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const url = "/api/clinics"
      const method = editingClinic ? "PUT" : "POST"
      const userId = getUserId()
      const body = editingClinic ? { ...formData, id: editingClinic.id, userId } : { ...formData, userId }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(editingClinic ? "Consultorio actualizado exitosamente" : "Consultorio agregado exitosamente")
        setIsDialogOpen(false)
        await fetchClinics()
      } else {
        if (result.limitExceeded) {
          setPlanLimitInfo(result.limitInfo)
          setShowPlanLimitModal(true)
          setIsDialogOpen(false)
        } else {
          setApiError(result.error || "Error al guardar el consultorio")
        }
      }
    } catch (error) {
      console.error("Error saving clinic:", error)
      setApiError("Error al guardar el consultorio")
    }
  }

  const handleSelectClinic = (clinic) => {
    selectClinic(clinic)
    showSuccess(`Consultorio "${clinic.name}" seleccionado`)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) setApiError("")
  }

  if (loading) {
    return <LoadingPage message="Cargando consultorios..." />
  }

  if (!getUserId()) {
    return <div className="page-container">Por favor inicia sesión</div>
  }

  return (
    <div className="page-container">
      <AlertContainer />
      <div className="page-header">
        <h1 className="page-title">Mis Consultorios</h1>
        <Button onClick={handleAdd} className="btn-primary w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Consultorio
        </Button>
      </div>

      <div className="card-grid">
        {clinics.length === 0 ? (
          <Card className="col-span-full p-6 sm:p-8 text-center">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No tienes consultorios registrados</p>
            <Button onClick={handleAdd} className="mt-4">
              Agregar tu primer consultorio
            </Button>
          </Card>
        ) : (
          clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className={`p-4 sm:p-6 hover:shadow-lg transition-shadow ${
                selectedClinic && selectedClinic.id === clinic.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{clinic.name}</h3>
                    {selectedClinic && selectedClinic.id === clinic.id && (
                      <span className="text-xs text-primary font-medium">Activo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs sm:text-sm text-muted-foreground">
                <p>
                  <strong>Dirección:</strong> {clinic.address}
                </p>
                <p>
                  <strong>Teléfono:</strong> {clinic.phone}
                </p>
                {clinic.email && (
                  <p className="hidden sm:block">
                    <strong>Email:</strong> {clinic.email}
                  </p>
                )}
                {clinic.city && (
                  <p>
                    <strong>Ciudad:</strong> {clinic.city}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(!selectedClinic || selectedClinic.id !== clinic.id) && (
                  <Button onClick={() => handleSelectClinic(clinic)} className="flex-1" variant="outline" size="sm">
                    Seleccionar
                  </Button>
                )}
                <Button onClick={() => handleEdit(clinic)} variant="outline" size="icon" className="h-9 w-9">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDelete(clinic.id)} variant="outline" size="icon" className="h-9 w-9">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <DialogTitle>{editingClinic ? "Editar Consultorio" : "Agregar Nuevo Consultorio"}</DialogTitle>
          </DialogHeader>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="name">
                Nombre del Consultorio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Clínica Veterinaria San Francisco"
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="address">
                Dirección Completa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Calle, número, colonia"
                rows={2}
                className={formErrors.address ? "border-red-500" : ""}
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>

            <div className="form-grid">
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ciudad"
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Estado"
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="12345"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault()
                  }}
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contacto@clinica.com"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                placeholder="Breve descripción del consultorio..."
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary w-full sm:w-auto">
                {editingClinic ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PlanLimitModal
        isOpen={showPlanLimitModal}
        onClose={() => setShowPlanLimitModal(false)}
        limitInfo={planLimitInfo}
      />
    </div>
  )
}
