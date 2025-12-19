"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { MessageCircle, ShieldCheck } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("student")
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors = {}

    if (!name) newErrors.name = "Nama wajib diisi"

    if (!email) {
      newErrors.email = "Email wajib diisi"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!password) {
      newErrors.password = "Password wajib diisi"
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok"
    }

    if (role === "instructor") {
      if (!otpCode) {
        setOtpError("Kode verifikasi wajib diisi untuk instructor")
        newErrors.otp = true
      } else if (otpCode !== "292929") {
        setOtpError("Kode verifikasi salah. Hubungi admin untuk mendapatkan kode yang benar.")
        newErrors.otp = true
      } else {
        setOtpError("")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContactAdmin = () => {
    const message = encodeURIComponent(
      `Halo Admin SIBEO, saya ${name || "[Nama Lengkap]"} ingin mendaftar sebagai Instructor. Mohon informasinya untuk kode verifikasi.`,
    )
    const whatsappUrl = `https://wa.me/6285216069919?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      console.log("[v0] Attempting registration...", { email, role })
      await register(name, email, password, role)

      setOtpCode("")
      setOtpError("")

      toast({
        title: "Registrasi berhasil!",
        description: "Akun Anda telah dibuat. Selamat datang di SIBEO!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Registration failed:", error)

      let errorTitle = "Registrasi gagal"
      let errorDescription = error.message || "Terjadi kesalahan saat mendaftar"

      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        errorDescription = "Email sudah terdaftar. Silakan gunakan email lain atau login."
      } else if (error.message.includes("tidak dapat terhubung") || error.message.includes("CORS")) {
        errorTitle = "Server tidak dapat diakses"
        errorDescription = "Backend sedang tidak aktif atau ada masalah koneksi. Hubungi administrator."
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (value) => {
    setRole(value)
    if (value === "student") {
      setOtpCode("")
      setOtpError("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Daftar ke SIBEO</CardTitle>
            <CardDescription>Buat akun baru untuk memulai belajar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label>Daftar Sebagai</Label>
                <RadioGroup value={role} onValueChange={handleRoleChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal cursor-pointer">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instructor" id="instructor" />
                    <Label htmlFor="instructor" className="font-normal cursor-pointer">
                      Instructor
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {role === "instructor" && (
                <div className="space-y-3">
                  <Alert className="bg-primary/5 border-primary/20">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      Pendaftaran instructor memerlukan verifikasi admin. Hubungi admin untuk mendapatkan kode
                      verifikasi.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleContactAdmin}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hubungi Admin untuk Verifikasi
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="otpCode">Kode OTP Instructor</Label>
                    <Input
                      id="otpCode"
                      placeholder="Masukkan kode verifikasi"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value)
                        setOtpError("")
                      }}
                      className={otpError ? "border-destructive" : ""}
                    />
                    {otpError && <p className="text-sm text-destructive">{otpError}</p>}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || (role === "instructor" && !otpCode)}>
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
