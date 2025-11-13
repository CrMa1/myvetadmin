"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
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
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    sex: "",
    owner: "",
    color: "",
    medicalHistory: "",
    allergies: "",
  })

  useEffect(() => {
    if (getUserId() && getClinicId()) {
      fetchPatients()
      fetchSpecies()
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

  const handleAdd = () => {
    setEditingPatient(null)
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      sex: "",
      owner: "",
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
      species: patient.species_id.toString() || "", // Updated to species_id
      breed: patient.breed || "",
      age: patient.age || "",
      weight: patient.weight || "",
      sex: patient.sex || "",
      owner: patient.owner || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.species || !formData.owner) {
      showWarning("Por favor completa todos los campos requeridos")
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
            owner: formData.owner,
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
            owner: formData.owner,
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPatient ? "Editar Paciente" : "Agregar Nuevo Paciente"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="species">Especie *</Label>
                <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                  <SelectTrigger>
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
                <Input id="breed" value={formData.breed} onChange={(e) => handleInputChange("breed", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="age">Edad (años)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault()
                  }}
                />
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault()
                  }}
                />
              </div>

              <div>
                <Label htmlFor="sex">Sexo</Label>
                <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
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
                <Label htmlFor="owner">Nombre del Dueño *</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" value={formData.color} onChange={(e) => handleInputChange("color", e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="medicalHistory">Historial Médico</Label>
              <Textarea
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                {editingPatient ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
