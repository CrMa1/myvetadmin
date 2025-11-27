"use client"

import { useEffect, useState } from "react"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingFooter } from "@/components/landing/footer"
import { TestimonialCard } from "@/components/landing/about/testimonial-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Users, Lightbulb, Award, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function NosotrosPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials")
        const data = await response.json()
        setTestimonials(data.testimonials || [])
      } catch (error) {
        console.error("[v0] Error loading testimonials:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const stats = [
    { value: "500+", label: "Clínicas Activas" },
    { value: "50K+", label: "Pacientes Gestionados" },
    { value: "99.9%", label: "Uptime Garantizado" },
    { value: "24/7", label: "Soporte Disponible" },
  ]

  const values = [
    {
      icon: Target,
      title: "Misión",
      description:
        "Simplificar la administración de clínicas veterinarias mediante tecnología innovadora y accesible, permitiendo que los profesionales se enfoquen en lo más importante: el cuidado de los animales.",
    },
    {
      icon: Lightbulb,
      title: "Visión",
      description:
        "Ser la plataforma líder en Latinoamérica para la gestión integral de clínicas veterinarias, reconocida por su innovación, facilidad de uso y compromiso con el bienestar animal.",
    },
    {
      icon: Users,
      title: "Valores",
      description:
        "Compromiso con la excelencia, innovación constante, transparencia en nuestras operaciones, y dedicación absoluta al éxito de nuestros clientes y el bienestar de los animales.",
    },
  ]

  const features = [
    "Desarrollado por veterinarios para veterinarios",
    "Actualizaciones constantes basadas en feedback real",
    "Soporte técnico en español disponible 24/7",
    "Seguridad y privacidad de datos garantizada",
    "Interfaz intuitiva sin curva de aprendizaje",
    "Integración con múltiples servicios",
  ]

  return (
    <>
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h1 className="text-4xl font-bold text-balance text-foreground md:text-5xl mb-6">
            Transformando la Gestión Veterinaria
          </h1>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">
            MyVetAdmin nació de la necesidad real de veterinarios que buscaban una solución integral, moderna y fácil de
            usar para administrar sus clínicas. Hoy somos la plataforma de confianza para cientos de profesionales en
            toda Latinoamérica.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="mb-20">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex rounded-lg bg-primary/10 p-3">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div className="mb-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-balance text-foreground mb-4">¿Por Qué Elegir MyVetAdmin?</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              No somos solo software, somos tu aliado en el crecimiento de tu clínica veterinaria
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 shrink-0 text-secondary mt-1" />
                <p className="text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lo que dicen nuestros clientes */}
        <div className="mb-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
              <Award className="h-4 w-4" />
              Testimonios Reales
            </div>
            <h2 className="text-3xl font-bold text-balance text-foreground mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Miles de veterinarios confían en MyVetAdmin para administrar sus clínicas
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-64">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="h-5 w-5 bg-muted animate-pulse rounded" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                      <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No hay testimonios disponibles en este momento</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-16 md:px-16 text-center">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold text-balance text-primary-foreground md:text-4xl">
              ¿Listo para Unirte a Nuestra Comunidad?
            </h2>
            <p className="text-lg text-primary-foreground/90 text-pretty">
              Únete a cientos de clínicas veterinarias que ya están transformando su forma de trabajar
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="group">
                <Link href="/comprar">
                  Ver Planes
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              >
                <Link href="/contacto">Contactar Ventas</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}
