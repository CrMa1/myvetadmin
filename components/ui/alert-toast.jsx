"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export function AlertToast({ type = "info", message, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-800 dark:text-green-200",
      iconColor: "text-green-600 dark:text-green-400",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50 dark:bg-red-950",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-800 dark:text-red-200",
      iconColor: "text-red-600 dark:text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-800 dark:text-yellow-200",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  }

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${
        isExiting ? "animate-fade-out-right" : "animate-fade-in-right"
      }`}
    >
      <div
        className={`${bgColor} ${borderColor} ${textColor} border-l-4 p-4 rounded-lg shadow-lg flex items-start gap-3`}
      >
        <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button onClick={handleClose} className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function useAlertToast() {
  const [alerts, setAlerts] = useState([])

  const showAlert = (type, message, duration = 5000) => {
    const id = Date.now()
    setAlerts((prev) => [...prev, { id, type, message, duration }])
  }

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return {
    showSuccess: (message, duration) => showAlert("success", message, duration),
    showError: (message, duration) => showAlert("error", message, duration),
    showWarning: (message, duration) => showAlert("warning", message, duration),
    showInfo: (message, duration) => showAlert("info", message, duration),
    AlertContainer: () => (
      <>
        {alerts.map((alert, index) => (
          <div key={alert.id} style={{ top: `${4 + index * 5.5}rem` }}>
            <AlertToast
              type={alert.type}
              message={alert.message}
              duration={alert.duration}
              onClose={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </>
    ),
  }
}
