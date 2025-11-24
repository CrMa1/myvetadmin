"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientsStats } from "@/components/clients/clients-stats"
import { ClientsTable } from "@/components/clients/clients-table"
import { ClientModal } from "@/components/clients/client-modal"
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
  const [apiError, setApiError] = useState(null)

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
    setIsDialogOpen(true)
    setApiError(null)
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
    setApiError(null)
  }

  const handleDelete = async (id) => {
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

  const handleSubmit = async (formData, editingClient) => {
    try {
      const url = "/api/clients"
      const method = editingClient ? "PUT" : "POST"
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        statusId: Number.parseInt(formData.statusId),
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
        setApiError(result.error || "Error al guardar el cliente")
      }
    } catch (error) {
      console.error("Error saving client:", error)
      setApiError("Error al guardar el cliente")
    }
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

      <ClientModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        editingClient={editingClient}
        clientStatuses={clientStatuses}
        apiError={apiError}
      />
    </div>
  )
}
