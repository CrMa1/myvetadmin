"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { Plus } from "lucide-react"
import { AddClientModal } from "@/components/clients/add-client-modal"
import { useAlertToast } from "@/components/ui/alert-toast"

export function AddPatientModal({
  open,
  onOpenChange,
  onSuccess,
  patient = null,
  preSelectedClientId = null,
  onClientAddedInParent,
}) {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning } = useAlertToast()
  const [clients, setClients] = useState([])
  const [species, setSpecies] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    sex: "",
    clientId: preSelectedClientId || "",
    color: "",
    medicalHistory: "",
    allergies: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [apiError, setApiError] = useState("")

  const isEditMode = !!patient

  useEffect(() => {
    if (open) {
      fetchClients()
      fetchSpecies()

      if (patient) {
        // Editing mode - load patient data
        setFormData({
          name: patient.name || "",
          species: patient.species_id?.toString() || "",
          breed: patient.breed || "",
          age: patient.age || "",
          weight: patient.weight || "",
          sex: patient.sex || "",
          clientId: patient.client_id?.toString() || "",
          color: patient.color || "",
          medicalHistory: patient.medical_history || "",
          allergies: patient.allergies || "",
        })
      } else if (preSelectedClientId) {
        // Adding mode with preselected client
        setFormData((prev) => ({ ...prev, clientId: preSelectedClientId.toString() }))
      }
      setApiError("")
    } else {
      // Reset form when dialog closes
      resetForm()
    }
  }, [open, patient, preSelectedClientId])

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      sex: "",
      clientId: preSelectedClientId || "",
      color: "",
      medicalHistory: "",
      allergies: "",
    })
    setFormErrors({})
    setApiError("")
  }

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/clients?userId=${getUserId()}&clinicId=${getClinicId()}`)
      const result = await response.json()
      if (result.success) {
        setClients(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchSpecies = async () => {
    try {
      const response = await fetch("/api/species")
      const result = await response.json()
      if (result.success) {
        setSpecies(result.data)
      }
    } catch (error) {
      console.error("Error fetching species:", error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) setApiError("")
  }

  const handleClientAdded = async (newClient) => {
    setClients((prev) => [...prev, newClient])
    handleInputChange("clientId", newClient.id.toString())
    setIsClientDialogOpen(false)

    // Notify parent (ConsultationModal) to refresh its clients list
    if (onClientAddedInParent) {
      await onClientAddedInParent()
    }
  }

  const validateForm = () => {
    const errors = {}

    // Required fields
    if (!formData.name.trim()) errors.name = "Campo requerido"
    if (!formData.clientId) errors.clientId = "Campo requerido"
    if (!formData.species) errors.species = "Campo requerido"
    if (!formData.breed?.trim()) errors.breed = "Campo requerido"
    if (!formData.color?.trim()) errors.color = "Campo requerido"
    if (!formData.age) errors.age = "Campo requerido"
    if (!formData.weight) errors.weight = "Campo requerido"
    if (!formData.sex) errors.sex = "Campo requerido"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showWarning("Por favor completa todos los campos requeridos")
      return
    }

    try {
      setIsSubmitting(true)
      const url = "/api/patients"
      const method = isEditMode ? "PUT" : "POST"

      const body = {
        userId: getUserId(),
        clinicId: getClinicId(),
        clientId: formData.clientId,
        name: formData.name,
        speciesId: formData.species,
        breed: formData.breed,
        age: formData.age ? Number.parseFloat(formData.age) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        sex: formData.sex,
        color: formData.color,
        medicalHistory: formData.medicalHistory,
        allergies: formData.allergies,
      }

      if (isEditMode) {
        body.id = patient.id
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(isEditMode ? "Paciente actualizado exitosamente" : "Paciente agregado exitosamente")
        resetForm()
        onOpenChange(false)
        if (onSuccess) {
          onSuccess(result.data)
        }
      } else {
        setApiError(result.error || "Error al guardar el paciente")
      }
    } catch (error) {
      console.error("Error saving patient:", error)
      setApiError("Error al guardar el paciente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{isEditMode ? "Editar Paciente" : "Agregar Nueva Mascota"}</DialogTitle>
            {!isEditMode && <p className="text-sm text-muted-foreground mt-1">Completa la información del paciente</p>}
          </DialogHeader>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información del Dueño</h3>
              <div>
                <Label htmlFor="clientId">
                  Dueño (Cliente) <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                    <SelectTrigger className={formErrors.clientId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.first_name} {client.last_name} - {client.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => setIsClientDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo
                  </Button>
                </div>
                {formErrors.clientId && <p className="text-xs text-destructive mt-1">{formErrors.clientId}</p>}
              </div>
            </div>

            {/* Patient Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información del Paciente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Nombre del Paciente <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
                    placeholder="Ej: Max"
                  />
                  {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="species">
                    Especie <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                    <SelectTrigger className={`mt-1.5 ${formErrors.species ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Seleccionar especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id.toString()}>
                          {sp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.species && <p className="text-xs text-destructive mt-1">{formErrors.species}</p>}
                </div>

                <div>
                  <Label htmlFor="breed">
                    Raza <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    className={`mt-1.5 ${formErrors.breed ? "border-destructive" : ""}`}
                    placeholder="Ej: Labrador"
                  />
                  {formErrors.breed && <p className="text-xs text-destructive mt-1">{formErrors.breed}</p>}
                </div>

                <div>
                  <Label htmlFor="color">
                    Color <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className={`mt-1.5 ${formErrors.color ? "border-destructive" : ""}`}
                    placeholder="Ej: Café"
                  />
                  {formErrors.color && <p className="text-xs text-destructive mt-1">{formErrors.color}</p>}
                </div>

                <div>
                  <Label htmlFor="age">
                    Edad (años) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={`mt-1.5 ${formErrors.age ? "border-destructive" : ""}`}
                    placeholder="Ej: 3"
                  />
                  {formErrors.age && <p className="text-xs text-destructive mt-1">{formErrors.age}</p>}
                </div>

                <div>
                  <Label htmlFor="weight">
                    Peso (kg) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className={`mt-1.5 ${formErrors.weight ? "border-destructive" : ""}`}
                    placeholder="Ej: 25.5"
                  />
                  {formErrors.weight && <p className="text-xs text-destructive mt-1">{formErrors.weight}</p>}
                </div>

                <div>
                  <Label htmlFor="sex">
                    Sexo <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                    <SelectTrigger className={`mt-1.5 ${formErrors.sex ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.sex && <p className="text-xs text-destructive mt-1">{formErrors.sex}</p>}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Médica</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicalHistory">Historial Médico</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                    rows={3}
                    className="mt-1.5"
                    placeholder="Vacunas, cirugías previas, condiciones médicas..."
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    rows={2}
                    className="mt-1.5"
                    placeholder="Alergias conocidas, medicamentos contraindicados..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : isEditMode ? "Actualizar Paciente" : "Guardar Mascota"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddClientModal
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onClientAdded={handleClientAdded}
      />
    </>
  )
}
