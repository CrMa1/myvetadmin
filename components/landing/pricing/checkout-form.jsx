"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStripePublishableKey } from "@/lib/stripe-config"

let stripePromise = null

function getStripePromise() {
  if (stripePromise) return stripePromise

  const key = getStripePublishableKey()
  if (!key) {
    console.error("[v0] Cannot initialize Stripe: No publishable key found")
    return null
  }

  try {
    stripePromise = loadStripe(key)
    console.log("[v0] Stripe initialized successfully")
  } catch (error) {
    console.error("[v0] Error loading Stripe:", error)
    return null
  }

  return stripePromise
}

export function CheckoutForm({ plan, billingCycle, userData, onBack }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)
  const [stripe, setStripe] = useState(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    const stripeInstance = getStripePromise()
    if (!stripeInstance) {
      setError(
        "La configuración de Stripe no está disponible. Por favor verifica que la integración esté correctamente configurada.",
      )
    } else {
      setStripe(stripeInstance)
    }
  }, [])

  const fetchClientSecret = useCallback(async () => {
    try {
      console.log("[v0] Creating checkout session...")

      const productId = `plan-${plan.name.toLowerCase().replace(" ", "-")}-${billingCycle}`

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de pago")
      }

      console.log("[v0] Checkout session created successfully")
      return data.clientSecret
    } catch (err) {
      console.error("[v0] Error fetching client secret:", err)
      setError(err.message)
      return null
    }
  }, [plan, billingCycle, userData])

  useEffect(() => {
    if (stripe) {
      fetchClientSecret().then((secret) => {
        if (secret) setClientSecret(secret)
      })
    }
  }, [fetchClientSecret, stripe])

  useEffect(() => {
    if (!clientSecret || !stripe || paymentCompleted) return

    const checkPaymentStatus = async () => {
      try {
        const stripeInstance = await stripe
        const { error: retrieveError, paymentIntent } = await stripeInstance.retrievePaymentIntent(
          clientSecret.split("_secret_")[0],
        )

        if (retrieveError) {
          console.error("[v0] Error retrieving payment intent:", retrieveError)
          return
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
          console.log("[v0] Payment succeeded, registering user...")
          setPaymentCompleted(true)

          // Registrar usuario después de pago exitoso
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })

          const data = await response.json()

          if (data.success) {
            console.log("[v0] User registered successfully:", data.data)
            // Limpiar localStorage solo después de registro exitoso
            localStorage.removeItem("vetsystem_registration_form_data")
            alert("¡Registro y pago completados exitosamente! Por favor inicia sesión.")
            window.location.href = "/login"
          } else {
            console.error("[v0] Registration failed:", data.error)
            alert(`Error al completar el registro: ${data.error}. Por favor contacta soporte.`)
          }
        }
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
      }
    }

    // Revisar el estado del pago cada 2 segundos
    const interval = setInterval(checkPaymentStatus, 2000)

    return () => clearInterval(interval)
  }, [clientSecret, stripe, userData, paymentCompleted])

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Error de Configuración</CardTitle>
          <CardDescription>Hubo un problema al inicializar el sistema de pagos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-destructive">{error}</p>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Información técnica:</p>
            <p>
              Si eres el administrador del sistema, verifica que la variable de entorno{" "}
              <code className="bg-background px-2 py-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> esté
              configurada correctamente en tu proyecto de Vercel.
            </p>
          </div>
          <Button onClick={onBack}>Volver</Button>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret || !stripe) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Preparando formulario de pago...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button onClick={onBack} variant="outline">
        Volver
      </Button>

      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  )
}
