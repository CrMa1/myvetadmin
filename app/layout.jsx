import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { clinicConfig } from "@/lib/config"
import { AuthProvider } from "@/contexts/auth-context"
import { LayoutContent } from "@/components/layout/layout-content"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: `${clinicConfig.name} - Sistema de Gestión`,
  description: "Sistema de gestión integral para clínica veterinaria",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
