"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function PatientsTable({ patients, onEdit, onDelete, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedPatient) {
      onDelete(selectedPatient.id)
      setIsDeleteDialogOpen(false)
      setSelectedPatient(null)
    }
  }

  const getSpeciesIcon = (species) => {
    if (!species) return "🐾"
    const lowerSpecies = species.toLowerCase()
    if (lowerSpecies.includes("perro") || lowerSpecies.includes("dog")) return "🐕"
    if (lowerSpecies.includes("gato") || lowerSpecies.includes("cat")) return "🐈"
    if (lowerSpecies.includes("ave") || lowerSpecies.includes("bird")) return "🐦"
    if (lowerSpecies.includes("conejo") || lowerSpecies.includes("rabbit")) return "🐰"
    if (lowerSpecies.includes("hamster")) return "🐹"
    return "🐾"
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Pacientes</CardTitle>
              <CardDescription className="hidden sm:block">
                Todas las mascotas registradas en el sistema
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pacientes..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="table-wrapper">
            <div className="table-scroll">
              <table className="w-full hidden md:table">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Raza</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Edad</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Peso</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dueño</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Teléfono</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Última Visita</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12">
                        <p className="text-muted-foreground">No se encontraron pacientes</p>
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{patient.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{patient.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{patient.animalType}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{patient.breed}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{patient.age} años</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{patient.weight} kg</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{patient.ownerName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{patient.ownerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{new Date(patient.lastVisit).toLocaleDateString("es-MX")}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/kardex/${patient.id}`)}
                              title="Ver Kardex"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(patient)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(patient)}
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron pacientes</p>
              </div>
            ) : (
              patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 space-y-3 bg-card">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl flex-shrink-0">
                      {getSpeciesIcon(patient.animalType)}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.ownerName}</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: {patient.id}</p>
                    </div>
                    <Badge variant="secondary">{patient.animalType}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Raza</p>
                      <p className="font-medium">{patient.breed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Edad</p>
                      <p className="font-medium">{patient.age} años</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Peso</p>
                      <p className="font-medium">{patient.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Teléfono</p>
                      <p className="font-medium">{patient.ownerPhone}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Última Visita</p>
                      <p>{new Date(patient.lastVisit).toLocaleDateString("es-MX")}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/kardex/${patient.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Kardex
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => onEdit(patient)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDeleteClick(patient)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats footer - hidden on mobile when showing cards */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground hidden md:flex">
            <p>Mostrando {patients.length} paciente(s)</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar al paciente <strong>{selectedPatient?.name}</strong>? Esta acción no se
              puede deshacer.
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
    </>
  )
}
