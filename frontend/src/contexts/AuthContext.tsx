

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
    const token = localStorage.getItem("access_token")
    if (token) {
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const response = await apiClient.getUserProfile()
      if (response.data) {
        setUser(response.data)
      } else {
        // Token might be invalid
        apiClient.clearToken()
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      apiClient.clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })
      if (response.data) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
        })
        return { success: true }
      } else {
        return { success: false, error: response.error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  const register = async (userData: {
    email: string
    password: string
    password_confirm: string
    username: string
  }) => {
    try {
      const response = await apiClient.register(userData)
      if (response.data) {
        // Auto-login after successful registration
        setUser({
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
        })
        return { success: true }
      } else {
        return { success: false, error: response.error || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
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
