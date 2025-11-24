"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Loader } from "@/components/ui/loader"
import { AddPatientModal } from "@/components/patients/add-patient-modal"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getUserId, getClinicId } = useAuth()
  const [client, setClient] = useState(null)
  const [patients, setPatients] = useState([])
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId && params.id) {
      fetchClientDetail()
    }
  }, [params.id, getUserId, getClinicId])

  const fetchClientDetail = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/clients/${params.id}?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setClient(result.data.client)
        setPatients(result.data.patients || [])
        setConsultations(result.data.consultations || [])
      }
    } catch (error) {
      console.error("Error fetching client detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewKardex = (patientId) => {
    router.push(`/kardex/${patientId}`)
  }

  const getAnimalIcon = (type) => {
    const icons = {
      Perro: "🐕",
      Gato: "🐈",
      Ave: "🦜",
      Reptil: "🦎",
      Otro: "🐾",
    }
    return icons[type] || "🐾"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Cargando detalles del cliente..." />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8">
        <p>Cliente no encontrado</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Detalle del Cliente</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Nombre:</span>
              <span>{`${client.first_name} ${client.last_name}`}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Teléfono:</span>
              <span>{client.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Email:</span>
              <span>{client.email || "-"}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Dirección:</span>
              <span>{client.address || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Estado:</span>
              <Badge>{client.status_name}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Fecha Registro:</span>
              <span>{new Date(client.created_at).toLocaleDateString("es-MX")}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Mascotas del Cliente</h2>
          <Button onClick={() => setIsAddPatientModalOpen(true)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mascota
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Consultas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Este cliente no tiene mascotas registradas
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <span className="mr-2">{getAnimalIcon(patient.animal_type)}</span>
                      {patient.name}
                    </TableCell>
                    <TableCell>{patient.animal_type}</TableCell>
                    <TableCell>{patient.breed}</TableCell>
                    <TableCell>{patient.age} años</TableCell>
                    <TableCell>{patient.sex}</TableCell>
                    <TableCell>
                      {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString("es-MX") : "Sin visitas"}
                    </TableCell>
                    <TableCell>{patient.consultation_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewKardex(patient.id)} title="Ver Kardex">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Historial de Consultas</h2>
          <span className="text-sm text-muted-foreground">{consultations.length} consulta(s) registrada(s)</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Tratamiento</TableHead>
                <TableHead>Veterinario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay consultas registradas para las mascotas de este cliente
                  </TableCell>
                </TableRow>
              ) : (
                consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      {new Date(consultation.consultation_date).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{consultation.patient_name}</TableCell>
                    <TableCell>{consultation.reason}</TableCell>
                    <TableCell>{consultation.diagnosis || "-"}</TableCell>
                    <TableCell>{consultation.treatment || "-"}</TableCell>
                    <TableCell>{consultation.veterinarian || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddPatientModal
        open={isAddPatientModalOpen}
        onOpenChange={setIsAddPatientModalOpen}
        preSelectedClientId={client.id}
        onPatientAdded={fetchClientDetail}
      />
    </div>
  )
}
