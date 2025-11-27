"use client"

import { useState } from "react"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
        setTimeout(() => {
          setSubmitStatus(null)
        }, 3000);
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "525512345678" // Número sin espacios ni símbolos
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre MyVetAdmin.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <>
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-4">Contacto y Soporte</h1>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Estamos aquí para ayudarte. Elige tu método de contacto preferido y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto mb-16">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h2>

            {/* Tarjetas de contacto */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Correo Electrónico</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Envíanos un correo para consultas generales o soporte técnico
                  </p>
                  <a href="mailto:soporte@myvetadmin.com" className="text-primary hover:underline font-medium">
                    soporte@myvetadmin.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                  <p className="text-sm text-muted-foreground mb-2">Llámanos de lunes a viernes de 9:00 a 18:00 hrs</p>
                  <a href="tel:+525512345678" className="text-primary hover:underline font-medium">
                    +52 55 1234 5678
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                  <p className="text-sm text-muted-foreground mb-2">Visítanos en nuestras oficinas</p>
                  <p className="text-foreground">Ciudad de México, México</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Horario de Atención</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Lunes a Viernes: 9:00 - 18:00 hrs</p>
                    <p>Sábados: 10:00 - 14:00 hrs</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón de WhatsApp destacado */}
            <Card className="border-2 border-secondary bg-secondary/5 hover:border-secondary/80 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-secondary/20 p-3">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Chat por WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      Chatea con nosotros directamente y obtén respuestas inmediatas
                    </p>
                  </div>
                </div>
                <Button onClick={handleWhatsAppClick} className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Abrir WhatsApp
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Respuesta en minutos • Lun-Vie 9:00-18:00
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Envíanos un Mensaje</h2>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@correo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+52 55 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Describe tu consulta o comentario..."
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="rounded-lg bg-primary/10 border border-primary p-4 text-sm text-primary">
                      ¡Mensaje enviado exitosamente! Te responderemos pronto.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive p-4 text-sm text-destructive">
                      Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Responderemos tu mensaje en un plazo de 24 horas hábiles
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ rápido */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Preguntas Frecuentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">¿Cuánto tiempo tarda la implementación?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La implementación es inmediata. Una vez contratado el plan, tendrás acceso instantáneo al sistema y
                  podrás comenzar a configurarlo según tus necesidades.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">¿Ofrecen capacitación?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sí, todos los planes incluyen tutoriales en video y documentación. Los planes Profesional y
                  Empresarial incluyen capacitación personalizada en vivo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">¿Puedo cancelar mi suscripción?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sí, puedes cancelar en cualquier momento sin penalizaciones. Tu información estará disponible hasta el
                  final del periodo pagado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">¿Mis datos están seguros?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Absolutamente. Utilizamos encriptación de nivel empresarial y realizamos respaldos automáticos
                  diarios. Cumplimos con todas las normativas de protección de datos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}
