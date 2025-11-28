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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { ConsultationStats } from "@/components/consultations/consultation-stats"
import { AddVeterinarianModal } from "@/components/personal/add-veterinarian-modal"
import { AddPatientModal } from "@/components/patients/add-patient-modal"
import { parseCurrency } from "@/lib/currency"
import { ConsultationsTable } from "@/components/consultations/consultations-table"
import { ConsultationModal } from "@/components/consultations/consultation-modal"
import { PlanLimitModal } from "@/components/modals/plan-limit-modal"

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
  const [planLimitInfo, setPlanLimitInfo] = useState(null)
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false)

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

  const handleSubmitConsultation = async (formData, editingConsultation) => {
    const userId = getUserId()
    const clinicId = getClinicId()

    if (!userId || !clinicId) {
      throw new Error("Usuario o clínica no encontrados")
    }

    const consultationData = {
      patientId: Number.parseInt(formData.patientId),
      clientId: Number.parseInt(formData.clientId),
      date: formData.date,
      reason: formData.reason,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      notes: formData.notes,
      veterinarianId: formData.veterinarianId ? Number.parseInt(formData.veterinarianId) : null,
      cost: formData.cost ? Number.parseFloat(formData.cost) : 0,
      status: formData.status,
      userId: Number.parseInt(userId),
      clinicId: Number.parseInt(clinicId),
    }

    try {
      if (editingConsultation) {
        const response = await fetch(`/api/consultations/${editingConsultation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...consultationData, id: editingConsultation.id }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error al actualizar la consulta")
        }

        const result = await response.json()
        setConsultations(consultations.map((c) => (c.id === editingConsultation.id ? result.data : c)))
        showSuccess("Consulta actualizada exitosamente")
      } else {
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultationData),
        })

        const result = await response.json()

        if (!response.ok) {
          if (result.limitExceeded) {
            setPlanLimitInfo(result.limitInfo)
            setShowPlanLimitModal(true)
            setIsDialogOpen(false)
            return
          }
          throw new Error(result.error || "Error al crear la consulta")
        }

        console.log("[v0] New consultation created:", result.data)
        setConsultations([result.data, ...consultations])
        showSuccess("Consulta creada exitosamente")
      }

      setIsDialogOpen(false)
      setEditingConsultation(null)
    } catch (error) {
      showError(error.message)
      throw error
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

  const handleClientSelectInModal = (clientId) => {
    if (clientId) {
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
      await fetchClients()
      const updatedPatients = await loadClientPatients(newPatient.client_id || newPatient.clientId)

      setFormData((prev) => ({
        ...prev,
        clientId: (newPatient.client_id || newPatient.clientId).toString(),
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

  const handleRefreshClients = async () => {
    await fetchClients()
  }

  const handleRefreshStaff = async () => {
    await fetchStaff()
  }

  if (loading) {
    return <LoadingPage message="Cargando consultas..." />
  }

  if (!user || !selectedClinic) {
    return <div className="p-6">Por favor selecciona un consultorio</div>
  }

  return (
    <div className="page-container">
      <AlertContainer />
      <div className="page-header">
        <h1 className="text-2xl sm:text-3xl font-bold">Consultas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Nueva Consulta</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>

      <ConsultationStats consultations={consultations} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Consultas</CardTitle>
              <CardDescription className="hidden sm:block">
                Todas las consultas registradas en el sistema
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
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
          <ConsultationsTable consultations={filteredConsultations} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </CardContent>
      </Card>

      <ConsultationModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        consultation={editingConsultation}
        clients={clients}
        clientPatients={clientPatients}
        staff={staff}
        onSubmit={handleSubmitConsultation}
        onClientSelect={handleClientSelectInModal}
        onPatientAdded={handlePatientAdded}
        onVetAdded={handleVetAdded}
        onRefreshClients={handleRefreshClients}
        onRefreshStaff={handleRefreshStaff}
      />

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

      <PlanLimitModal
        isOpen={showPlanLimitModal}
        onClose={() => setShowPlanLimitModal(false)}
        limitInfo={planLimitInfo}
      />
    </div>
  )
}
