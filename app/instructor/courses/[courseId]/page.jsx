"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { courseService } from "@/lib/api"
import { ArrowLeft, Plus, Edit, Trash2, Users, BookOpen, Trash } from "lucide-react"

export default function InstructorCourseDetailPage() {
  // FIX: Mengambil params.courseId sesuai nama folder [courseId]
  const params = useParams()
  // Fallback: jika params.courseId kosong, coba params.id (jaga-jaga jika folder diubah)
  const courseId = params.courseId || params.id

  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      // FIX: Menggunakan 'courseId' yang benar
      // FIX: Menggunakan 'getEnrolledStudents' sesuai dengan api.js yang baru
      const [courseRes, modulesRes, studentsRes] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getModules(courseId),
        courseService.getEnrolledStudents(courseId), 
      ])

      // Backend response structure check
      setCourse(courseRes.data || courseRes)
      setModules(modulesRes.data || modulesRes)
      setStudents(studentsRes.data || studentsRes)
    } catch (error) {
      console.error("[v0] Error loading course:", error)
      // Jangan alert di sini agar tidak spamming jika cuma error kecil
    } finally {
      setLoading(false)
    }
  }

  // NEW: Fungsi untuk menghapus Kursus
  const handleDeleteCourse = async () => {
    if (!confirm("PERINGATAN: Apakah Anda yakin ingin menghapus KURSUS ini? Semua modul dan data siswa di dalamnya akan hilang permanen.")) {
      return
    }

    try {
      await courseService.deleteCourse(courseId)
      alert("Kursus berhasil dihapus!")
      // Redirect ke dashboard setelah hapus
      router.push("/dashboard") 
    } catch (error) {
      console.error("Delete error:", error)
      alert("Gagal menghapus kursus: " + error.message)
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini?")) return

    try {
      await courseService.deleteModule(moduleId)
      alert("Modul berhasil dihapus!")
      loadCourseData() // Reload data setelah hapus
    } catch (error) {
      alert("Gagal menghapus modul: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat data kursus...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Kursus tidak ditemukan atau terjadi kesalahan.</p>
        <Link href="/dashboard">
          <Button>Kembali ke Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-muted-foreground">
                  {course.category} • {course.level}
                </p>
              </div>
              
              <div className="flex gap-2">
                {/* Tombol Edit */}
                <Link href={`/instructor/courses/${courseId}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                
                {/* NEW: Tombol Hapus Kursus */}
                <Button variant="destructive" onClick={handleDeleteCourse}>
                  <Trash className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
            <p className="text-lg leading-relaxed">{course.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{students?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{modules?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Modul</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${course.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
                >
                  Status: {course.status === "published" ? "Published" : "Draft"}
                </span>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules">Modul</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Daftar Modul</h2>
                <Link href={`/instructor/courses/${courseId}/modules/create`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Modul
                  </Button>
                </Link>
              </div>

              {modules?.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Belum ada modul. Buat modul pertama Anda!</p>
                    <Link href={`/instructor/courses/${courseId}/modules/create`}>
                      <Button className="mt-4 mx-auto block">Buat Modul</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {index + 1}. {module.title}
                            </CardTitle>
                            {module.description && (
                              <CardDescription className="mt-1">{module.description}</CardDescription>
                            )}
                            {module.duration && (
                              <p className="text-sm text-muted-foreground mt-2">Durasi: {module.duration} menit</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {/* Edit Module */}
                            <Link href={`/instructor/courses/${courseId}/modules/${module.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            {/* Hapus Module */}
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteModule(module.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Daftar Students</h2>

              {students?.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Belum ada students yang mendaftar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((student) => (
                    <Card key={student.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <p className="text-sm text-muted-foreground mt-1">Progress: {student.progress || 0}%</p>
                          </div>
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{student.progress || 0}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}