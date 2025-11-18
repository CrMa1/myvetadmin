"use client"

import { useState, useEffect } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ClientsStats } from "@/components/clients/clients-stats"
import { ClientsTable } from "@/components/clients/clients-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"

export default function ClientsPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [clientStatuses, setClientStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    statusId: "1",
  })

  useEffect(() => {
    if (getUserId() && getClinicId()) {
      fetchClients()
      fetchClientStatuses()
    }
  }, [user, selectedClinic])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clients?userId=${getUserId()}&clinicId=${getClinicId()}`)
      const result = await response.json()

      if (result.success) {
        setClients(result.data)
        setFilteredClients(result.data)
      } else {
        showError(result.error || "Error al cargar clientes")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      showError("Error al cargar los clientes")
    } finally {
      setLoading(false)
    }
  }

  const fetchClientStatuses = async () => {
    try {
      const response = await fetch("/api/client-status")
      const result = await response.json()
      if (result.success) {
        setClientStatuses(result.data)
      }
    } catch (error) {
      console.error("Error fetching client statuses:", error)
    }
  }

  const handleAdd = () => {
    setEditingClient(null)
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      statusId: "1",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      firstName: client.first_name || "",
      lastName: client.last_name || "",
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      statusId: client.status_id?.toString() || "1",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return

    try {
      const response = await fetch(`/api/clients?id=${id}&userId=${getUserId()}&clinicId=${getClinicId()}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Cliente eliminado exitosamente")
        await fetchClients()
      } else {
        showError(result.error || "Error al eliminar el cliente")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      showError("Error al eliminar el cliente")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      showWarning("Por favor completa todos los campos requeridos")
      return
    }

    // Validar formato de teléfono (solo números, 10 dígitos)
    if (!/^\d{10}$/.test(formData.phone)) {
      showWarning("El teléfono debe tener 10 dígitos")
      return
    }

    // Validar formato de email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showWarning("Por favor ingresa un email válido")
      return
    }

    try {
      const url = "/api/clients"
      const method = editingClient ? "PUT" : "POST"
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        statusId: parseInt(formData.statusId),
        userId: getUserId(),
        clinicId: getClinicId(),
        ...(editingClient && { id: editingClient.id }),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(editingClient ? "Cliente actualizado exitosamente" : "Cliente agregado exitosamente")
        setIsDialogOpen(false)
        await fetchClients()
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
  }

  const handleFilterClick = (statusName) => {
    setActiveFilter(statusName)
    if (statusName) {
      setFilteredClients(clients.filter((c) => c.status_name === statusName))
    } else {
      setFilteredClients(clients)
    }
  }

  const handleSearch = (query) => {
    const filtered = clients.filter(
      (c) =>
        c.first_name.toLowerCase().includes(query.toLowerCase()) ||
        c.last_name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredClients(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando clientes..." />
  }

  if (!getUserId() || !getClinicId()) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Cliente
        </Button>
      </div>

      <ClientsStats clients={clients} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <ClientsTable clients={filteredClients} onEdit={handleEdit} onDelete={handleDelete} onSearch={handleSearch} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    handleInputChange("phone", value)
                  }}
                  maxLength={10}
                  placeholder="10 dígitos"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="opcional"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                  placeholder="opcional"
                />
              </div>

              <div>
                <Label htmlFor="statusId">Estado</Label>
                <Select value={formData.statusId} onValueChange={(value) => handleInputChange("statusId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                {editingClient ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
