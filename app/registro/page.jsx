"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    clinicEmail: "",
    clinicCity: "",
    clinicState: "",
    clinicPostalCode: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (!formData.clinicName || !formData.clinicAddress || !formData.clinicPhone) {
      setError("Los datos del consultorio son requeridos")
      return
    }

    setLoading(true)

    const result = await register(formData)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-4xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear cuenta</h1>
          <p className="text-muted-foreground">Únete a MyVetAdmin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="55-1234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Datos del Consultorio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clinicName">Nombre del Consultorio *</Label>
                <Input
                  id="clinicName"
                  name="clinicName"
                  placeholder="Clínica Veterinaria San Francisco"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clinicAddress">Dirección *</Label>
                <Textarea
                  id="clinicAddress"
                  name="clinicAddress"
                  placeholder="Calle Principal #123, Colonia Centro"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Teléfono del Consultorio *</Label>
                <Input
                  id="clinicPhone"
                  name="clinicPhone"
                  type="tel"
                  placeholder="55-1234-5678"
                  value={formData.clinicPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Email del Consultorio</Label>
                <Input
                  id="clinicEmail"
                  name="clinicEmail"
                  type="email"
                  placeholder="contacto@clinica.com"
                  value={formData.clinicEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicCity">Ciudad</Label>
                <Input
                  id="clinicCity"
                  name="clinicCity"
                  placeholder="Ciudad de México"
                  value={formData.clinicCity}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicState">Estado</Label>
                <Input
                  id="clinicState"
                  name="clinicState"
                  placeholder="CDMX"
                  value={formData.clinicState}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicPostalCode">Código Postal</Label>
                <Input
                  id="clinicPostalCode"
                  name="clinicPostalCode"
                  placeholder="01000"
                  value={formData.clinicPostalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
