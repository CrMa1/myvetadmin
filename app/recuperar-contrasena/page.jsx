"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { clinicConfig } from "@/lib/config"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [devToken, setDevToken] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setDevToken("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        // Solo para desarrollo
        if (data.devToken) {
          setDevToken(data.devToken)
        }
      } else {
        setError(data.error || "Error al procesar la solicitud")
      }
    } catch (error) {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{clinicConfig.logo}</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Recuperar Contraseña</h1>
          <p className="text-muted-foreground text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/10 text-primary text-sm p-4 rounded-md border border-primary/20">{message}</div>

            {devToken && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-xs text-muted-foreground mb-2">Token de desarrollo:</p>
                <Link
                  href={`/restablecer-contrasena?token=${devToken}`}
                  className="text-sm text-primary hover:underline break-all"
                >
                  Ir a restablecer contraseña
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </Card>
    </div>
  )
}
