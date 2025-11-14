"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from "@/contexts/auth-context"

export function ProtectedRoute({ children }) {
  const { user, selectedClinic, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && !selectedClinic && pathname !== "/seleccionar-consultorio") {
      router.push("/seleccionar-consultorio")
    }
  }, [user, selectedClinic, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!selectedClinic && pathname !== "/seleccionar-consultorio") {
    return null
  }

  return <>{children}</>
}
