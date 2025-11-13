import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-16 md:px-16 md:py-24">
          {/* Decoraciones de fondo */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold text-balance text-primary-foreground md:text-4xl lg:text-5xl">
              ¿Listo para Transformar tu Clínica Veterinaria?
            </h2>
            <p className="text-lg text-primary-foreground/90 text-pretty leading-relaxed">
              Únete a cientos de clínicas que ya confían en VetSystem para administrar su negocio. Comienza hoy y obtén
              14 días de prueba gratuita.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="group">
                <Link href="/comprar">
                  Comenzar Ahora
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
    </section>
  )
}
