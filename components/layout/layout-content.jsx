"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"

export function LayoutContent({ children }) {
  const pathname = usePathname()

  const publicRoutes = [
    "/login",
    "/registro",
    "/inicio",
    "/comprar",
    "/contacto",
    "/nosotros",
    "/recuperar-contrasena",
    "/restablecer-contrasena",
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
