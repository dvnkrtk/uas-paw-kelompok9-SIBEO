"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ErrorPopup } from "@/components/error-popup"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Mail, Lock, User, GraduationCap, BookOpen, MessageCircle, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("student")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; type: "error" | "warning" | "info"; title?: string } | null>(
    null,
  )
  const [showOtpInfo, setShowOtpInfo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError({ message: "Mohon isi semua field yang diperlukan", type: "warning", title: "Data Tidak Lengkap" })
      return
    }

    if (password !== confirmPassword) {
      setError({
        message: "Password dan konfirmasi password tidak cocok",
        type: "warning",
        title: "Password Tidak Cocok",
      })
      return
    }

    if (password.length < 6) {
      setError({ message: "Password minimal harus 6 karakter", type: "warning", title: "Password Terlalu Pendek" })
      return
    }

    // Validate OTP for instructor
    if (role === "instructor") {
      if (!otp) {
        setError({
          message:
            "Kode verifikasi diperlukan untuk mendaftar sebagai Instructor. Silakan hubungi admin melalui WhatsApp.",
          type: "info",
          title: "Kode Verifikasi Diperlukan",
        })
        return
      }
      if (otp !== "292929") {
        setError({
          message:
            "Kode verifikasi yang Anda masukkan salah. Hubungi admin di WhatsApp 085216069919 untuk mendapatkan kode yang benar.",
          type: "error",
          title: "Kode Verifikasi Salah",
        })
        return
      }
    }

    setIsLoading(true)
    const result = await register(name, email, password, role)
    setIsLoading(false)

    if (result.success) {
      router.push("/dashboard")
    } else {
      const errorMessage = typeof result.error === "string" ? result.error : "Terjadi kesalahan saat registrasi"

      if (errorMessage.includes("terdaftar") || errorMessage.includes("sudah") || errorMessage.includes("already")) {
        setError({
          message: errorMessage,
          type: "warning",
          title: "Email Sudah Terdaftar",
        })
      } else if (errorMessage.includes("server") || errorMessage.includes("koneksi")) {
        setError({
          message: errorMessage,
          type: "error",
          title: "Gagal Terhubung",
        })
      } else {
        setError({
          message: errorMessage,
          type: "error",
          title: "Registrasi Gagal",
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-8 md:py-12 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <Image
                src="/logo.png"
                alt="SIBEO Logo"
                width={70}
                height={70}
                className="h-[70px] w-[70px] object-contain"
              />
            </div>
            <CardTitle className="text-xl md:text-2xl">Daftar ke SIBEO</CardTitle>
            <CardDescription>Buat akun baru untuk mulai belajar</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3 px-4 md:px-6">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm">
                    Konfirmasi
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Daftar Sebagai</Label>
                <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-3">
                  <div>
                    <RadioGroupItem value="student" id="student" className="peer sr-only" />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                    >
                      <GraduationCap className="mb-1.5 h-5 w-5" />
                      <span className="text-sm font-medium">Siswa</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="instructor" id="instructor" className="peer sr-only" />
                    <Label
                      htmlFor="instructor"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                    >
                      <BookOpen className="mb-1.5 h-5 w-5" />
                      <span className="text-sm font-medium">Instruktur</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {role === "instructor" && (
                <div className="space-y-2.5 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium text-primary mb-0.5">Verifikasi Instruktur</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Hubungi admin melalui WhatsApp untuk mendapatkan kode verifikasi.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs bg-transparent"
                    onClick={() => setShowOtpInfo(true)}
                  >
                    <MessageCircle className="mr-1.5 h-3 w-3" />
                    Cara Mendapatkan Kode
                  </Button>

                  <div className="space-y-1">
                    <Label htmlFor="otp" className="text-xs">
                      Kode Verifikasi
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Masukkan kode verifikasi"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isLoading}
                      className="h-9"
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-4 md:px-6 pt-2 pb-6">
              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Masuk
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />

      {error && (
        <ErrorPopup message={error.message} type={error.type} title={error.title} onClose={() => setError(null)} />
      )}

      {showOtpInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-card border rounded-lg shadow-lg p-5 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold">Cara Mendapatkan Kode</h3>

              <div className="text-left space-y-2 bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Kirim pesan WhatsApp ke:</p>
                <p className="font-mono text-base font-bold text-primary">085216069919</p>
                <p className="text-xs text-muted-foreground">Format pesan:</p>
                <div className="bg-background p-2 rounded border text-xs">
                  <p className="italic leading-relaxed">
                    {`"Halo Admin SIBEO, saya ${name || "[Nama]"} ingin mendaftar sebagai Instructor. Mohon informasinya untuk kode verifikasi."`}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/6285216069919?text=${encodeURIComponent(`Halo Admin SIBEO, saya ${name || "[Nama Anda]"} ingin mendaftar sebagai Instructor. Mohon informasinya untuk kode verifikasi.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full h-9" variant="default">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Buka WhatsApp
                </Button>
              </a>

              <Button variant="outline" className="w-full h-9 bg-transparent" onClick={() => setShowOtpInfo(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
