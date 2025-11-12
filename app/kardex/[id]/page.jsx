"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"

export default function KardexPage() {
  const params = useParams()
  const router = useRouter()
  const { getUserId, getClinicId } = useAuth()
  const [patient, setPatient] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId && params.id) {
      fetchKardexData()
    }
  }, [params.id, getUserId, getClinicId])

  const fetchKardexData = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/patients/${params.id}?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setPatient(result.data.patient)
        setConsultations(result.data.consultations || [])
      }
    } catch (error) {
      console.error("Error fetching kardex:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewConsultation = () => {
    router.push(`/consultas?patientId=${params.id}`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-8">
        <p>Paciente no encontrado</p>
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
        <Button onClick={handleNewConsultation} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Consulta
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Kardex del Paciente</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Información del Paciente</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Nombre:</span>
              <span>{patient.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Tipo:</span>
              <span>{patient.animal_type}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Raza:</span>
              <span>{patient.breed}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Edad:</span>
              <span>{patient.age} años</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Peso:</span>
              <span>{patient.weight} kg</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Sexo:</span>
              <span>{patient.sex}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Color:</span>
              <span>{patient.color}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Información del Dueño</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Nombre:</span>
              <span>{patient.owner_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Teléfono:</span>
              <span>{patient.owner_phone}</span>
            </div>
            {patient.owner_email && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Email:</span>
                <span>{patient.owner_email}</span>
              </div>
            )}
            {patient.owner_address && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Dirección:</span>
                <span>{patient.owner_address}</span>
              </div>
            )}
            {patient.last_visit && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Última Visita:</span>
                <span>{new Date(patient.last_visit).toLocaleDateString("es-MX")}</span>
              </div>
            )}
          </div>

          {patient.medical_history && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Historial Médico:</h3>
              <p className="text-sm text-muted-foreground">{patient.medical_history}</p>
            </div>
          )}

          {patient.diseases && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Enfermedades:</h3>
              <p className="text-sm text-muted-foreground">{patient.diseases}</p>
            </div>
          )}
        </Card>
      </div>

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
                <TableHead>Motivo</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Tratamiento</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Temp.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay consultas registradas para este paciente
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
                    <TableCell>{consultation.reason}</TableCell>
                    <TableCell>{consultation.diagnosis || "-"}</TableCell>
                    <TableCell>{consultation.treatment || "-"}</TableCell>
                    <TableCell>{consultation.veterinarian || "-"}</TableCell>
                    <TableCell>{consultation.weight ? `${consultation.weight} kg` : "-"}</TableCell>
                    <TableCell>{consultation.temperature ? `${consultation.temperature}°C` : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
