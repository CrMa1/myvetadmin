"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PatientsStats } from "@/components/patients/patients-stats"
import { PatientsTable } from "@/components/patients/patients-table"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { PatientModal } from "@/components/patients/patient-modal"

export default function PatientsPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, AlertContainer } = useAlertToast()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [species, setSpecies] = useState([])
  const [clients, setClients] = useState([]) // Estado para clientes
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
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
  const [formErrors, setFormErrors] = useState({})

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
        showError("No se pudieron cargar las especies")
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
        showError("No se pudieron cargar los clientes")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingPatient(null)
    setIsModalOpen(true)
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
        (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.owner || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.species || "").toLowerCase().includes(query.toLowerCase()),
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

      <PatientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchPatients}
        patient={editingPatient}
      />
    </div>
  )
}
