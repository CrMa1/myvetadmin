import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Contenido de texto */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Sistema líder en gestión veterinaria
            </div>

            <h1 className="text-4xl font-bold text-balance leading-tight text-foreground md:text-5xl lg:text-6xl">
              Administra tu Clínica Veterinaria con <span className="text-primary">Eficiencia Total</span>
            </h1>

            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Simplifica la gestión de pacientes, consultas, inventario y finanzas. Todo lo que necesitas para llevar tu
              clínica veterinaria al siguiente nivel.
            </p>

            <ul className="space-y-3">
              {[
                "Control completo de pacientes e historial médico",
                "Gestión de citas y consultas",
                "Inventario y control de medicamentos",
                "Reportes financieros y contabilidad",
                "Acceso desde cualquier dispositivo",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 shrink-0 text-secondary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/comprar">
                  Ver Planes y Precios
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#caracteristicas">Conocer Más</Link>
              </Button>
            </div>
          </div>

          {/* Imagen del hero */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-2xl">
              <img
                src="/veterinarian-using-modern-tablet-computer-in-clini.jpg"
                alt="Veterinario usando VetSystem"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Decoraciones */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-secondary/20 blur-3xl"></div>
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
