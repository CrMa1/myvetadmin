"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export function UpgradeErrorModal({ isOpen, onClose, error }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Error en la Actualización</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            {error || "No se pudo completar la actualización del plan. Por favor intenta nuevamente."}
          </p>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Si el problema persiste, por favor contacta a nuestro equipo de soporte para obtener ayuda.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
