"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { clinicConfig } from "@/lib/config"
import { LayoutDashboard, Dog, Stethoscope, Calculator, Package, Menu, X, ClipboardList, UserCircle, ShoppingCart, Building2, UserCheck } from 'lucide-react'
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Vender", href: "/vender", icon: ShoppingCart },
  { name: "Clientes", href: "/clientes", icon: UserCheck },
  { name: "Pacientes", href: "/pacientes", icon: Dog },
  { name: "Consultas", href: "/consultas", icon: ClipboardList },
  { name: "Personal", href: "/personal", icon: Stethoscope },
  { name: "Contabilidad", href: "/contabilidad", icon: Calculator },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Consultorios", href: "/consultorios", icon: Building2 },
  { name: "Mi Perfil", href: "/perfil", icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and clinic name */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{clinicConfig.logo}</span>
              <div>
                <h1 className="text-xl font-bold text-foreground">{clinicConfig.name}</h1>
                <p className="text-sm text-muted-foreground">{clinicConfig.tagline}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Clinic info */}
          <div className="p-4 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Contacto</p>
              <p>{clinicConfig.phone}</p>
              <p>{clinicConfig.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
