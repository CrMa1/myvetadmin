"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { ConsultationStats } from "@/components/consultations/consultation-stats"

export default function ConsultasPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [consultations, setConsultations] = useState([])
  const [patients, setPatients] = useState([])
  const [staff, setStaff] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    ownerName: "",
    status: "",
    date: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    veterinarian: "",
    cost: "",
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
  })

  const statusOptions = ['Programada','En Proceso','Completada','Cancelada', 'Reprogramada'];

  useEffect(() => {
    if (user && selectedClinic) {
      fetchConsultations()
      fetchPatients()
      fetchStaff()
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patientName || !formData.ownerName || !formData.status || !formData.date || !formData.reason) {
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

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta consulta?")) {
      const userId = getUserId()
      const clinicId = getClinicId()

      const response = await fetch(`/api/consultations?id=${id}&userId=${userId}&clinicId=${clinicId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Consulta eliminada exitosamente")
        fetchConsultations()
      } else {
        showError("Error al eliminar la consulta")
      }
    }
  }

  const handleEdit = (consultation) => {
    setEditingConsultation(consultation)
    setFormData({
      ...formData,
      patientId: consultation.patientId || "",
      patientName: consultation.patientName || "",
      ownerName: consultation.ownerName || "",
      status: consultation.status || "",
      date: consultation.date ? new Date(consultation.date).toISOString().split("T")[0] : "",
      reason: consultation.reason || "",
      diagnosis: consultation.diagnosis || "",
      treatment: consultation.treatment || "",
      notes: consultation.notes || "",
      veterinarian: consultation.veterinarian || "",
      cost: consultation.cost || "",
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingConsultation(null)
    setFormData({
      patientId: "",
      patientName: "",
      ownerName: "",
      status: "",
      date: "",
      reason: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      veterinarian: "",
      cost: "",
    })
  }

  const handlePatientSelect = (patientId) => {
    console.log("[v0] Patient selected:", patientId)
    console.log("[v0] Available patients:", patients)

    const patient = patients.find((p) => p.id === Number.parseInt(patientId))
    console.log("[v0] Found patient:", patient)

    if (patient) {
      setFormData({
        ...formData,
        patientId: patient.id,
        patientName: patient.name,
        ownerName: patient.ownerName, // now matches the API response
      })
      console.log("[v0] Form data updated with patient info")
    } else {
      console.log("[v0] Patient not found in list")
    }
  }

  const handleNewPatient = async (e) => {
    e.preventDefault()

    if (!newPatientData.name || !newPatientData.animalType || !newPatientData.ownerName) {
      showWarning("Por favor completa los campos obligatorios del paciente")
      return
    }

    const userId = getUserId()
    const clinicId = getClinicId()

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPatientData,
        lastVisit: new Date().toISOString().split("T")[0],
        userId,
        clinicId,
      }),
    })

    const result = await response.json()
    if (result.success) {
      showSuccess("Paciente registrado exitosamente")
      await fetchPatients()

      setFormData({
        ...formData,
        patientId: result.data.id,
        patientName: result.data.name,
        ownerName: result.data.ownerName,
      })

      setIsPatientDialogOpen(false)
      setNewPatientData({
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
      })
    } else {
      showError(result.error || "Error al registrar el paciente")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNumberInput = (e) => {
    const { name, value } = e.target
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value })
    }
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

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por paciente, dueño, motivo o veterinario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Dueño</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
                    No se encontraron consultas
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">{consultation.id}</TableCell>
                    <TableCell>{new Date(consultation.date).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell>{consultation.patientName}</TableCell>
                    <TableCell>{consultation.ownerName}</TableCell>
                    <TableCell>{consultation.status}</TableCell>
                    <TableCell>{consultation.reason}</TableCell>
                    <TableCell>{consultation.diagnosis || "-"}</TableCell>
                    <TableCell>{consultation.veterinarian || "-"}</TableCell>
                    <TableCell>${consultation.cost || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(consultation)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(consultation.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConsultation ? "Editar Consulta" : "Nueva Consulta"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Paciente *</Label>
                <div className="flex gap-2">
                  <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name} - {patient.ownerName}
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
                <Label htmlFor="patientName">Nombre del Paciente *</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ownerName">Nombre del Dueño *</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

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
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Fecha *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>

              <div className="col-span-2">
                <Label htmlFor="reason">Motivo de la Consulta *</Label>
                <Textarea id="reason" name="reason" value={formData.reason} onChange={handleInputChange} required />
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
                <Input id="cost" name="cost" value={formData.cost} onChange={handleNumberInput} />
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
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="animalType">Tipo de Animal *</Label>
                <Select
                  value={newPatientData.animalType}
                  onValueChange={(value) => setNewPatientData({ ...newPatientData, animalType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perro">Perro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Ave">Ave</SelectItem>
                    <SelectItem value="Conejo">Conejo</SelectItem>
                    <SelectItem value="Hamster">Hámster</SelectItem>
                    <SelectItem value="Reptil">Reptil</SelectItem>
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

              <div>
                <Label htmlFor="ownerName">Nombre del Dueño *</Label>
                <Input
                  id="ownerName"
                  value={newPatientData.ownerName}
                  onChange={(e) => setNewPatientData({ ...newPatientData, ownerName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ownerPhone">Teléfono del Dueño</Label>
                <Input
                  id="ownerPhone"
                  value={newPatientData.ownerPhone}
                  onChange={(e) => setNewPatientData({ ...newPatientData, ownerPhone: e.target.value })}
                />
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
                <Label htmlFor="diseases">Enfermedades</Label>
                <Textarea
                  id="diseases"
                  value={newPatientData.diseases}
                  onChange={(e) => setNewPatientData({ ...newPatientData, diseases: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPatientDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Paciente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
