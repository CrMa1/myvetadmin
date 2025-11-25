"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, User, Dog, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { StaffModal } from "@/components/staff/staff-modal"
import { ConsultationModal } from "@/components/consultations/consultation-modal"
import { useAuth } from "@/contexts/auth-context"

export function GlobalSearchModal({ isOpen, onClose, searchQuery }) {
  const router = useRouter()
  const { getUserId, getClinicId } = useAuth()
  const [results, setResults] = useState({ clients: {}, patients: {}, consultations: {}, staff: {} })
  const [loading, setLoading] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [positions, setPositions] = useState([])
  const [clients, setClients] = useState([])
  const [clientPatients, setClientPatients] = useState([])
  const [staff, setStaff] = useState([])
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false)

  useEffect(() => {
    if (isOpen && searchQuery) {
      performSearch()
    }
  }, [isOpen, searchQuery])

  useEffect(() => {
    if (isOpen) {
      fetchPositions()
      fetchClients()
      fetchStaff()
    }
  }, [isOpen])

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions")
      const result = await response.json()
      if (result.success) {
        setPositions(result.data || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching positions:", error)
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
      }
    } catch (error) {
      console.error("[v0] Error fetching clients:", error)
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
        setStaff(result.data || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching staff:", error)
    }
  }

  const fetchClientPatients = async (clientId) => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/patients?clientId=${clientId}&userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()
      if (result.success) {
        setClientPatients(result.data || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching client patients:", error)
      setClientPatients([])
    }
  }

  const performSearch = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("[v0] Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClientClick = (clientId) => {
    onClose()
    router.push(`/clientes/${clientId}`)
  }

  const handlePatientClick = (patientId) => {
    onClose()
    router.push(`/kardex/${patientId}`)
  }

  const handleStaffClick = (staffMember) => {
    const mappedStaff = {
      id: staffMember.id,
      name: staffMember.firstName,
      lastName: staffMember.lastName,
      position: staffMember.positionId,
      email: staffMember.email,
      phone: staffMember.phone,
      salary: staffMember.salary,
      license: staffMember.license,
    }
    setSelectedStaff(mappedStaff)
    setShowStaffModal(true)
  }

  const handleConsultationClick = async (consultation) => {
    if (consultation.clientId) {
      await fetchClientPatients(consultation.clientId)
    }

    const mappedConsultation = {
      id: consultation.id,
      clientId: consultation.clientId,
      patientId: consultation.patientId,
      date: consultation.date,
      reason: consultation.reason,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      notes: consultation.notes,
      veterinarianId: consultation.veterinarianId,
      cost: consultation.cost,
      status: consultation.status,
    }
    setSelectedConsultation(mappedConsultation)
    setShowConsultationModal(true)
  }

  const handleStaffSubmit = async (formData, setApiError) => {
    try {
      setIsSubmittingStaff(true)
      const userId = getUserId()
      const clinicId = getClinicId()

      if (!userId || !clinicId) {
        if (setApiError) {
          setApiError("Error: Usuario o clínica no encontrados")
        }
        return
      }

      const method = selectedStaff ? "PUT" : "POST"
      const body = {
        name: formData.name,
        lastName: formData.lastName,
        positionId: formData.position,
        email: formData.email,
        phone: formData.phone,
        salary: formData.salary,
        license: formData.license,
        userId,
        clinicId,
        ...(selectedStaff && { id: selectedStaff.id }),
      }

      const response = await fetch("/api/staff", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        handleStaffModalClose()
        performSearch() // Refresh search results
      } else {
        if (setApiError) {
          setApiError(result.error || "Error al guardar el empleado")
        }
      }
    } catch (error) {
      console.error("[v0] Error saving staff:", error)
      if (setApiError) {
        setApiError("Error al guardar el empleado")
      }
    } finally {
      setIsSubmittingStaff(false)
    }
  }

  const handleConsultationSubmit = async (formData, editingConsultation) => {
    try {
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

      if (editingConsultation) {
        consultationData.id = editingConsultation.id
        const response = await fetch("/api/consultations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultationData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error al actualizar la consulta")
        }
      } else {
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultationData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error al crear la consulta")
        }
      }

      handleConsultationModalClose()
      performSearch() // Refresh search results
    } catch (error) {
      console.error("[v0] Error saving consultation:", error)
      throw error
    }
  }

  const handleClientSelect = async (clientId) => {
    if (clientId) {
      await fetchClientPatients(clientId)
    }
  }

  const handleStaffModalClose = () => {
    setShowStaffModal(false)
    setSelectedStaff(null)
    performSearch() // Reload search results
  }

  const handleConsultationModalClose = () => {
    setShowConsultationModal(false)
    setSelectedConsultation(null)
    setClientPatients([])
    performSearch() // Reload search results
  }

  const totalResults =
    (results?.clients?.length || 0) +
    (results?.patients?.length || 0) +
    (results?.consultations?.length || 0) +
    (results?.staff?.length || 0)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Resultados de Búsqueda</DialogTitle>
            <DialogDescription>
              {loading ? "Buscando..." : `${totalResults} resultado(s) encontrado(s) para "${searchQuery}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Buscando...</div>
            ) : totalResults === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No se encontraron resultados</div>
            ) : (
              <>
                {/* Clients */}
                {results?.clients && results.clients.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Clientes ({results.clients.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.clients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{client.phone}</p>
                            {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
                          </div>
                          <Button size="sm" onClick={() => handleClientClick(client.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalle
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patients */}
                {results?.patients && results.patients.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Dog className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Pacientes ({results.patients.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.animalType} - {patient.breed}
                            </p>
                            <p className="text-sm text-muted-foreground">Dueño: {patient.ownerName}</p>
                          </div>
                          <Button size="sm" onClick={() => handlePatientClick(patient.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Kardex
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultations */}
                {results?.consultations && results.consultations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Consultas ({results.consultations.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.consultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{consultation.patientName}</p>
                              <Badge variant="outline">{consultation.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Dueño: {consultation.clientName}</p>
                            <p className="text-sm text-muted-foreground">
                              Fecha: {new Date(consultation.date).toLocaleDateString("es-MX")}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{consultation.reason}</p>
                          </div>
                          <Button size="sm" onClick={() => handleConsultationClick(consultation)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff */}
                {results?.staff && results.staff.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Personal ({results.staff.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.staff.map((staffMember) => (
                        <div
                          key={staffMember.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {staffMember.firstName} {staffMember.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{staffMember.position}</p>
                            <p className="text-sm text-muted-foreground">{staffMember.email}</p>
                          </div>
                          <Button size="sm" onClick={() => handleStaffClick(staffMember)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showStaffModal && selectedStaff && positions.length > 0 && (
        <StaffModal
          open={showStaffModal}
          onOpenChange={setShowStaffModal}
          editingStaff={selectedStaff}
          positions={positions}
          onSubmit={handleStaffSubmit}
          isSubmitting={isSubmittingStaff}
        />
      )}

      {showConsultationModal && selectedConsultation && (
        <ConsultationModal
          open={showConsultationModal}
          onOpenChange={setShowConsultationModal}
          consultation={selectedConsultation}
          clients={clients}
          clientPatients={clientPatients}
          staff={staff}
          onSubmit={handleConsultationSubmit}
          onClientSelect={handleClientSelect}
          onPatientAdded={() => {}}
          onVetAdded={() => {}}
        />
      )}
    </>
  )
}
