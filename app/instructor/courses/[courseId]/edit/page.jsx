"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { courseService } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    thumbnail: "",
    status: "draft",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourseData()
  }, [params.id])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const response = await courseService.getCourseById(params.id)
      const course = response.data
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
        level: course.level || "beginner",
        thumbnail: course.thumbnail || "",
        status: course.status || "draft",
      })
    } catch (error) {
      console.error("[v0] Error loading course:", error)
      alert("Gagal memuat data kursus")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category) {
      alert("Harap isi semua field yang wajib!")
      return
    }

    try {
      setIsSubmitting(true)
      await courseService.updateCourse(params.id, formData)
      alert("Kursus berhasil diupdate!")
      router.push(`/instructor/courses/${params.id}`)
    } catch (error) {
      alert("Gagal mengupdate kursus: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href={`/instructor/courses/${params.id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Detail Kursus
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Edit Kursus</CardTitle>
              <CardDescription>Perbarui informasi kursus Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul Kursus <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Pemrograman Web Dasar"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Deskripsi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan tentang kursus ini..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pemrograman">Pemrograman</SelectItem>
                        <SelectItem value="Desain">Desain</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Mobile">Mobile Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="AI">Artificial Intelligence</SelectItem>
                        <SelectItem value="Networking">Networking</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level Kesulitan</Label>
                    <Select value={formData.level} onValueChange={(value) => handleChange("level", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Pemula</SelectItem>
                        <SelectItem value="intermediate">Menengah</SelectItem>
                        <SelectItem value="advanced">Lanjutan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Kursus dengan status "Published" akan terlihat oleh mahasiswa
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">URL Thumbnail (Opsional)</Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={(e) => handleChange("thumbnail", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Masukkan URL gambar untuk thumbnail kursus</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
