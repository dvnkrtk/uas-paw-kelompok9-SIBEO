"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { dashboardService, courseService } from "@/lib/api"
import { BookOpen, Users, Award, TrendingUp, Plus, Edit, Trash2, Eye } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading dashboard for role:", user?.role)

      if (user.role === "instructor") {
        const response = await dashboardService.getInstructorDashboard()
        console.log("[v0] Instructor dashboard:", response)
        const data = response.data || response
        setDashboardData(data)
        setCourses(data.courses || [])
      } else {
        const response = await dashboardService.getStudentProgress()
        console.log("[v0] Student dashboard:", response)
        const data = response.data || response
        setDashboardData(data)
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error("[v0] Error loading dashboard:", error)
      setDashboardData({})
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      alert("Terjadi kesalahan: ID Kursus tidak ditemukan.")
      return
    }

    if (!confirm("Apakah Anda yakin ingin menghapus kursus ini?")) return

    try {
      // 1. Panggil API Delete
      await courseService.deleteCourse(courseId)
      
      // 2. Update State Lokal (Optimistic UI) agar tidak perlu reload berat
      setCourses(prevCourses => {
         // Filter berdasarkan id atau course_id untuk memastikan item terhapus
         return prevCourses.filter(c => (c.id || c.course_id) !== courseId)
      })

      alert("Kursus berhasil dihapus!")
      
      // Opsional: Reload data background untuk memastikan sinkronisasi
      // loadDashboardData() 
    } catch (error) {
      console.error("Delete error:", error)
      alert("Gagal menghapus kursus: " + error.message)
      // Jika gagal, reload data asli
      loadDashboardData()
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const stats =
    user.role === "instructor"
      ? [
          { icon: BookOpen, label: "Kursus Dibuat", value: dashboardData?.total_courses || 0 },
          { icon: Users, label: "Total Students", value: dashboardData?.total_students || 0 },
          { icon: Award, label: "Total Modul", value: dashboardData?.total_modules || 0 },
          { icon: TrendingUp, label: "Kursus Aktif", value: courses.filter((c) => c.status === "published").length },
        ]
      : [
          { icon: BookOpen, label: "Kursus Diikuti", value: dashboardData?.total_enrolled || 0 },
          { icon: Award, label: "Kursus Selesai", value: dashboardData?.completed_courses || 0 },
          { icon: TrendingUp, label: "Dalam Progress", value: dashboardData?.in_progress || 0 },
          { icon: Users, label: "Modul Selesai", value: dashboardData?.total_modules_completed || 0 },
        ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Selamat Datang, {user.name}!</h1>
            <p className="text-muted-foreground capitalize">
              Dashboard {user.role === "instructor" ? "Instructor" : "Student"}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {user.role === "instructor" && (
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Kursus Anda</h2>
                <Link href="/instructor/courses/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kursus
                  </Button>
                </Link>
              </div>
            )}

            {user.role === "student" && <h2 className="text-2xl font-bold mb-6">Kursus yang Diikuti</h2>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.length === 0 ? (
                <Card className="lg:col-span-2">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {user.role === "instructor" ? "Belum Ada Kursus" : "Belum Mengikuti Kursus"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {user.role === "instructor"
                        ? "Anda belum membuat kursus. Buat kursus pertama Anda sekarang!"
                        : "Anda belum mengikuti kursus. Jelajahi kursus yang tersedia dan mulai belajar!"}
                    </p>
                    <Link href={user.role === "instructor" ? "/instructor/courses/create" : "/courses"}>
                      <Button>{user.role === "instructor" ? "Buat Kursus Pertama" : "Jelajahi Kursus"}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                courses.map((course) => {
                  // FIX: Pastikan ID selalu terambil baik dari field 'id' maupun 'course_id'
                  const courseId = course.id || course.course_id
                  
                  return (
                    <Card key={courseId}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-1">{course.title || course.course_title}</CardTitle>
                            <CardDescription className="mt-1">
                              {user.role === "instructor"
                                ? `${course.total_students || 0} Students`
                                : `Progress: ${course.progress || 0}%`}
                            </CardDescription>
                          </div>
                          {user.role === "instructor" && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${course.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
                            >
                              {course.status}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {user.role === "student" && (
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {course.completed_modules || 0} / {course.total_modules || 0} modul selesai
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {user.role === "instructor" ? (
                            <>
                              <Link href={`/instructor/courses/${courseId}`} className="flex-1">
                                <Button variant="outline" className="w-full bg-transparent">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Lihat
                                </Button>
                              </Link>
                              <Link href={`/instructor/courses/${courseId}/edit`}>
                                <Button variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="destructive" onClick={() => handleDeleteCourse(courseId)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Link href={`/courses/${courseId}`} className="flex-1">
                              <Button className="w-full">Lanjutkan Belajar</Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}