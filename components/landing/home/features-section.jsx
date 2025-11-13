import { Users, Calendar, Package, DollarSign, BarChart3, Shield, Clock, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "Gestión de Pacientes",
    description: "Mantén un registro completo de todos tus pacientes con historial médico detallado.",
  },
  {
    icon: Calendar,
    title: "Agenda de Consultas",
    description: "Organiza citas y consultas con un sistema de calendario intuitivo.",
  },
  {
    icon: Package,
    title: "Control de Inventario",
    description: "Administra medicamentos, insumos y productos con alertas de stock bajo.",
  },
  {
    icon: DollarSign,
    title: "Contabilidad Integrada",
    description: "Lleva el control de ingresos, gastos y facturación desde una sola plataforma.",
  },
  {
    icon: BarChart3,
    title: "Reportes y Estadísticas",
    description: "Toma decisiones informadas con reportes detallados y visualizaciones.",
  },
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description: "Tus datos están protegidos con encriptación de nivel empresarial.",
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Accede a tu información en cualquier momento desde cualquier lugar.",
  },
  {
    icon: Smartphone,
    title: "Multi-dispositivo",
    description: "Funciona perfectamente en computadoras, tablets y smartphones.",
  },
]

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold text-balance text-foreground md:text-4xl mb-4">
            Todo lo que Necesitas en un Solo Sistema
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            VetSystem reúne todas las herramientas esenciales para administrar tu clínica veterinaria de manera
            eficiente y profesional.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-balance">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
