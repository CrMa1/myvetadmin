"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useState } from "react"

export function PricingCard({ plan, billingCycle, onSelectPlan }) {
  const [isLoading, setIsLoading] = useState(false)

  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly
  const displayPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price)

  const savingsPercentage = plan.discount_yearly

  const handleSelect = async () => {
    setIsLoading(true)
    try {
      await onSelectPlan(plan, billingCycle)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative flex flex-col border-2 transition-all hover:border-primary hover:shadow-xl">
      {plan.name.includes("Profesional") && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-secondary text-secondary-foreground">Más Popular</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-foreground">{displayPrice}</span>
            <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mes" : "año"}</span>
          </div>
          {billingCycle === "yearly" && savingsPercentage > 0 && (
            <p className="mt-2 text-sm text-secondary font-medium">Ahorra {savingsPercentage}% pagando anualmente</p>
          )}
        </div>

        <ul className="space-y-3">
          {plan.features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
              <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSelect} disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Procesando..." : "Seleccionar Plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
