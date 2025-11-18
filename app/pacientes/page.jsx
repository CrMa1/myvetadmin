"use client"

import { useState, useEffect } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { PatientsStats } from "@/components/patients/patients-stats"
import { PatientsTable } from "@/components/patients/patients-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"

export default function PatientsPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [species, setSpecies] = useState([])
  const [clients, setClients] = useState([]) // Estado para clientes
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false) // Dialog para nuevo cliente
  const [editingPatient, setEditingPatient] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    sex: "",
    clientId: "", // Cambiar owner por clientId
    color: "",
    medicalHistory: "",
    allergies: "",
  })
  const [newClientData, setNewClientData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    if (getUserId() && getClinicId()) {
      fetchPatients()
      fetchSpecies()
      fetchClients() // Obtener clientes
    }
  }, [user, selectedClinic])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/patients?userId=${getUserId()}&clinicId=${getClinicId()}`)
      const result = await response.json()

      if (result.success) {
        setPatients(result.data)
        setFilteredPatients(result.data)
      } else {
        showError(result.error || "Error al cargar pacientes")
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      showError("Error al cargar los pacientes")
    } finally {
      setLoading(false)
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

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/clients?userId=${getUserId()}&clinicId=${getClinicId()}`)
      const result = await response.json()
      if (result.success) {
        setClients(result.data)
      } else {
        showWarning("No se pudieron cargar los clientes")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const handleAdd = () => {
    setEditingPatient(null)
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      sex: "",
      clientId: "", // Resetear clientId
      color: "",
      medicalHistory: "",
      allergies: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name || "",
      species: patient.species_id?.toString() || "",
      breed: patient.breed || "",
      age: patient.age || "",
      weight: patient.weight || "",
      sex: patient.sex || "",
      clientId: patient.client_id?.toString() || "", // Usar client_id
      color: patient.color || "",
      medicalHistory: patient.medical_history || "",
      allergies: patient.allergies || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return

    try {
      const response = await fetch(`/api/patients?id=${id}&userId=${getUserId()}&clinicId=${getClinicId()}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Paciente eliminado exitosamente")
        await fetchPatients()
      } else {
        showError(result.error || "Error al eliminar el paciente")
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
      showError("Error al eliminar el paciente")
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "El nombre es requerido"
    if (!formData.species) errors.species = "La especie es requerida"
    if (!formData.clientId) errors.clientId = "El cliente es requerido"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showWarning("Por favor completa todos los campos requeridos, incluyendo el cliente")
      return
    }

    try {
      const url = "/api/patients"
      const method = editingPatient ? "PUT" : "POST"
      const body = editingPatient
        ? {
            name: formData.name,
            speciesId: formData.species,
            breed: formData.breed,
            age: formData.age,
            weight: formData.weight,
            sex: formData.sex,
            clientId: formData.clientId, // Enviar clientId
            color: formData.color,
            medicalHistory: formData.medicalHistory,
            allergies: formData.allergies,
            id: editingPatient.id,
            userId: getUserId(),
            clinicId: getClinicId(),
          }
        : {
            name: formData.name,
            speciesId: formData.species,
            breed: formData.breed,
            age: formData.age,
            weight: formData.weight,
            sex: formData.sex,
            clientId: formData.clientId, // Enviar clientId
            color: formData.color,
            medicalHistory: formData.medicalHistory,
            allergies: formData.allergies,
            userId: getUserId(),
            clinicId: getClinicId(),
          }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(editingPatient ? "Paciente actualizado exitosamente" : "Paciente agregado exitosamente")
        setIsDialogOpen(false)
        await fetchPatients()
      } else {
        showError(result.error || "Error al guardar el paciente")
      }
    } catch (error) {
      console.error("Error saving patient:", error)
      showError("Error al guardar el paciente")
    }
  }

  const handleSaveNewClient = async (e) => {
    e.preventDefault()

    if (!newClientData.name || !newClientData.lastName || !newClientData.phone) {
      showWarning("Por favor completa los campos requeridos del cliente")
      return
    }

    // Validar teléfono de 10 dígitos
    if (newClientData.phone.length !== 10) {
      showWarning("El teléfono debe tener 10 dígitos")
      return
    }

    try {
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
        await fetchClients()
        setFormData({ ...formData, clientId: result.data.id.toString() })
        setIsClientDialogOpen(false)
        setNewClientData({
          name: "",
          lastName: "",
          phone: "",
          email: "",
          address: "",
        })
      } else {
        showError(result.error || "Error al guardar el cliente")
      }
    } catch (error) {
      console.error("Error saving client:", error)
      showError("Error al guardar el cliente")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" })
    }
  }

  const handleFilterClick = (type) => {
    setActiveFilter(type)
    if (type) {
      setFilteredPatients(patients.filter((p) => p.species === type))
    } else {
      setFilteredPatients(patients)
    }
  }

  const handleSearch = (query) => {
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.owner.toLowerCase().includes(query.toLowerCase()) ||
        p.species.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredPatients(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando pacientes..." />
  }

  if (!getUserId() || !getClinicId()) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Paciente
        </Button>
      </div>

      <PatientsStats patients={patients} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <PatientsTable patients={filteredPatients} onEdit={handleEdit} onDelete={handleDelete} onSearch={handleSearch} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingPatient ? "Editar Paciente" : "Agregar Nuevo Paciente"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Owner Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información del Dueño</h3>
              <div>
                <Label htmlFor="clientId">
                  Dueño (Cliente) *
                  {formErrors.clientId && <span className="text-xs text-destructive ml-2">{formErrors.clientId}</span>}
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(value) => handleInputChange("clientId", value)}
                  >
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
              </div>
            </div>

            {/* Patient Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información del Paciente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Nombre del Paciente *
                    {formErrors.name && <span className="text-xs text-destructive ml-2">{formErrors.name}</span>}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
                    placeholder="Ej: Max"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="species">
                    Especie *
                    {formErrors.species && <span className="text-xs text-destructive ml-2">{formErrors.species}</span>}
                  </Label>
                  <Select 
                    value={formData.species} 
                    onValueChange={(value) => handleInputChange("species", value)}
                  >
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
                </div>

                <div>
                  <Label htmlFor="breed">Raza</Label>
                  <Input 
                    id="breed" 
                    value={formData.breed} 
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    className="mt-1.5"
                    placeholder="Ej: Labrador"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input 
                    id="color" 
                    value={formData.color} 
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="mt-1.5"
                    placeholder="Ej: Café"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Edad (años)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="mt-1.5"
                    placeholder="Ej: 3"
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault()
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="mt-1.5"
                    placeholder="Ej: 25.5"
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault()
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="sex">Sexo</Label>
                  <Select 
                    value={formData.sex} 
                    onValueChange={(value) => handleInputChange("sex", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="button" variant="outline" onClick={() => {
                setIsDialogOpen(false)
                setFormErrors({})
              }}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                {editingPatient ? "Actualizar Paciente" : "Guardar Paciente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveNewClient} className="grid gap-4">
            <div>
              <Label htmlFor="clientName">Nombre *</Label>
              <Input
                id="clientName"
                value={newClientData.name}
                onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="clientLastName">Apellidos *</Label>
              <Input
                id="clientLastName"
                value={newClientData.lastName}
                onChange={(e) => setNewClientData({ ...newClientData, lastName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Teléfono *</Label>
              <Input
                id="clientPhone"
                value={newClientData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 10) {
                    setNewClientData({ ...newClientData, phone: value })
                  }
                }}
                placeholder="10 dígitos"
                maxLength={10}
                required
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={newClientData.email}
                onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="clientAddress">Dirección</Label>
              <Textarea
                id="clientAddress"
                value={newClientData.address}
                onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsClientDialogOpen(false)
                  setNewClientData({ name: "", lastName: "", phone: "", email: "", address: "" })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                Guardar Cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
