"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem("user")
    const storedClinic = localStorage.getItem("selectedClinic")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedClinic) {
      setSelectedClinic(JSON.parse(storedClinic))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        const userData = {
          ...result.data,
          planId: result.data.plan_id || result.data.planId,
          planName: result.planInfo?.plan_name || result.data.planName,
          sessionToken: result.sessionToken,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))

        if (result.data.clinics && result.data.clinics.length > 0) {
          if (result.data.clinics.length === 1) {
            // Solo un consultorio, seleccionarlo automáticamente
            setSelectedClinic(result.data.clinics[0])
            localStorage.setItem("selectedClinic", JSON.stringify(result.data.clinics[0]))
            router.push("/")
          } else {
            // Múltiples consultorios, ir a página de selección
            router.push("/seleccionar-consultorio")
          }
        } else {
          router.push("/")
        }

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, error: "Error al iniciar sesión" }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (result.success) {
        const userWithPlan = {
          ...result.data,
          planId: result.data.plan_id || result.data.planId,
          planName: result.data.plan_name || result.data.planName,
        }

        setUser(userWithPlan)
        localStorage.setItem("user", JSON.stringify(userWithPlan))

        if (result.data.clinic) {
          setSelectedClinic(result.data.clinic)
          localStorage.setItem("selectedClinic", JSON.stringify(result.data.clinic))
        }

        router.push("/")
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("[v0] Register error:", error)
      return { success: false, error: "Error al registrar usuario" }
    }
  }

  const selectClinic = (clinic) => {
    setSelectedClinic(clinic)
    localStorage.setItem("selectedClinic", JSON.stringify(clinic))
    router.push("/")
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, sessionToken: user?.sessionToken }),
      })
      setUser(null)
      setSelectedClinic(null)
      localStorage.removeItem("user")
      localStorage.removeItem("selectedClinic")
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const getUserId = () => user?.id || null
  const getClinicId = () => selectedClinic?.id || null

  const refreshUser = async () => {
    try {
      if (!user?.id) return

      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const updatedUser = {
            ...user,
            ...result.data,
            planId: result.data.plan_id || result.data.planId,
            planName: result.data.plan_name || result.data.planName,
          }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      }
    } catch (error) {
      console.error("[v0] Error refreshing user:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedClinic,
        loading,
        login,
        register,
        logout,
        selectClinic,
        getUserId,
        getClinicId,
        refreshUser, // Export refreshUser function
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
