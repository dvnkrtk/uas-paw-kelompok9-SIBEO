"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "./api"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      console.log("[v0] Login response:", response)

      const userData = response.data || response
      const userInfo = {
        id: userData.user_id || userData.id,
        name: userData.name || email.split("@")[0],
        email: userData.email || email,
        role: userData.role || "student",
      }

      setUser(userInfo)
      localStorage.setItem("user", JSON.stringify(userInfo))

      if (userData.token) {
        localStorage.setItem("token", userData.token)
      }

      return userInfo
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const response = await authService.register(name, email, password, role)
      console.log("[v0] Register response:", response)

      const userData = response.data || response
      const userInfo = {
        id: userData.user_id || userData.id,
        name: name,
        email: email,
        role: role,
      }

      setUser(userInfo)
      localStorage.setItem("user", JSON.stringify(userInfo))

      if (userData.token) {
        localStorage.setItem("token", userData.token)
      }

      return userInfo
    } catch (error) {
      console.error("[v0] Register error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
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
