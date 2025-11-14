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

export function CheckoutForm({ plan, billingCycle, userData, onBack, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [error, setError] = useState(null)
  const [stripe, setStripe] = useState(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [stripeError, setStripeError] = useState(null)

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
      console.log("[v0] Plan:", plan)
      console.log("[v0] Billing cycle:", billingCycle)

      const productId = plan.stripe_id
      console.log("[v0] Product ID:", productId)

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userData,
        }),
      })

      const data = await response.json()
      console.log("[v0] Checkout API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de pago")
      }

      console.log("[v0] Checkout session created successfully")
      const extractedSessionId = data.clientSecret.split("_secret_")[0]
      setSessionId(extractedSessionId)
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
    if (!sessionId || paymentCompleted) return

    const checkPaymentStatus = async () => {
      try {
        console.log("[v0] Checking payment status for session:", sessionId)

        const response = await fetch("/api/stripe/check-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()
        console.log("[v0] Payment status response:", data)

        if (data.status === "expired" || data.status === "canceled") {
          setStripeError("La sesión de pago ha expirado o fue cancelada. Por favor intenta nuevamente.")
          setPaymentCompleted(true)
          return
        }

        if (data.payment_status === "unpaid" && data.last_error) {
          const errorMessage = getStripeErrorMessage(data.last_error)
          setStripeError(errorMessage)
          setPaymentCompleted(true)
          return
        }

        if (data.payment_status === "paid" && data.status === "complete") {
          console.log("[v0] Payment succeeded! Registering user...")
          setPaymentCompleted(true)

          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })

          const registerData = await registerResponse.json()
          console.log("[v0] Registration response:", registerData)

          if (registerData.success) {
            console.log("[v0] User registered successfully:", registerData.data)
            localStorage.removeItem("vetsystem_registration_form_data")
            if (onSuccess) {
              onSuccess(userData.firstName)
            }
          } else {
            console.error("[v0] Registration failed:", registerData.error)
            setStripeError(`Error al completar el registro: ${registerData.error}. Por favor contacta soporte.`)
          }
        }
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
        setStripeError("Error al verificar el estado del pago. Por favor contacta soporte.")
      }
    }

    const interval = setInterval(checkPaymentStatus, 2000)

    return () => clearInterval(interval)
  }, [sessionId, userData, paymentCompleted, onSuccess])

  const getStripeErrorMessage = (lastError) => {
    if (!lastError) return "Error desconocido en el pago."

    const errorCode = lastError.code || lastError.decline_code

    const errorMessages = {
      card_declined: "Tu tarjeta fue rechazada. Por favor intenta con otra tarjeta.",
      insufficient_funds: "Fondos insuficientes. Por favor verifica el saldo de tu tarjeta.",
      expired_card: "Tu tarjeta ha expirado. Por favor usa una tarjeta válida.",
      incorrect_cvc: "El código de seguridad (CVC) es incorrecto.",
      processing_error: "Error al procesar el pago. Por favor intenta nuevamente.",
      incorrect_number: "El número de tarjeta es incorrecto.",
      invalid_expiry_month: "El mes de vencimiento es inválido.",
      invalid_expiry_year: "El año de vencimiento es inválido.",
      authentication_required: "Tu banco requiere autenticación adicional. Por favor completa la verificación.",
    }

    return errorMessages[errorCode] || lastError.message || "Error al procesar el pago. Por favor intenta nuevamente."
  }

  useEffect(() => {
    if (stripeError) {
      alert(stripeError)
    }
  }, [stripeError])

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button onClick={onBack} variant="outline">
        Volver
      </Button>

      {error ? (
        <Card>
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
          </CardContent>
        </Card>
      ) : !clientSecret || !stripe ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Preparando formulario de pago...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
