"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StaffTable } from "@/components/staff/staff-table"
import { StatsCard } from "@/components/shared/stats-card"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { Users, Stethoscope, UserCheck, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { StaffModal } from "@/components/staff/staff-modal"

export default function StaffPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && selectedClinic) {
      fetchStaff()
      fetchPositions()
    }
  }, [user, selectedClinic])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      if (!userId || !clinicId) return

      const response = await fetch(`/api/staff?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setStaff(result.data || [])
        setFilteredStaff(result.data || [])
      } else {
        showError(result.error || "Error al cargar el personal")
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      showError("Error al cargar el personal")
    } finally {
      setLoading(false)
    }
  }

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions")
      const result = await response.json()
      if (result.success) {
        setPositions(result.data)
      } else {
        showWarning("No se pudieron cargar los puestos")
      }
    } catch (error) {
      console.error("Error fetching positions:", error)
    }
  }

  const handleAdd = () => {
    setEditingStaff(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (member) => {
    setEditingStaff(member)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return

    try {
      const userId = getUserId()
      const clinicId = getClinicId()

      const response = await fetch(`/api/staff?id=${id}&userId=${userId}&clinicId=${clinicId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Empleado eliminado exitosamente")
        await fetchStaff()
      } else {
        showError(result.error || "Error al eliminar el empleado")
      }
    } catch (error) {
      console.error("Error deleting staff:", error)
      showError("Error al eliminar el empleado")
    }
  }

  const handleSubmit = async (formData, setApiError) => {
    if (!formData.name || !formData.lastName || !formData.position) {
      if (setApiError) setApiError("Por favor completa todos los campos requeridos")
      return
    }

    try {
      setIsSubmitting(true)
      const userId = getUserId()
      const clinicId = getClinicId()

      const url = "/api/staff"
      const method = editingStaff ? "PUT" : "POST"
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
        ...(editingStaff && { id: editingStaff.id }),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(editingStaff ? "Empleado actualizado exitosamente" : "Empleado agregado exitosamente")
        setIsDialogOpen(false)
        setEditingStaff(null)
        await fetchStaff()
      } else {
        if (setApiError) {
          setApiError(result.error || "Error al guardar el empleado")
        } else {
          showError(result.error || "Error al guardar el empleado")
        }
      }
    } catch (error) {
      console.error("Error saving staff:", error)
      if (setApiError) {
        setApiError("Error al guardar el empleado")
      } else {
        showError("Error al guardar el empleado")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFilterClick = (position) => {
    setActiveFilter(position)
    if (position) {
      setFilteredStaff(staff.filter((s) => s.position === position))
    } else {
      setFilteredStaff(staff)
    }
  }

  const handleSearch = (query) => {
    const filtered = staff.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.lastName.toLowerCase().includes(query.toLowerCase()) ||
        s.position.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredStaff(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando personal..." />
  }

  if (!user || !selectedClinic) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  const totalStaff = staff.length
  const veterinarians = staff.filter((s) => s.position === "Veterinario").length
  const activeStaff = staff.filter((s) => s.status === "Activo").length
  const totalPayroll = staff.reduce((sum, s) => sum + (Number.parseFloat(s.salary) || 0), 0)

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Personal</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          label="Total de Empleados"
          subtitle="Personal registrado"
          value={totalStaff}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          onClick={() => handleFilterClick(null)}
          isActive={activeFilter === null}
        />
        <StatsCard
          label="Veterinarios"
          subtitle="Personal médico"
          value={veterinarians}
          icon={Stethoscope}
          trend={{ value: 0, isPositive: true }}
          onClick={() => handleFilterClick("Veterinario")}
          isActive={activeFilter === "Veterinario"}
        />
        <StatsCard
          label="Personal Activo"
          subtitle="Empleados activos"
          value={activeStaff}
          icon={UserCheck}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          label="Nómina Total"
          subtitle="Gasto mensual"
          value={formatCurrency(totalPayroll)}
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <StaffTable staff={filteredStaff} onEdit={handleEdit} onDelete={handleDelete} onSearch={handleSearch} />

      <StaffModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingStaff={editingStaff}
        positions={positions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
