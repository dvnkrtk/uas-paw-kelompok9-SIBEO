"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { moduleService } from "@/lib/api"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

export default function CreateModulePage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    video_url: "",
    duration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert("Judul dan konten modul wajib diisi!")
      return
    }

    try {
      setIsSubmitting(true)
      await moduleService.createModule(params.id, {
        ...formData,
        duration: formData.duration ? Number.parseInt(formData.duration) : null,
      })
      alert("Modul berhasil dibuat!")
      router.push(`/instructor/courses/${params.id}`)
    } catch (error) {
      alert("Gagal membuat modul: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={`/instructor/courses/${params.id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Kursus
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Buat Modul Baru</CardTitle>
              <CardDescription>
                Tulis konten modul menggunakan Markdown. Anda bisa menambahkan link, gambar, dan format teks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul Modul <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Pengenalan HTML"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Singkat</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi singkat tentang modul ini..."
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL Video (Opsional)</Label>
                    <Input
                      id="video_url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.video_url}
                      onChange={(e) => handleChange("video_url", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi (Menit)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={formData.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Konten Modul (Markdown) <span className="text-red-500">*</span>
                  </Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit">
                      <Textarea
                        placeholder={`# Judul Modul

## Subjudul

Ini adalah paragraf contoh. Anda bisa menambahkan:
- **Bold text**
- *Italic text*
- [Link](https://example.com)
- ![Gambar](https://example.com/image.jpg)

\`\`\`javascript
// Code block
console.log("Hello World");
\`\`\`

> Blockquote untuk catatan penting`}
                        rows={20}
                        value={formData.content}
                        onChange={(e) => handleChange("content", e.target.value)}
                        required
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Tips: Gunakan sintaks Markdown untuk format konten. Mahasiswa akan melihat preview yang sudah
                        dirender.
                      </p>
                    </TabsContent>

                    <TabsContent value="preview">
                      <div className="border rounded-md p-6 min-h-[500px] bg-card">
                        <article className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>{formData.content || "*Preview konten akan muncul di sini...*"}</ReactMarkdown>
                        </article>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Membuat..." : "Buat Modul"}
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
