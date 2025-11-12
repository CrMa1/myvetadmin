"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Building2, MapPin, Phone } from "lucide-react"

export default function SelectClinicPage() {
  const { user, selectClinic, selectedClinic } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no hay usuario, redirigir a login
    if (!user) {
      router.push("/login")
      return
    }

    // Si ya hay un consultorio seleccionado, redirigir al dashboard
    if (selectedClinic) {
      router.push("/")
      return
    }

    // Si solo hay un consultorio, seleccionarlo automáticamente
    if (user.clinics && user.clinics.length === 1) {
      selectClinic(user.clinics[0])
    }
  }, [user, selectedClinic, router, selectClinic])

  if (!user || !user.clinics) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Selecciona un Consultorio</h1>
          <p className="text-muted-foreground">Elige el consultorio con el que deseas trabajar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
              onClick={() => selectClinic(clinic)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{clinic.name}</h3>

                  {clinic.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                  )}

                  {clinic.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full mt-4 btn-primary">Acceder a este consultorio</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
