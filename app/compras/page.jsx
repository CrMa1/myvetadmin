"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"
import { PurchasesStats } from "@/components/purchases/purchases-stats"
import { PurchasesTable } from "@/components/purchases/purchases-table"

export default function PurchasesPage() {
  const { user, getUserId } = useAuth()
  const { showError, AlertContainer } = useAlertToast()
  const [purchases, setPurchases] = useState([])
  const [filteredPurchases, setFilteredPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    if (getUserId()) {
      fetchPurchases()
    }
  }, [user])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/purchases?userId=${getUserId()}`)
      const result = await response.json()

      if (result.success) {
        setPurchases(result.data)
        setFilteredPurchases(result.data)
      } else {
        showError(result.error || "Error al cargar compras")
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
      showError("Error al cargar las compras")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterClick = (status) => {
    setActiveFilter(status)
    if (status) {
      setFilteredPurchases(purchases.filter((p) => p.status === status))
    } else {
      setFilteredPurchases(purchases)
    }
  }

  const handleSearch = (query) => {
    const filtered = purchases.filter(
      (p) =>
        p.customer_email?.toLowerCase().includes(query.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
        p.plan_name?.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredPurchases(filtered)
  }

  if (loading) {
    return <LoadingPage message="Cargando compras..." />
  }

  if (!getUserId()) {
    return <div className="page-container">Por favor inicia sesión</div>
  }

  return (
    <div className="page-container">
      <AlertContainer />
      <div className="page-header">
        <h1 className="page-title">Mis Compras</h1>
      </div>

      <PurchasesStats purchases={purchases} onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <PurchasesTable purchases={filteredPurchases} onSearch={handleSearch} />
    </div>
  )
}
