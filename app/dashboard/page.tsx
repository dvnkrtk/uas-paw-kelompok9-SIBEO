"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ErrorPopup } from "@/components/error-popup"
import { useAuth } from "@/lib/auth-context"
import {
  getInstructorDashboard,
  getMyEnrollments,
  createCourse,
  deleteCourse,
  getAllCourses,
  type Course,
  type Enrollment,
} from "@/lib/api"
import { BookOpen, Users, Layers, Plus, Loader2, Trash2, Edit, Eye } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [stats, setStats] = useState({ total_courses: 0, total_enrollments: 0, total_modules: 0 })
  const [error, setError] = useState<string | null>(null)

  // Create course form
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "", category: "" })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      if (!user) return

      try {
        if (user.role === "instructor") {
          const data = await getInstructorDashboard()
          let instructorCourses = data.courses
          if (instructorCourses.length === 0) {
            const allCourses = await getAllCourses()
            instructorCourses = allCourses.filter((c) => c.instructor_id === user.id)
          }
          setCourses(instructorCourses)
          setStats({
            total_courses: instructorCourses.length,
            total_enrollments: data.stats.total_enrollments,
            total_modules: data.stats.total_modules,
          })
        } else {
          const data = await getMyEnrollments()
          setEnrollments(data)
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
      setIsLoading(false)
    }

    if (isAuthenticated && user) {
      fetchData()
    }
  }, [isAuthenticated, authLoading, user, router])

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      setError("Judul dan deskripsi wajib diisi")
      return
    }

    setIsCreating(true)
    const result = await createCourse(newCourse.title, newCourse.description, newCourse.category)
    setIsCreating(false)

    if (result.success && result.data) {
      setCourses([...courses, result.data])
      setShowCreateDialog(false)
      setNewCourse({ title: "", description: "", category: "" })
    } else {
      setError(result.error || "Gagal membuat kursus")
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kursus ini?")) return

    const result = await deleteCourse(courseId)
    if (result.success) {
      setCourses(courses.filter((c) => c.id !== courseId))
    } else {
      setError(result.error || "Gagal menghapus kursus")
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Selamat datang, {user?.name}! ({user?.role === "instructor" ? "Instruktur" : "Siswa"})
              </p>
            </div>

            {user?.role === "instructor" && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Kursus Baru
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buat Kursus Baru</DialogTitle>
                    <DialogDescription>Isi informasi kursus yang ingin Anda buat</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Kursus</Label>
                      <Input
                        id="title"
                        placeholder="Masukkan judul kursus"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Input
                        id="category"
                        placeholder="Contoh: Pemrograman, Desain, dll"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        placeholder="Jelaskan tentang kursus ini"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleCreateCourse} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Membuat...
                        </>
                      ) : (
                        "Buat Kursus"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {user?.role === "instructor" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Kursus</CardTitle>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{courses.length}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total_enrollments}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Modul</CardTitle>
                    <Layers className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total_modules}</div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-semibold mb-8">Kursus Saya</h2>
              {courses.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Anda belum membuat kursus apapun</p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Buat Kursus Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
                    <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        {course.category && (
                          <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mt-2">
                            {course.category}
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="pb-4">
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0">
                        <Link href={`/courses/${course.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </Button>
                        </Link>
                        <Link href={`/dashboard/courses/${course.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-8">Kursus Terdaftar</h2>
              {enrollments.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="py-16 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-6">Anda belum mendaftar kursus apapun</p>
                    <Link href="/courses">
                      <Button size="lg">Jelajahi Kursus</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => {
                    const courseData = enrollment.course || enrollment
                    const enrollmentId = enrollment.enrollment_id || enrollment.id
                    return (
                      <Card key={enrollmentId} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg line-clamp-2">{courseData.title}</CardTitle>
                          {courseData.category && (
                            <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mt-2">
                              {courseData.category}
                            </span>
                          )}
                        </CardHeader>
                        <CardContent className="pb-4">
                          <CardDescription className="line-clamp-2">{courseData.description}</CardDescription>
                          <p className="text-xs text-muted-foreground mt-4">
                            Terdaftar: {new Date(enrollment.enrolled_date).toLocaleDateString("id-ID")}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Link href={`/courses/${courseData.id || enrollment.course_id}`} className="w-full">
                            <Button className="w-full">Lanjut Belajar</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  )
}
