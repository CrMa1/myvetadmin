"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function usePlanFeatures() {
  const { user } = useAuth()
  const [planFeatures, setPlanFeatures] = useState(null)
  const [planLimits, setPlanLimits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPlanData() {
      if (!user?.planId && !user?.plan_id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const planId = user.planId || user.plan_id
        const response = await fetch(`/api/plan-limits?planId=${planId}`)
        const result = await response.json()

        if (result.success) {
          setPlanFeatures(result.data.features)
          setPlanLimits(result.data.limits)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.error("[v0] Error fetching plan data:", err)
        setError("Error al cargar los datos del plan")
      } finally {
        setLoading(false)
      }
    }

    fetchPlanData()
  }, [user])

  return {
    planFeatures,
    planLimits,
    loading,
    error,
    hasPlanData: !!planFeatures && !!planLimits,
  }
}
