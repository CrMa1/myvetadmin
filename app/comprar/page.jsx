"use client"

import { useEffect, useState } from "react"
import { PricingCard } from "@/components/landing/pricing/pricing-card"
import { RegistrationForm } from "@/components/landing/pricing/registration-form"
import { CheckoutForm } from "@/components/landing/pricing/checkout-form"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingFooter } from "@/components/landing/footer"

const FORM_DATA_KEY = "vetsystem_registration_form_data"

export default function ComprarPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [step, setStep] = useState("plans")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [userData, setUserData] = useState(null)
  const [savedFormData, setSavedFormData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(FORM_DATA_KEY)
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setSavedFormData(parsedData)
        console.log("[v0] Loaded saved form data from localStorage")
      } catch (error) {
        console.error("[v0] Error parsing saved form data:", error)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/plans")
        const data = await response.json()
        setPlans(data.plans || [])
      } catch (error) {
        console.error("[v0] Error loading plans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleSelectPlan = async (plan, cycle) => {
    setSelectedPlan(plan)
    setBillingCycle(cycle)
    setStep("register")
  }

  const handleRegistrationSubmit = async (formData) => {
    console.log("[v0] Submitting registration with data:", formData)

    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData))
      console.log("[v0] Form data saved to localStorage")
    } catch (error) {
      console.error("[v0] Error saving form data:", error)
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("[v0] Registration response:", data)

      if (!response.ok) {
        alert(data.error || "Error al registrar usuario")
        return
      }

      setUserData({
        ...formData,
        userId: data.data?.id,
        clinicId: data.data?.clinic?.id,
      })
      setStep("checkout")

      localStorage.removeItem(FORM_DATA_KEY)
      setSavedFormData(null)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      alert("Error al procesar el registro. Por favor intenta de nuevo.")
    }
  }

  const handleBackToRegister = () => {
    setStep("register")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <>
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 md:py-20">
        {step === "plans" && (
          <>
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h1 className="text-4xl font-bold text-balance text-foreground mb-4">Planes y Precios</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Elige el plan que mejor se adapte a las necesidades de tu clínica veterinaria. Todos los planes incluyen
                14 días de prueba gratuita.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-12">
              <Button
                variant={billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => setBillingCycle("monthly")}
              >
                Mensual
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "outline"}
                onClick={() => setBillingCycle("yearly")}
                className="relative"
              >
                Anual
                <span className="absolute -top-3 -right-3 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  Ahorra 17%
                </span>
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-16">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} onSelectPlan={handleSelectPlan} />
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Lo que Incluyen Todos los Planes</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Actualizaciones automáticas",
                  "Soporte técnico",
                  "Respaldo diario de información",
                  "Seguridad SSL",
                  "Acceso desde cualquier dispositivo",
                  "Reportes y estadísticas",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="h-5 w-5 text-secondary shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === "register" && selectedPlan && (
          <RegistrationForm
            plan={selectedPlan}
            billingCycle={billingCycle}
            onSubmit={handleRegistrationSubmit}
            onBack={() => setStep("plans")}
            initialData={savedFormData}
          />
        )}

        {step === "checkout" && selectedPlan && userData && (
          <CheckoutForm
            plan={selectedPlan}
            billingCycle={billingCycle}
            userData={userData}
            onBack={handleBackToRegister}
          />
        )}
      </div>
      <LandingFooter />
    </>
  )
}
