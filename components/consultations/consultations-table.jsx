"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

export function ConsultationsTable({ consultations, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      Programada: "default",
      "En Proceso": "secondary",
      Completada: "outline",
      Cancelada: "destructive",
    }
    return colors[status] || "default"
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron consultas</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="w-full hidden md:table">
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
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{consultation.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{new Date(consultation.date).toLocaleDateString("es-MX")}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{consultation.patientName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{consultation.clientName}</p>
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
                    <Badge variant={getStatusColor(consultation.status)}>{consultation.status || "Programada"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{formatCurrency(consultation.cost || 0)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(consultation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(consultation)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="border rounded-lg p-4 space-y-3 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium">{consultation.patientName}</p>
                <p className="text-sm text-muted-foreground">{consultation.clientName}</p>
                <p className="text-xs text-muted-foreground font-mono">ID: {consultation.id}</p>
              </div>
              <Badge variant={getStatusColor(consultation.status)}>{consultation.status || "Programada"}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Fecha</p>
                <p className="font-medium">{new Date(consultation.date).toLocaleDateString("es-MX")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Costo</p>
                <p className="font-medium">{formatCurrency(consultation.cost || 0)}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Motivo</p>
                <p className="line-clamp-2">{consultation.reason}</p>
              </div>
              {consultation.diagnosis && (
                <div>
                  <p className="text-muted-foreground text-xs">Diagnóstico</p>
                  <p className="line-clamp-2">{consultation.diagnosis}</p>
                </div>
              )}
              {consultation.veterinarian && (
                <div>
                  <p className="text-muted-foreground text-xs">Veterinario</p>
                  <p>{consultation.veterinarian}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => onEdit(consultation)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive bg-transparent"
                onClick={() => onDelete(consultation)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
