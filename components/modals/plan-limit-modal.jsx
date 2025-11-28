"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { UpgradePlanModal } from "./upgrade-plan-modal"
import { UpgradeSuccessModal } from "./upgrade-success-modal"
import { UpgradeErrorModal } from "./upgrade-error-modal"
import { useAuth } from "@/contexts/auth-context"

export function PlanLimitModal({ isOpen, onClose, limitInfo }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [upgradeSubscription, setUpgradeSubscription] = useState(null)
  const [upgradeError, setUpgradeError] = useState(null)
  const { refreshUser } = useAuth()

  const { resourceType, current, limit, planName } = limitInfo || {}

  const resourceNames = {
    clients: "clientes",
    patients: "pacientes",
    consultations: "consultas",
    clinics: "consultorios",
    inventory: "productos de inventario",
    staff: "miembros del personal",
  }

  const handleViewPlans = () => {
    setShowUpgradeModal(true)
  }

  const handleUpgradeResult = async (subscription, error) => {
    if (error) {
      setUpgradeError(error)
      setShowErrorModal(true)
    } else if (subscription) {
      setUpgradeSubscription(subscription)
      setShowSuccessModal(true)
      // Refresh user data to get updated plan
      await refreshUser()
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    setShowUpgradeModal(false)
    onClose()
    // Reload the page to apply changes
    window.location.reload()
  }

  const handleErrorClose = () => {
    setShowErrorModal(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <DialogTitle className="text-xl">Límite de plan alcanzado</DialogTitle>
            </div>
            <DialogDescription className="text-base space-y-3 pt-2">
              <p>
                Has alcanzado el límite máximo de <strong>{resourceNames[resourceType] || resourceType}</strong> para tu
                plan <strong>{planName}</strong>.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  Registros actuales: <strong>{current}</strong> / <strong>{limit === -1 ? "Ilimitado" : limit}</strong>
                </p>
              </div>
              <p>
                Para continuar agregando más {resourceNames[resourceType]}, puedes actualizar tu plan en cualquier
                momento.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Entendido
            </Button>
            <Button onClick={handleViewPlans} className="flex-1">
              Ver planes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeResult}
      />

      <UpgradeSuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} subscription={upgradeSubscription} />

      <UpgradeErrorModal isOpen={showErrorModal} onClose={handleErrorClose} error={upgradeError} />
    </>
  )
}
