"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { courseService, enrollmentService } from "@/lib/api"
import { BookOpen, Clock, Users, ArrowLeft, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourseData()
  }, [params.id, user])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const [courseRes, modulesRes] = await Promise.all([
        courseService.getCourseById(params.id),
        courseService.getModules(params.id),
      ])
      setCourse(courseRes.data)
      setModules(modulesRes.data)

      if (user && user.role === "student") {
        try {
          const enrollmentsRes = await enrollmentService.getMyCourses()
          const enrollment = enrollmentsRes.data.find((e) => e.course.id === Number.parseInt(params.id))
          if (enrollment) {
            setIsEnrolled(true)
            setEnrollmentId(enrollment.id)
          }
        } catch (error) {
          console.error("[v0] Error checking enrollment:", error)
        }
      }
    } catch (error) {
      console.error("[v0] Error loading course:", error)
      alert("Gagal memuat data kursus")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    try {
      setEnrolling(true)
      const response = await enrollmentService.enroll(Number.parseInt(params.id))
      setIsEnrolled(true)
      setEnrollmentId(response.data.enrollment_id)
      alert("Berhasil mendaftar ke kursus!")
    } catch (error) {
      alert("Gagal mendaftar: " + error.message)
    } finally {
      setEnrolling(false)
    }
  }

  const handleUnenroll = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar dari kursus ini?")) return

    try {
      await enrollmentService.unenroll(enrollmentId)
      setIsEnrolled(false)
      setEnrollmentId(null)
      alert("Berhasil keluar dari kursus")
    } catch (error) {
      alert("Gagal keluar dari kursus: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Kursus tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <Link href="/courses">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Kursus
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded text-sm font-medium mb-2">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{course.total_students || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{modules.length} Modul</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Level: {course.level}</span>
                  </div>
                </div>

                {course.instructor && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-semibold">{course.instructor.name}</p>
                  </div>
                )}
              </div>

              <div>
                <Card className="sticky top-4">
                  <CardContent className="pt-6 space-y-4">
                    {user?.role === "student" && (
                      <>
                        {isEnrolled ? (
                          <>
                            <Button className="w-full" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Sudah Terdaftar
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent" onClick={handleUnenroll}>
                              Keluar dari Kursus
                            </Button>
                          </>
                        ) : (
                          <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                            {enrolling ? "Mendaftar..." : "Daftar Sekarang"}
                          </Button>
                        )}
                      </>
                    )}
                    {!isAuthenticated && (
                      <Button className="w-full" onClick={() => router.push("/login")}>
                        Login untuk Mendaftar
                      </Button>
                    )}
                    {user?.role === "instructor" && (
                      <p className="text-sm text-muted-foreground text-center">Anda adalah instructor</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Modul Pembelajaran</h2>

            {modules.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Belum ada modul tersedia</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <Card
                        key={module.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${selectedModule?.id === module.id ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setSelectedModule(module)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">
                            {index + 1}. {module.title}
                          </CardTitle>
                          {module.duration && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {module.duration} menit
                            </p>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {selectedModule ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedModule.title}</CardTitle>
                        {selectedModule.description && <CardDescription>{selectedModule.description}</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        {selectedModule.video_url && (
                          <div className="mb-6">
                            <Label className="text-sm font-medium mb-2 block">Video Pembelajaran</Label>
                            <a
                              href={selectedModule.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Tonton Video →
                            </a>
                          </div>
                        )}

                        {selectedModule.content && (
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Materi</Label>
                            <div className="border rounded-lg p-6 bg-card">
                              <article className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{selectedModule.content}</ReactMarkdown>
                              </article>
                            </div>
                          </div>
                        )}

                        {!isEnrolled && user?.role === "student" && (
                          <div className="mt-6 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Daftar ke kursus ini untuk mengakses semua materi pembelajaran
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                          Pilih modul di sebelah kiri untuk melihat konten
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
