"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'
import Link from "next/link"

export function SuccessView({ userName }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-secondary">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-secondary" />
          </div>
          <CardTitle className="text-3xl">¡Compra Exitosa!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-xl font-semibold">¡Bienvenido al equipo, {userName}!</p>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              Tu cuenta ha sido creada exitosamente y tu pago ha sido procesado. Ya puedes comenzar a administrar tu
              clínica veterinaria con todas las herramientas que te ofrecemos.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-sm">
            <p className="font-semibold">¿Qué sigue?</p>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Inicia sesión con tu correo y contraseña</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Configura los detalles de tu consultorio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Comienza a gestionar pacientes y consultas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Explora todas las funcionalidades del sistema</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
