"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const API_BASE = "https://uas-paw-kelompok9-sibeo.onrender.com"

interface User {
  id: number
  name: string
  email: string
  role: "student" | "instructor"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function extractErrorMessage(data: unknown, defaultMsg: string): string {
  if (typeof data === "string") return data
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === "string") return obj.message
    if (typeof obj.error === "string") return obj.error
    if (typeof obj.detail === "string") return obj.detail
    // Handle nested error object like {code, message}
    if (obj.message && typeof obj.message === "object") {
      const nested = obj.message as Record<string, unknown>
      if (typeof nested.message === "string") return nested.message
    }
  }
  return defaultMsg
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("sibeo-user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("sibeo-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json()

      const isSuccess = data.status === "success" || data.success === true || (res.ok && data.data)

      if (isSuccess) {
        const userData: User = {
          id: data.data?.id || data.user?.id || data.id,
          name: data.data?.name || data.user?.name || data.name,
          email: data.data?.email || data.user?.email || data.email || email,
          role: data.data?.role || data.user?.role || data.role || "student",
        }
        setUser(userData)
        localStorage.setItem("sibeo-user", JSON.stringify(userData))
        return { success: true }
      }

      const errorMsg = extractErrorMessage(data, "Login gagal")
      const lowerMsg = errorMsg.toLowerCase()

      if (
        res.status === 401 ||
        lowerMsg.includes("invalid") ||
        lowerMsg.includes("incorrect") ||
        lowerMsg.includes("wrong")
      ) {
        return { success: false, error: "Email atau password salah. Silakan coba lagi." }
      }

      if (res.status === 404 || lowerMsg.includes("not found") || lowerMsg.includes("tidak ditemukan")) {
        return { success: false, error: "Akun tidak ditemukan. Silakan daftar terlebih dahulu." }
      }

      return { success: false, error: errorMsg || "Login gagal. Silakan coba lagi." }
    } catch (err) {
      console.error("Login error:", err)
      return { success: false, error: "Gagal terhubung ke server. Periksa koneksi internet Anda." }
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      })
      const data = await res.json()

      const isSuccess =
        data.status === "success" || data.success === true || (res.ok && !data.error && res.status !== 409)

      if (isSuccess && data.data) {
        const userData: User = {
          id: data.data?.id || data.user?.id || data.id || 0,
          name: data.data?.name || data.user?.name || data.name || name,
          email: data.data?.email || data.user?.email || data.email || email,
          role: (data.data?.role || data.user?.role || data.role || role) as "student" | "instructor",
        }
        setUser(userData)
        localStorage.setItem("sibeo-user", JSON.stringify(userData))
        return { success: true }
      }

      const errorMsg = extractErrorMessage(data, "Registrasi gagal")
      const lowerMsg = errorMsg.toLowerCase()

      if (
        res.status === 409 ||
        lowerMsg.includes("email already") ||
        lowerMsg.includes("already registered") ||
        lowerMsg.includes("already exists") ||
        lowerMsg.includes("sudah terdaftar") ||
        lowerMsg.includes("duplicate")
      ) {
        return { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau login." }
      }

      if (lowerMsg.includes("required") || lowerMsg.includes("wajib") || lowerMsg.includes("missing")) {
        return { success: false, error: "Mohon lengkapi semua data yang diperlukan." }
      }

      return { success: false, error: errorMsg || "Registrasi gagal. Silakan coba lagi." }
    } catch (err) {
      console.error("Register error:", err)
      return { success: false, error: "Gagal terhubung ke server. Periksa koneksi internet Anda." }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("sibeo-user")
    fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {})
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
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
