"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ErrorPopup } from "@/components/error-popup"
import { useAuth } from "@/lib/auth-context"
import { getMyEnrollments, unenrollCourse, type Enrollment } from "@/lib/api"
import { BookOpen, Loader2, Trash2, Layers, Calendar } from "lucide-react"

export default function MyCoursesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchEnrollments = async () => {
      if (!isAuthenticated || user?.role !== "student") {
        setIsLoading(false)
        return
      }
      const data = await getMyEnrollments()
      setEnrollments(data)
      setIsLoading(false)
    }

    if (isAuthenticated) {
      fetchEnrollments()
    }
  }, [isAuthenticated, authLoading, user, router])

  const handleUnenroll = async (enrollmentId: number) => {
    if (!confirm("Apakah Anda yakin ingin berhenti dari kursus ini?")) return

    const result = await unenrollCourse(enrollmentId)
    if (result.success) {
      setEnrollments(enrollments.filter((e) => e.enrollment_id !== enrollmentId))
    } else {
      setError(result.error || "Gagal berhenti dari kursus")
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (user?.role === "instructor") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Halaman ini untuk siswa</h2>
            <p className="text-muted-foreground mb-4">Sebagai instruktur, kelola kursus Anda dari Dashboard</p>
            <Link href="/dashboard">
              <Button>Ke Dashboard</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Kursus Saya</h1>
            <p className="text-muted-foreground">Daftar kursus yang Anda ikuti</p>
          </div>

          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Belum ada kursus</h3>
                <p className="text-muted-foreground mb-6">
                  Anda belum mendaftar kursus apapun. Jelajahi kursus yang tersedia dan mulai belajar!
                </p>
                <Link href="/courses">
                  <Button>Jelajahi Kursus</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.enrollment_id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{enrollment.course.title}</CardTitle>
                    {enrollment.course.category && (
                      <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {enrollment.course.category}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3">{enrollment.course.description}</CardDescription>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        <span>{enrollment.course.modules_count || 0} modul</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(enrollment.enrolled_date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/courses/${enrollment.course.id}`} className="flex-1">
                      <Button className="w-full">Lanjut Belajar</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleUnenroll(enrollment.enrollment_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  )
}
