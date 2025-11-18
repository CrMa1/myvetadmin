"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2 } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { ConsultationStats } from "@/components/consultations/consultation-stats"
import { formatCurrency, parseCurrency, handleCurrencyInput } from "@/lib/currency"

export default function ConsultasPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [consultations, setConsultations] = useState([])
  const [patients, setPatients] = useState([])
  const [staff, setStaff] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    ownerName: "",
    accompaniedBy: "",
    clientId: "",
    date: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    veterinarian: "",
    cost: "",
    status: "Programada",
  })
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    animalType: "",
    breed: "",
    age: "",
    weight: "",
    sex: "",
    ownerName: "",
    ownerPhone: "",
    medicalHistory: "",
    diseases: "",
    clientId: "",
  })
  const [clients, setClients] = useState([])
  const [clientPatients, setClientPatients] = useState([])
  const [species, setSpecies] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [patientFormErrors, setPatientFormErrors] = useState({})

  useEffect(() => {
    if (user && selectedClinic) {
      fetchConsultations()
      fetchClients()
      fetchStaff()
      fetchSpecies()
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
    if (!formData.patientName.trim()) errors.patientName = "El nombre del paciente es requerido"
    if (!formData.ownerName.trim()) errors.ownerName = "El nombre del dueño es requerido"
    if (!formData.accompaniedBy.trim()) errors.accompaniedBy = "Este campo es requerido"
    if (!formData.date) errors.date = "La fecha es requerida"
    if (!formData.reason.trim()) errors.reason = "El motivo de la consulta es requerido"
    if (!formData.status) errors.status = "El estatus es requerido"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showWarning("Por favor completa todos los campos obligatorios")
      return
    }

    const userId = getUserId()
    const clinicId = getClinicId()

    const method = editingConsultation ? "PUT" : "POST"
    const body = editingConsultation
      ? { ...formData, id: editingConsultation.id, userId, clinicId }
      : { ...formData, userId, clinicId }

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
      showError(result.error || "Error al guardar consulta")
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

    const response = await fetch(`/api/consultations?id=${selectedConsultation.id}&userId=${userId}&clinicId=${clinicId}`, {
      method: "DELETE",
    })
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
    setEditingConsultation(consultation)
    setFormData({
      ...formData,
      patientId: consultation.patientId || "",
      patientName: consultation.patientName || "",
      ownerName: consultation.ownerName || "",
      accompaniedBy: consultation.accompaniedBy || "",
      clientId: consultation.clientId || "",
      date: consultation.date ? new Date(consultation.date).toISOString().split("T")[0] : "",
      reason: consultation.reason || "",
      diagnosis: consultation.diagnosis || "",
      treatment: consultation.treatment || "",
      notes: consultation.notes || "",
      veterinarian: consultation.veterinarian || "",
      cost: consultation.cost || "",
      status: consultation.status || "Programada",
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingConsultation(null)
    setFormData({
      patientId: "",
      patientName: "",
      ownerName: "",
      accompaniedBy: "",
      clientId: "",
      date: "",
      reason: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      veterinarian: "",
      cost: "",
      status: "Programada",
    })
    setFormErrors({})
  }

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c.id === Number.parseInt(clientId))
    if (client) {
      setFormData({
        ...formData,
        clientId: clientId,
        ownerName: `${client.first_name} ${client.last_name}`,
        patientId: "",
        patientName: "",
      })
      fetchClientPatients(clientId)
    }
  }

  const handlePatientSelect = (patientId) => {
    const patient = clientPatients.find((p) => p.id === Number.parseInt(patientId))

    if (patient) {
      setFormData({
        ...formData,
        patientId: patient.id,
        patientName: patient.name,
      })
    }
  }

  const validatePatientForm = () => {
    const errors = {}
    if (!newPatientData.name.trim()) errors.name = "El nombre es requerido"
    if (!newPatientData.animalType) errors.animalType = "El tipo de animal es requerido"
    if (!newPatientData.clientId) errors.clientId = "El cliente es requerido"
    
    setPatientFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNewPatient = async (e) => {
    e.preventDefault()

    if (!validatePatientForm()) {
      showWarning("Por favor completa los campos obligatorios del paciente")
      return
    }

    const userId = getUserId()
    const clinicId = getClinicId()

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPatientData.name,
        speciesId: newPatientData.animalType,
        breed: newPatientData.breed,
        age: newPatientData.age,
        weight: newPatientData.weight,
        sex: newPatientData.sex,
        clientId: newPatientData.clientId,
        medicalHistory: newPatientData.medicalHistory,
        allergies: newPatientData.diseases,
        userId,
        clinicId,
      }),
    })

    const result = await response.json()
    if (result.success) {
      showSuccess("Paciente registrado exitosamente")
      await fetchClients()

      setFormData({
        ...formData,
        patientId: result.data.id,
        patientName: result.data.name,
      })

      setIsPatientDialogOpen(false)
      setNewPatientData({
        name: "",
        animalType: "",
        breed: "",
        age: "",
        weight: "",
        sex: "",
        clientId: "",
        medicalHistory: "",
        diseases: "",
      })
      setPatientFormErrors({})
    } else {
      showError(result.error || "Error al registrar el paciente")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
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
      "Programada": "default",
      "En Proceso": "secondary",
      "Completada": "outline",
      "Cancelada": "destructive",
    }
    return colors[status] || "default"
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
                          <p className="text-sm">{consultation.ownerName}</p>
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
            <p>
              Mostrando {filteredConsultations.length} consulta(s)
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConsultation ? "Editar Consulta" : "Nueva Consulta"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Cliente (Dueño) *</Label>
                <Select value={formData.clientId} onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente primero" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.first_name} {client.last_name} - {client.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Paciente *</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.patientId} 
                    onValueChange={handlePatientSelect}
                    disabled={clientPatients.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={clientPatients.length === 0 ? "Selecciona un cliente primero" : "Seleccionar paciente"} />
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
                    Nuevo Paciente
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="patientName">
                  Nombre del Paciente * 
                  {formErrors.patientName && <span className="text-xs text-destructive ml-2">{formErrors.patientName}</span>}
                </Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={formErrors.patientName ? "border-destructive" : ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ownerName">
                  Nombre del Dueño *
                  {formErrors.ownerName && <span className="text-xs text-destructive ml-2">{formErrors.ownerName}</span>}
                </Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className={formErrors.ownerName ? "border-destructive" : ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="accompaniedBy">
                  Acompañado por *
                  {formErrors.accompaniedBy && <span className="text-xs text-destructive ml-2">{formErrors.accompaniedBy}</span>}
                </Label>
                <Input
                  id="accompaniedBy"
                  name="accompaniedBy"
                  value={formData.accompaniedBy}
                  onChange={handleInputChange}
                  className={formErrors.accompaniedBy ? "border-destructive" : ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">
                  Fecha *
                  {formErrors.date && <span className="text-xs text-destructive ml-2">{formErrors.date}</span>}
                </Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange}
                  className={formErrors.date ? "border-destructive" : ""}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="status">
                  Estatus *
                  {formErrors.status && <span className="text-xs text-destructive ml-2">{formErrors.status}</span>}
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => {
                    setFormData({ ...formData, status: value })
                    if (formErrors.status) {
                      setFormErrors({ ...formErrors, status: "" })
                    }
                  }}
                >
                  <SelectTrigger className={formErrors.status ? "border-destructive" : ""}>
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
                <Label htmlFor="reason">
                  Motivo de la Consulta *
                  {formErrors.reason && <span className="text-xs text-destructive ml-2">{formErrors.reason}</span>}
                </Label>
                <Textarea 
                  id="reason" 
                  name="reason" 
                  value={formData.reason} 
                  onChange={handleInputChange}
                  className={formErrors.reason ? "border-destructive" : ""}
                  required 
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="treatment">Tratamiento</Label>
                <Textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="veterinarian">Veterinario</Label>
                <Select
                  value={formData.veterinarian}
                  onValueChange={(value) => setFormData({ ...formData, veterinarian: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {staff.map((vet) => (
                      <SelectItem key={vet.id} value={`${vet.name} ${vet.lastName}`}>
                        {vet.name} {vet.lastName} - {vet.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cost">Costo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleCurrencyChange}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
                {formData.cost && (
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.cost)}</p>
                )}
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

      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewPatient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="clientId">
                  Cliente (Dueño) *
                  {patientFormErrors.clientId && <span className="text-xs text-destructive ml-2">{patientFormErrors.clientId}</span>}
                </Label>
                <Select
                  value={newPatientData.clientId}
                  onValueChange={(value) => {
                    setNewPatientData({ ...newPatientData, clientId: value })
                    if (patientFormErrors.clientId) {
                      setPatientFormErrors({ ...patientFormErrors, clientId: "" })
                    }
                  }}
                >
                  <SelectTrigger className={patientFormErrors.clientId ? "border-destructive" : ""}>
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
              </div>

              <div>
                <Label htmlFor="name">
                  Nombre *
                  {patientFormErrors.name && <span className="text-xs text-destructive ml-2">{patientFormErrors.name}</span>}
                </Label>
                <Input
                  id="name"
                  value={newPatientData.name}
                  onChange={(e) => {
                    setNewPatientData({ ...newPatientData, name: e.target.value })
                    if (patientFormErrors.name) {
                      setPatientFormErrors({ ...patientFormErrors, name: "" })
                    }
                  }}
                  className={patientFormErrors.name ? "border-destructive" : ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="animalType">
                  Tipo de Animal *
                  {patientFormErrors.animalType && <span className="text-xs text-destructive ml-2">{patientFormErrors.animalType}</span>}
                </Label>
                <Select
                  value={newPatientData.animalType}
                  onValueChange={(value) => {
                    setNewPatientData({ ...newPatientData, animalType: value })
                    if (patientFormErrors.animalType) {
                      setPatientFormErrors({ ...patientFormErrors, animalType: "" })
                    }
                  }}
                >
                  <SelectTrigger className={patientFormErrors.animalType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id.toString()}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  value={newPatientData.breed}
                  onChange={(e) => setNewPatientData({ ...newPatientData, breed: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="age">Edad (años)</Label>
                <Input
                  id="age"
                  value={newPatientData.age}
                  onChange={(e) => {
                    if (e.target.value === "" || /^\d+$/.test(e.target.value)) {
                      setNewPatientData({ ...newPatientData, age: e.target.value })
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  value={newPatientData.weight}
                  onChange={(e) => {
                    if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                      setNewPatientData({ ...newPatientData, weight: e.target.value })
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="sex">Sexo</Label>
                <Select
                  value={newPatientData.sex}
                  onValueChange={(value) => setNewPatientData({ ...newPatientData, sex: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="medicalHistory">Historial Médico</Label>
                <Textarea
                  id="medicalHistory"
                  value={newPatientData.medicalHistory}
                  onChange={(e) => setNewPatientData({ ...newPatientData, medicalHistory: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="diseases">Enfermedades/Alergias</Label>
                <Textarea
                  id="diseases"
                  value={newPatientData.diseases}
                  onChange={(e) => setNewPatientData({ ...newPatientData, diseases: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsPatientDialogOpen(false)
                  setPatientFormErrors({})
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Paciente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
