"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff } from "lucide-react"

export function RegistrationForm({ plan, billingCycle, onSubmit, onBack, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      clinicName: "",
      clinicAddress: "",
      clinicPhone: "",
      clinicEmail: "",
      clinicCity: "",
      clinicState: "",
      clinicPostalCode: "",
    },
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      console.log("[v0] Loading initial data into registration form:", initialData)
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "phone" || name === "clinicPhone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10)
      const updatedData = { ...formData, [name]: numericValue }
      setFormData(updatedData)

      try {
        localStorage.setItem("vetsystem_registration_form_data", JSON.stringify(updatedData))
        console.log("[v0] Form data auto-saved")
      } catch (error) {
        console.error("[v0] Error saving form data:", error)
      }

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
      return
    }

    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)

    try {
      localStorage.setItem("vetsystem_registration_form_data", JSON.stringify(updatedData))
    } catch (error) {
      console.error("[v0] Error saving form data:", error)
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateUnique = async () => {
    try {
      console.log("[v0] Validating email and phone uniqueness...")
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()
      console.log("[v0] Validation response:", data)

      if (!response.ok) {
        const newErrors = {}
        if (data.field === "email") {
          newErrors.email = data.error
        } else if (data.field === "phone") {
          newErrors.phone = data.error
        } else {
          newErrors.general = data.error
        }
        setErrors((prev) => ({ ...prev, ...newErrors }))
        return false
      }

      return true
    } catch (error) {
      console.error("[v0] Validation error:", error)
      setErrors((prev) => ({ ...prev, general: "Error al validar los datos" }))
      return false
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio"
    if (!formData.lastName.trim()) newErrors.lastName = "Los apellidos son obligatorios"
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "El teléfono debe tener 10 dígitos"
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }
    if (!formData.clinicName.trim()) newErrors.clinicName = "El nombre del consultorio es obligatorio"
    if (!formData.clinicAddress.trim()) newErrors.clinicAddress = "La dirección es obligatoria"
    if (!formData.clinicPhone.trim()) {
      newErrors.clinicPhone = "El teléfono del consultorio es obligatorio"
    } else if (formData.clinicPhone.length !== 10) {
      newErrors.clinicPhone = "El teléfono debe tener 10 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const isUnique = await validateUnique()
      if (!isUnique) {
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Validation passed, proceeding to payment...")
      await onSubmit(formData)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      setErrors((prev) => ({ ...prev, general: "Error al procesar el formulario" }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly
  const displayPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Plan seleccionado: <strong>{plan.name}</strong> - {displayPrice}/{billingCycle === "monthly" ? "mes" : "año"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.general && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {errors.general}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Datos Personales</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez García"
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@ejemplo.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono * (10 dígitos)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="5512345678"
                  maxLength="10"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Datos del Consultorio</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clinicName">Nombre del Consultorio *</Label>
                <Input
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="Clínica Veterinaria San Francisco"
                />
                {errors.clinicName && <p className="text-sm text-destructive">{errors.clinicName}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clinicAddress">Dirección *</Label>
                <Textarea
                  id="clinicAddress"
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  placeholder="Calle Principal #123, Colonia Centro"
                  rows={2}
                />
                {errors.clinicAddress && <p className="text-sm text-destructive">{errors.clinicAddress}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Teléfono del Consultorio * (10 dígitos)</Label>
                <Input
                  id="clinicPhone"
                  name="clinicPhone"
                  type="tel"
                  value={formData.clinicPhone}
                  onChange={handleChange}
                  placeholder="5512345678"
                  maxLength="10"
                  className={errors.clinicPhone ? "border-destructive" : ""}
                />
                {errors.clinicPhone && <p className="text-sm text-destructive">{errors.clinicPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Email del Consultorio</Label>
                <Input
                  id="clinicEmail"
                  name="clinicEmail"
                  type="email"
                  value={formData.clinicEmail}
                  onChange={handleChange}
                  placeholder="contacto@clinica.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicCity">Ciudad</Label>
                <Input
                  id="clinicCity"
                  name="clinicCity"
                  value={formData.clinicCity}
                  onChange={handleChange}
                  placeholder="Ciudad de México"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicState">Estado</Label>
                <Input
                  id="clinicState"
                  name="clinicState"
                  value={formData.clinicState}
                  onChange={handleChange}
                  placeholder="CDMX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicPostalCode">Código Postal</Label>
                <Input
                  id="clinicPostalCode"
                  name="clinicPostalCode"
                  value={formData.clinicPostalCode}
                  onChange={handleChange}
                  placeholder="01000"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Volver
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Validando..." : "Continuar al Pago"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
