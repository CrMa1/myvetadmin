"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, DollarSign } from "lucide-react"

export function UpgradeSuccessModal({ isOpen, onClose, subscription }) {
  if (!subscription) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency || "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-secondary/20 p-3">
              <CheckCircle className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">¡Actualización Exitosa!</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            Tu plan ha sido actualizado exitosamente a{" "}
            <span className="font-semibold text-foreground">{subscription.planName}</span>
          </p>

          <div className="space-y-4 bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nuevo Costo</p>
                <p className="text-lg font-semibold">{formatAmount(subscription.amount, subscription.currency)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próxima Facturación</p>
                <p className="text-lg font-semibold">{formatDate(subscription.nextBillingDate)}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            La página se recargará para aplicar los cambios de tu nuevo plan
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} className="w-full">
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
