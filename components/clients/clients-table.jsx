"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

export function ClientsTable({ clients, onEdit, onDelete, onSearch }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleDeleteClick = (client) => {
    setSelectedClient(client)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedClient) {
      onDelete(selectedClient.id)
      setIsDeleteDialogOpen(false)
      setSelectedClient(null)
    }
  }

  const handleViewDetail = (client) => {
    router.push(`/clientes/${client.id}`)
  }

  const getStatusVariant = (status) => {
    const variants = {
      Nuevo: "default",
      Frecuente: "secondary",
      Especial: "default",
      Inactivo: "secondary",
    }
    return variants[status] || "default"
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Todos los clientes registrados en el sistema</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contacto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dirección</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Mascotas</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha Registro</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <p className="text-muted-foreground">No se encontraron clientes</p>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{client.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{`${client.first_name} ${client.last_name}`}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{client.phone}</span>
                            </div>
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{client.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm max-w-xs truncate">{client.address || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{client.patient_count || 0}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusVariant(client.status_name)}>{client.status_name}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{new Date(client.created_at).toLocaleDateString("es-MX")}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleViewDetail(client)}
                              title="Ver Detalle"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onEdit(client)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(client)}
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
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Mostrando {clients.length} cliente(s)
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar al cliente{" "}
              <strong>
                {selectedClient?.first_name} {selectedClient?.last_name}
              </strong>
              ? Esta acción no se puede deshacer.
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
