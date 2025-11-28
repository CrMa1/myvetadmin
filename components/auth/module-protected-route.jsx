"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePlanFeatures } from "@/hooks/use-plan-features"
import { canAccessRoute } from "@/lib/plan-manager"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModuleProtectedRoute({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { planFeatures, loading } = usePlanFeatures()

  useEffect(() => {
    if (!loading && planFeatures) {
      const hasAccess = canAccessRoute(planFeatures, pathname)

      if (!hasAccess) {
        router.push("/")
      }
    }
  }, [pathname, planFeatures, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!planFeatures) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No se pudo cargar la información de tu plan. Por favor, recarga la página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const hasAccess = canAccessRoute(planFeatures, pathname)

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Tu plan actual no incluye acceso a este módulo.</p>
            <Button onClick={() => router.push("/")}>Volver al Dashboard</Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
