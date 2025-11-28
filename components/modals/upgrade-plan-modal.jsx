"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function UpgradePlanModal({ isOpen, onClose, onUpgradeSuccess }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [billingCycle] = useState("monthly") // Can be extended to support yearly
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()

  useEffect(() => {
    if (isOpen) {
      fetchAvailablePlans()
    }
  }, [isOpen])

  const fetchAvailablePlans = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch("/api/plans/available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      })

      const data = await response.json()

      if (data.error) {
        console.log("[v0] Error loading plans:", data.error)
        return
      }

      setPlans(data.plans || [])
    } catch (error) {
      console.log("[v0] Error fetching available plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradePlan = async (planId) => {
    try {
      setUpgrading(true)
      const userId = getUserId()

      const response = await fetch("/api/plans/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, newPlanId: planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        onUpgradeSuccess(null, data.error)
        return
      }

      onUpgradeSuccess(data.subscription, null)
      onClose()
    } catch (error) {
      console.log("[v0] Error upgrading plan:", error)
      onUpgradeSuccess(null, "Error al procesar la actualización. Por favor intenta nuevamente.")
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Actualiza tu Plan</DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Selecciona un plan superior para desbloquear más funcionalidades
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ya tienes el plan más alto disponible. ¡Gracias por tu confianza!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-4">
            {plans.map((plan) => {
              const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly
              const displayPrice = new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 0,
              }).format(price)

              return (
                <Card key={plan.id} className="relative flex flex-col border-2 transition-all hover:border-primary">
                  {plan.name.includes("Profesional") && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground">Más Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-bold text-foreground">{displayPrice}</span>
                        <span className="text-sm text-muted-foreground">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {plan.features?.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {plan.features?.length > 5 && (
                        <li className="text-xs text-muted-foreground italic">
                          +{plan.features.length - 5} características más
                        </li>
                      )}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button onClick={() => handleUpgradePlan(plan.id)} disabled={upgrading} className="w-full">
                      {upgrading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : (
                        "Actualizar a este Plan"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
