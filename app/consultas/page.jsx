"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { ConsultationStats } from "@/components/consultations/consultation-stats"
import { AddVeterinarianModal } from "@/components/personal/add-veterinarian-modal"
import { AddPatientModal } from "@/components/patients/add-patient-modal"
import { formatCurrency, parseCurrency } from "@/lib/currency"

export default function ConsultasPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [consultations, setConsultations] = useState([])
  const [patients, setPatients] = useState([]) // Adding missing state for patients
  const [staff, setStaff] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
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
  const [clients, setClients] = useState([])
  const [clientPatients, setClientPatients] = useState([])
  const [species, setSpecies] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [formApiError, setFormApiError] = useState("")

  useEffect(() => {
    if (user && selectedClinic) {
      fetchConsultations()
      fetchClients()
      fetchStaff()
      fetchSpecies()
      fetchPatients()
    }
  }, [user, selectedClinic])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/consultations?userId=${userId}&clinicId=${clinicId}`)
      const data = await response.json()
      if (data.success) {
        setConsultations(data.data || [])
      } else {
        showError(data.error || "Error al cargar consultas")
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
      showError("Error al cargar las consultas")
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      console.log("[v0] Fetching patients...")
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) {
        console.log("[v0] Missing userId or clinicId")
        return
      }

      console.log("[v0] Request params:", { userId, clinicId })
      const response = await fetch(`/api/patients?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()
      console.log("[v0] Patients API response:", result)

      if (result.success) {
        console.log("[v0] Patients loaded successfully:", result.data.length)
        setPatients(result.data || [])
      } else {
        console.log("[v0] API returned error:", result.error)
        showWarning("No se pudieron cargar los pacientes")
      }
    } catch (error) {
      console.error("[v0] Error fetching patients:", error)
      showWarning("Error al cargar los pacientes")
    }
  }

  const fetchStaff = async () => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/staff?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()
      if (result.success) {
        const veterinarians = result.data.filter((s) => s.position && s.position.toLowerCase().includes("veterinari"))
        setStaff(veterinarians)
      } else {
        showWarning("No se pudieron cargar los veterinarios")
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
    }
  }

  const fetchClients = async () => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/clients?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()
      if (result.success) {
        setClients(result.data || [])
      } else {
        showWarning("No se pudieron cargar los clientes")
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
      } else {
        showWarning("No se pudieron cargar las especies")
      }
    } catch (error) {
      console.error("Error fetching species:", error)
    }
  }

  const fetchClientPatients = async (clientId) => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/patients?userId=${userId}&clinicId=${clinicId}&clientId=${clientId}`)
      const result = await response.json()
      if (result.success) {
        setClientPatients(result.data || [])
      } else {
        showWarning("No se pudieron cargar los pacientes de este cliente")
        setClientPatients([])
      }
    } catch (error) {
      console.error("Error fetching client patients:", error)
      setClientPatients([])
    }
  }

  useEffect(() => {
    filterConsultations()
  }, [consultations, searchQuery, activeFilter])

  const filterConsultations = () => {
    let filtered = [...consultations]

    if (activeFilter) {
      filtered = filtered.filter((c) => c.status === activeFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.veterinarian?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredConsultations(filtered)
  }

  const handleFilterClick = (status) => {
    setActiveFilter(status)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.clientId) errors.clientId = "El cliente es requerido"
    if (!formData.patientId) errors.patientId = "El paciente es requerido"
    if (!formData.veterinarianId) errors.veterinarianId = "El veterinario es requerido"
    if (!formData.date) errors.date = "La fecha es requerida"
    if (!formData.reason.trim()) errors.reason = "El motivo de la consulta es requerido"
    if (!formData.status) errors.status = "El estatus es requerido"
    if (!formData.cost) errors.cost = "El costo es requerido"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      //showWarning("Por favor completa todos los campos obligatorios")
      return
    }

    const userId = getUserId()
    const clinicId = getClinicId()

    const method = editingConsultation ? "PUT" : "POST"
    const body = editingConsultation
      ? { ...formData, id: editingConsultation.id, userId, clinicId }
      : { ...formData, userId, clinicId }

    try {
      const response = await fetch("/api/consultations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      if (result.success) {
        showSuccess(editingConsultation ? "Consulta actualizada exitosamente" : "Consulta registrada exitosamente")
        fetchConsultations()
        handleCloseDialog()
      } else {
        setFormApiError(result.error || "Error al guardar consulta")
      }
    } catch (error) {
      console.error("Error saving consultation:", error)
      setFormApiError("Error al guardar consulta")
    }
  }

  const handleDeleteClick = (consultation) => {
    setSelectedConsultation(consultation)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedConsultation) return

    const userId = getUserId()
    const clinicId = getClinicId()

    const response = await fetch(
      `/api/consultations?id=${selectedConsultation.id}&userId=${userId}&clinicId=${clinicId}`,
      {
        method: "DELETE",
      },
    )
    const result = await response.json()

    if (result.success) {
      showSuccess("Consulta eliminada exitosamente")
      fetchConsultations()
      setIsDeleteDialogOpen(false)
      setSelectedConsultation(null)
    } else {
      showError("Error al eliminar la consulta")
    }
  }

  const handleEdit = (consultation) => {
    console.log("Editing consultation:", consultation)
    setEditingConsultation(consultation)
    const clientIdStr = consultation.clientId ? consultation.clientId.toString() : ""
    const patientIdStr = consultation.patientId ? consultation.patientId.toString() : ""

    setFormData({
      ...formData,
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

    // Load the client's patients when editing
    if (clientIdStr) {
      fetchClientPatients(clientIdStr)
    }
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingConsultation(null)
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

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c.id === Number.parseInt(clientId))
    if (client) {
      setFormData({
        ...formData,
        clientId: clientId,
        patientId: "",
      })
      fetchClientPatients(clientId)
    }
  }

  const loadClientPatients = async (clientId) => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/patients?userId=${userId}&clinicId=${clinicId}&clientId=${clientId}`)
      const result = await response.json()
      if (result.success) {
        setClientPatients(result.data || [])
        return result.data || []
      }
      return []
    } catch (error) {
      console.error("Error fetching client patients:", error)
      return []
    }
  }

  const handlePatientSelect = (patientId) => {
    const patient = clientPatients.find((p) => p.id === Number.parseInt(patientId))

    if (patient) {
      setFormData({
        ...formData,
        patientId: patient.id.toString(),
      })
    }
  }

  const handlePatientAdded = async (newPatient) => {
    if (newPatient) {
      // Refresh clients list in case a new client was added
      await fetchClients()

      // Refresh patients list for the client
      const updatedPatients = await loadClientPatients(newPatient.clientId)

      // Find the client to get owner name
      // We need to fetch clients first to ensure we have the latest list
      const response = await fetch(`/api/clients?userId=${getUserId()}&clinicId=${getClinicId()}`)
      const clientsResult = await response.json()
      const updatedClients = clientsResult.success ? clientsResult.data : clients

      if (clientsResult.success) {
        setClients(updatedClients)
      }

      const client = updatedClients.find((c) => c.id === Number(newPatient.clientId))

      // Update form data with new patient and client
      setFormData((prev) => ({
        ...prev,
        clientId: newPatient.client_id.toString(),
        patientId: newPatient.id.toString(),
      }))

      setIsPatientDialogOpen(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (formApiError) setFormApiError("")
  }

  const handleCurrencyChange = (e) => {
    const cleanValue = parseCurrency(e.target.value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      setFormData({ ...formData, cost: cleanValue })
    }
  }

  const handleNumberInput = (e) => {
    const { name, value } = e.target
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value })
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Programada: "default",
      "En Proceso": "secondary",
      Completada: "outline",
      Cancelada: "destructive",
    }
    return colors[status] || "default"
  }

  const handleVetAdded = async (newVet) => {
    await fetchStaff()
    setIsVetDialogOpen(false)
    setFormData((prev) => ({
      ...prev,
      veterinarianId: newVet.id.toString(),
    }))
  }

  if (loading) {
    return <LoadingPage message="Cargando consultas..." />
  }

  if (!user || !selectedClinic) {
    return <div className="p-6">Por favor selecciona un consultorio</div>
  }

  return (
    <div className="p-6">
      <AlertContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Consultas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Consulta
        </Button>
      </div>

      <ConsultationStats consultations={consultations} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Consultas</CardTitle>
              <CardDescription>Todas las consultas registradas en el sistema</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar consultas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Paciente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dueño</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Motivo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Diagnóstico</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Veterinario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estatus</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Costo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12">
                        <p className="text-muted-foreground">No se encontraron consultas</p>
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{consultation.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{new Date(consultation.date).toLocaleDateString("es-MX")}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{consultation.patientName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{consultation.clientName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{consultation.reason}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{consultation.diagnosis || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{consultation.veterinarian || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusColor(consultation.status)}>
                            {consultation.status || "Programada"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{formatCurrency(consultation.cost || 0)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(consultation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(consultation)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>Mostrando {filteredConsultations.length} consulta(s)</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingConsultation ? "Editar Consulta" : "Nueva Consulta"}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {editingConsultation ? "Modifica los detalles de la consulta" : "Registra una nueva consulta veterinaria"}
            </p>
          </DialogHeader>

          {formApiError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              <p className="text-sm font-medium">{formApiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4">
              <div className="col-span-2">
                <Label htmlFor="client">Cliente (Dueño) *</Label>
                <Select value={formData.clientId} onValueChange={handleClientSelect}>
                  <SelectTrigger>
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
                    <SelectTrigger>
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
                  <Button type="button" variant="outline" onClick={() => setIsPatientDialogOpen(true)}>
                    Agregar
                  </Button>
                </div>
                {formErrors.patientId && <p className="text-sm text-destructive mt-1">{formErrors.patientId}</p>}
              </div>

              <div className="col-span-2">
                <div>
                  <Label htmlFor="veterinarian">Veterinario</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.veterinarianId?.toString()}
                      onValueChange={(value) => {
                        if (value === "none") {
                          setFormData({ ...formData, veterinarianId: null })
                          return
                        }
                        setFormData({
                          ...formData,
                          veterinarianId: value,
                        })
                      }}
                    >
                      <SelectTrigger>
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
                    <Button type="button" variant="outline" onClick={() => setIsVetDialogOpen(true)}>
                      Agregar
                    </Button>
                  </div>
                  {formErrors.veterinarianId && (
                    <p className="text-sm text-destructive mt-1">{formErrors.veterinarianId}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">
                    Fecha *{formErrors.date && <span className="text-xs text-destructive ml-2">{formErrors.date}</span>}
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={formErrors.date ? "border-destructive" : ""}
                    required
                  />
                </div>
                {formErrors.date && <p className="text-sm text-destructive mt-1">{formErrors.date}</p>}
                <div>
                  <Label htmlFor="status">Estatus *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
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
                {formErrors.status && <p className="text-sm text-destructive mt-1">{formErrors.status}</p>}

                <div>
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
                  {formErrors.cost && <p className="text-sm text-destructive mt-1">{formErrors.cost}</p>}
                </div>
              </div>

              <div className="col-span-2">
                <Label htmlFor="reason">
                  Motivo de la Consulta *
                  {formErrors.reason && <span className="text-xs text-destructive ml-2">{formErrors.reason}</span>}
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className={`min-h-[100px] ${formErrors.reason ? "border-destructive" : ""}`}
                  required
                />
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
              <Button type="submit">{editingConsultation ? "Actualizar" : "Guardar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AddVeterinarianModal open={isVetDialogOpen} onOpenChange={setIsVetDialogOpen} onSuccess={handleVetAdded} />

      <AddPatientModal
        open={isPatientDialogOpen}
        onOpenChange={setIsPatientDialogOpen}
        onPatientAdded={handlePatientAdded}
        preSelectedClientId={formData.clientId}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la consulta del paciente{" "}
              <strong>{selectedConsultation?.patientName}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
