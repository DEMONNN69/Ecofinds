

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../lib/api"

interface User {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  profile_image_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    email: string
    password: string
    password_confirm: string
    username: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    if (apiClient.isAuthenticated()) {
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getUserProfile()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const userData = await apiClient.login({ email, password })
      setUser(userData)
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed"
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: {
    email: string
    password: string
    password_confirm: string
    username: string
  }) => {
    try {
      const registeredUser = await apiClient.register(userData)
      setUser(registeredUser)
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed"
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
