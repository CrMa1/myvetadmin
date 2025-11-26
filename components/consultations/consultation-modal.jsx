"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddVeterinarianModal } from "@/components/personal/add-veterinarian-modal"
import { AddPatientModal } from "@/components/patients/add-patient-modal"

export function ConsultationModal({
  open,
  onOpenChange,
  consultation = null,
  clients = [],
  clientPatients = [],
  staff = [],
  onSubmit,
  onClientSelect,
  onPatientAdded,
  onVetAdded,
  onRefreshClients,
  onRefreshStaff,
}) {
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    clientId: "",
    date: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    veterinarianId: null,
    cost: "",
    status: "Programada",
  })
  const [formErrors, setFormErrors] = useState({})
  const [formApiError, setFormApiError] = useState("")

  // Load consultation data when editing
  useEffect(() => {
    if (consultation) {
      const clientIdStr = consultation.clientId ? consultation.clientId.toString() : ""
      const patientIdStr = consultation.patientId ? consultation.patientId.toString() : ""

      setFormData({
        patientId: patientIdStr,
        clientId: clientIdStr,
        date: consultation.date ? new Date(consultation.date).toISOString().split("T")[0] : "",
        reason: consultation.reason || "",
        diagnosis: consultation.diagnosis || "",
        treatment: consultation.treatment || "",
        notes: consultation.notes || "",
        veterinarianId: consultation.veterinarianId || null,
        cost: consultation.cost || "",
        status: consultation.status || "Programada",
      })
    } else {
      resetForm()
    }
    setFormErrors({})
    setFormApiError("")
  }, [consultation, open])

  const resetForm = () => {
    setFormData({
      patientId: "",
      clientId: "",
      date: "",
      reason: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      veterinarianId: null,
      cost: "",
      status: "Programada",
    })
    setFormErrors({})
    setFormApiError("")
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" })
    }
    if (formApiError) {
      setFormApiError("")
    }
  }

  const handleClientSelect = (value) => {
    setFormData({ ...formData, clientId: value, patientId: "" })
    if (formErrors.clientId) {
      setFormErrors({ ...formErrors, clientId: "" })
    }
    if (onClientSelect) {
      onClientSelect(value)
    }
  }

  const handlePatientSelect = (value) => {
    setFormData({ ...formData, patientId: value })
    if (formErrors.patientId) {
      setFormErrors({ ...formErrors, patientId: "" })
    }
  }

  const handleCurrencyChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    const parts = value.split(".")
    if (parts.length > 2) return

    if (parts[1] && parts[1].length > 2) return

    handleInputChange("cost", value)
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.clientId) {
      errors.clientId = "Campo requerido"
    }
    if (!formData.patientId) {
      errors.patientId = "Campo requerido"
    }
    if (!formData.date) {
      errors.date = "Campo requerido"
    }
    if (!formData.reason || formData.reason.trim() === "") {
      errors.reason = "Campo requerido"
    }
    if (!formData.veterinarianId || formData.veterinarianId.trim() === "") {
      errors.veterinarianId = "Campo requerido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData, consultation)
      resetForm()
    } catch (error) {
      if (error.message) {
        setFormApiError(error.message)
      }
    }
  }

  const handlePatientAddedInternal = async (newPatient) => {
    // Refresh clients in case a new client was added from patient modal
    if (onRefreshClients) {
      await onRefreshClients()
    }

    if (onPatientAdded) {
      await onPatientAdded(newPatient)
    }

    setFormData({
      ...formData,
      clientId: newPatient.client_id?.toString() || newPatient.clientId?.toString(),
      patientId: newPatient.id.toString(),
    })
    setIsPatientDialogOpen(false)
  }

  const handleVetAddedInternal = async (newVet) => {
    if (onRefreshStaff) {
      await onRefreshStaff()
    }

    if (onVetAdded) {
      await onVetAdded(newVet)
    }

    setFormData({ ...formData, veterinarianId: newVet.id.toString() })
    setIsVetDialogOpen(false)
  }

  const handleCloseDialog = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {consultation ? "Editar Consulta" : "Nueva Consulta"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {consultation ? "Modifica los detalles de la consulta" : "Registra una nueva consulta veterinaria"}
            </p>
          </DialogHeader>

          {formApiError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              <p className="text-sm font-medium">{formApiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              <div className="col-span-2">
                <Label htmlFor="client">Cliente (Dueño) *</Label>
                <Select value={formData.clientId} onValueChange={handleClientSelect}>
                  <SelectTrigger className={formErrors.clientId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.clientId && <p className="text-sm text-destructive mt-1">{formErrors.clientId}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="patient">Paciente *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.patientId?.toString()}
                    onValueChange={handlePatientSelect}
                    disabled={!formData.clientId}
                  >
                    <SelectTrigger className={formErrors.patientId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name} - {patient.species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPatientDialogOpen(true)}
                    className="whitespace-nowrap"
                  >
                    Agregar
                  </Button>
                </div>
                {formErrors.patientId && <p className="text-sm text-destructive mt-1">{formErrors.patientId}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="veterinarian">Veterinario</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.veterinarianId?.toString()}
                    onValueChange={(value) => {
                      if (value === "none") {
                        setFormData({ ...formData, veterinarianId: null })
                        return
                      }
                      setFormData({ ...formData, veterinarianId: value })
                    }}
                  >
                    <SelectTrigger className={formErrors.veterinarianId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccionar veterinario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      {staff.map((vet) => (
                        <SelectItem key={vet.id} value={vet.id.toString()}>
                          {vet.name} {vet.lastName} - {vet.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVetDialogOpen(true)}
                    className="whitespace-nowrap"
                  >
                    Agregar
                  </Button>
                </div>
                {formErrors.veterinarianId && <p className="text-sm text-destructive mt-1">{formErrors.veterinarianId}</p>}
              </div>

              <div>
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={formErrors.date ? "border-destructive" : ""}
                />
                {formErrors.date && <p className="text-sm text-destructive mt-1">{formErrors.date}</p>}
              </div>

              <div>
                <Label htmlFor="status">Estatus *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programada">Programada</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="cost">Costo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="cost"
                    name="cost"
                    type="text"
                    value={formData.cost}
                    onChange={handleCurrencyChange}
                    className="pl-6"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <Label htmlFor="reason">Motivo de la Consulta *</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className={`min-h-[100px] ${formErrors.reason ? "border-destructive" : ""}`}
                />
                {formErrors.reason && <p className="text-sm text-destructive mt-1">{formErrors.reason}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="treatment">Tratamiento</Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={(e) => handleInputChange("treatment", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">{consultation ? "Actualizar" : "Guardar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AddVeterinarianModal
        open={isVetDialogOpen}
        onOpenChange={setIsVetDialogOpen}
        onSuccess={handleVetAddedInternal}
      />

      <AddPatientModal
        open={isPatientDialogOpen}
        onOpenChange={setIsPatientDialogOpen}
        onPatientAdded={handlePatientAddedInternal}
        preSelectedClientId={formData.clientId}
        onClientAddedInParent={onRefreshClients}
      />
    </>
  )
}
