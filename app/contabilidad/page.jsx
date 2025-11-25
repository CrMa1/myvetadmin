"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountingTable } from "@/components/accounting/accounting-table"
import { StatsCard } from "@/components/shared/stats-card"
import { AccountingChart } from "@/components/accounting/accounting-chart"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { AccountingModal } from "@/components/accounting/accounting-modal"

export default function AccountingPage() {
  const { getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, AlertContainer } = useAlertToast()
  const [accounting, setAccounting] = useState([])
  const [filteredAccounting, setFilteredAccounting] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [consultationIncome, setConsultationIncome] = useState(0)

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId) {
      fetchAccounting()
      fetchCategories()
      fetchConsultationIncome()
    }
  }, [getUserId, getClinicId])

  const fetchAccounting = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/accounting?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        setAccounting(result.data)
        setFilteredAccounting(result.data)
      } else {
        showError(result.error || "Error al cargar registros")
      }
    } catch (error) {
      console.error("Error fetching accounting:", error)
      showError("Error al cargar los registros")
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultationIncome = async () => {
    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/consultations?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()

      if (result.success) {
        const completedConsultations = result.data.filter((c) => c.status === "Completada")
        const total = completedConsultations.reduce((sum, c) => sum + Number.parseFloat(c.cost || 0), 0)
        setConsultationIncome(total)
      }
    } catch (error) {
      console.error("Error fetching consultation income:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/conta-categories")
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      } else {
        showWarning("No se pudieron cargar las categorías")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return

    try {
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/accounting?id=${id}&userId=${userId}&clinicId=${clinicId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Registro eliminado exitosamente")
        await fetchAccounting()
      } else {
        showError(result.error || "Error al eliminar el registro")
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      showError("Error al eliminar el registro")
    }
  }

  const handleSave = async (formData, record) => {
    try {
      const url = "/api/accounting"
      const method = record ? "PUT" : "POST"
      const userId = getUserId()
      const clinicId = getClinicId()
      const body = record
        ? {
            type: formData.type,
            categoryId: formData.category,
            amount: formData.amount,
            description: formData.description,
            date: formData.date,
            id: record.id,
            userId,
            clinicId,
          }
        : {
            type: formData.type,
            categoryId: formData.category,
            amount: formData.amount,
            description: formData.description,
            date: formData.date,
            userId,
            clinicId,
          }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(record ? "Registro actualizado exitosamente" : "Registro agregado exitosamente")
        await fetchAccounting()
        return result
      } else {
        return { success: false, error: result.error || "Error al guardar el registro" }
      }
    } catch (error) {
      console.error("Error saving record:", error)
      return { success: false, error: "Error al guardar el registro" }
    }
  }

  const handleFilterClick = (type) => {
    setActiveFilter(type)
    if (type) {
      setFilteredAccounting(accounting.filter((a) => a.type === type))
    } else {
      setFilteredAccounting(accounting)
    }
  }

  const handleClearFilter = () => {
    setActiveFilter(null)
    setFilteredAccounting(accounting)
  }

  const handleSearch = (query) => {
    const filtered = accounting.filter(
      (a) =>
        (a.category?.toLowerCase() || "").includes(query.toLowerCase()) ||
        (a.description?.toLowerCase() || "").includes(query.toLowerCase()),
    )
    setFilteredAccounting(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando registros contables..." />
  }

  const userId = getUserId()
  const clinicId = getClinicId()

  if (!userId || !clinicId) {
    return <div className="p-8">Por favor selecciona un consultorio</div>
  }

  const accountingIncome = accounting
    .filter((a) => a.type === "Ingreso")
    .reduce((sum, a) => sum + Number.parseFloat(a.amount || 0), 0)
  const totalIncome = accountingIncome + consultationIncome
  const totalExpenses = accounting
    .filter((a) => a.type === "Egreso")
    .reduce((sum, a) => sum + Number.parseFloat(a.amount || 0), 0)
  const balance = totalIncome - totalExpenses
  const totalTransactions = accounting.length

  return (
    <div className="p-8">
      <AlertContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Contabilidad</h1>
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          label="Ingresos Totales"
          subtitle="Total de entradas"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          onClick={() => handleFilterClick("Ingreso")}
          isActive={activeFilter === "Ingreso"}
          variant="success"
        />
        <StatsCard
          label="Egresos Totales"
          subtitle="Total de salidas"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          trend={{ value: 0, isPositive: false }}
          onClick={() => handleFilterClick("Egreso")}
          isActive={activeFilter === "Egreso"}
          variant="danger"
        />
        <StatsCard
          label="Balance"
          subtitle="Ganancia/Pérdida neta"
          value={formatCurrency(balance)}
          icon={DollarSign}
          trend={{ value: 0, isPositive: balance >= 0 }}
          variant={balance >= 0 ? "success" : "danger"}
        />
        <StatsCard
          label="Transacciones"
          subtitle="Registros totales"
          value={totalTransactions}
          icon={Activity}
          trend={{ value: 0, isPositive: true }}
          onClick={() => handleFilterClick(null)}
          isActive={activeFilter === null}
        />
      </div>

      <AccountingChart accounting={accounting} />
      <br />
      <AccountingTable
        accounting={filteredAccounting}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterType={activeFilter}
        onClearFilter={handleClearFilter}
      />

      <AccountingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={editingRecord}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  )
}
