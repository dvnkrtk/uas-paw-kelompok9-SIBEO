"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  getCourseDetail,
  getCourseModules,
  updateCourse,
  createModule,
  updateModule,
  deleteModule,
  type Course,
  type Module,
} from "@/lib/api"
import { ArrowLeft, Plus, Loader2, Trash2, Edit, Save, X, GripVertical } from "lucide-react"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit course form
  const [editedCourse, setEditedCourse] = useState({ title: "", description: "", category: "" })
  const [isSavingCourse, setIsSavingCourse] = useState(false)

  // New module form
  const [showModuleDialog, setShowModuleDialog] = useState(false)
  const [newModule, setNewModule] = useState({ title: "", content: "" })
  const [isCreatingModule, setIsCreatingModule] = useState(false)

  // Edit module
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [isSavingModule, setIsSavingModule] = useState(false)

  const courseId = Number(params.id)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!authLoading && user?.role !== "instructor") {
      router.push("/dashboard")
      return
    }

    const fetchData = async () => {
      const courseData = await getCourseDetail(courseId)
      if (courseData) {
        setCourse(courseData)
        setEditedCourse({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category || "",
        })

        try {
          const modulesData = await getCourseModules(courseId)
          setModules(modulesData)
        } catch {
          // Might fail if not owner
        }
      }
      setIsLoading(false)
    }

    if (isAuthenticated && user?.role === "instructor") {
      fetchData()
    }
  }, [courseId, isAuthenticated, authLoading, user, router])

  const handleSaveCourse = async () => {
    if (!editedCourse.title || !editedCourse.description) {
      setError("Judul dan deskripsi wajib diisi")
      return
    }

    setIsSavingCourse(true)
    const result = await updateCourse(courseId, editedCourse.title, editedCourse.description, editedCourse.category)
    setIsSavingCourse(false)

    if (result.success) {
      setCourse({ ...course!, ...editedCourse })
    } else {
      setError(result.error || "Gagal menyimpan perubahan")
    }
  }

  const handleCreateModule = async () => {
    if (!newModule.title || !newModule.content) {
      setError("Judul dan konten modul wajib diisi")
      return
    }

    setIsCreatingModule(true)
    const result = await createModule(courseId, newModule.title, newModule.content)
    setIsCreatingModule(false)

    if (result.success && result.data) {
      setModules([...modules, result.data])
      setShowModuleDialog(false)
      setNewModule({ title: "", content: "" })
    } else {
      setError(result.error || "Gagal membuat modul")
    }
  }

  const handleUpdateModule = async () => {
    if (!editingModule) return

    setIsSavingModule(true)
    const result = await updateModule(editingModule.id, editingModule.title, editingModule.content)
    setIsSavingModule(false)

    if (result.success) {
      setModules(modules.map((m) => (m.id === editingModule.id ? editingModule : m)))
      setEditingModule(null)
    } else {
      setError(result.error || "Gagal memperbarui modul")
    }
  }

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini?")) return

    const result = await deleteModule(moduleId)
    if (result.success) {
      setModules(modules.filter((m) => m.id !== moduleId))
    } else {
      setError(result.error || "Gagal menghapus modul")
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Kursus tidak ditemukan</h2>
            <Link href="/dashboard">
              <Button>Kembali ke Dashboard</Button>
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
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Dashboard
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Kursus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Kursus</Label>
                  <Input
                    id="title"
                    value={editedCourse.title}
                    onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={editedCourse.category}
                    onChange={(e) => setEditedCourse({ ...editedCourse, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={editedCourse.description}
                    onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveCourse} disabled={isSavingCourse}>
                  {isSavingCourse ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Modul Kursus</CardTitle>
                <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Modul
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Modul Baru</DialogTitle>
                      <DialogDescription>Tambahkan materi baru untuk kursus ini</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="moduleTitle">Judul Modul</Label>
                        <Input
                          id="moduleTitle"
                          placeholder="Masukkan judul modul"
                          value={newModule.title}
                          onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moduleContent">Konten</Label>
                        <Textarea
                          id="moduleContent"
                          placeholder="Masukkan konten modul (bisa berupa teks, link video, dll)"
                          value={newModule.content}
                          onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
                          rows={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowModuleDialog(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleCreateModule} disabled={isCreatingModule}>
                        {isCreatingModule ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Membuat...
                          </>
                        ) : (
                          "Tambah Modul"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada modul. Klik tombol di atas untuk menambah modul.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        {editingModule?.id === module.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingModule.title}
                              onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                              placeholder="Judul modul"
                            />
                            <Textarea
                              value={editingModule.content}
                              onChange={(e) => setEditingModule({ ...editingModule, content: e.target.value })}
                              placeholder="Konten modul"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleUpdateModule} disabled={isSavingModule}>
                                {isSavingModule ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingModule(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <GripVertical className="h-4 w-4" />
                              <span className="text-sm font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{module.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{module.content}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setEditingModule(module)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteModule(module.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  )
}
