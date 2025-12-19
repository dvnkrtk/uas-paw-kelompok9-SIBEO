"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllCourses, type Course } from "@/lib/api"
import { Search, BookOpen, Users, Layers, Loader2 } from "lucide-react"

const DEMO_COURSES: Course[] = [
  {
    id: 1,
    title: "Dasar-Dasar Pemrograman Python",
    description:
      "Pelajari fundamental pemrograman dengan Python dari nol hingga mahir. Cocok untuk pemula yang ingin memulai karir di bidang teknologi.",
    category: "Pemrograman",
    instructor_id: 1,
    instructor_name: "Dr. Ahmad Fauzi",
    modules_count: 12,
    enrollments_count: 150,
  },
  {
    id: 2,
    title: "Web Development dengan React & Next.js",
    description:
      "Kuasai pengembangan web modern menggunakan React dan Next.js. Bangun aplikasi web yang cepat dan interaktif.",
    category: "Pemrograman",
    instructor_id: 1,
    instructor_name: "Budi Santoso",
    modules_count: 18,
    enrollments_count: 89,
  },
  {
    id: 3,
    title: "UI/UX Design untuk Pemula",
    description:
      "Pelajari prinsip desain user interface dan user experience. Dari wireframe hingga prototype dengan Figma.",
    category: "Desain",
    instructor_id: 2,
    instructor_name: "Siti Aminah",
    modules_count: 10,
    enrollments_count: 67,
  },
  {
    id: 4,
    title: "Data Science & Machine Learning",
    description:
      "Eksplorasi dunia data science dan machine learning. Analisis data, visualisasi, dan membangun model prediktif.",
    category: "Data Science",
    instructor_id: 3,
    instructor_name: "Prof. Rudi Hermawan",
    modules_count: 24,
    enrollments_count: 45,
  },
  {
    id: 5,
    title: "Digital Marketing Mastery",
    description: "Strategi pemasaran digital lengkap: SEO, Social Media Marketing, Google Ads, dan Content Marketing.",
    category: "Bisnis",
    instructor_id: 4,
    instructor_name: "Diana Putri",
    modules_count: 15,
    enrollments_count: 32,
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses()
        const coursesToUse = data.length > 0 ? data : DEMO_COURSES
        setCourses(coursesToUse)
        setFilteredCourses(coursesToUse)
      } catch (err) {
        console.error("Error fetching courses:", err)
        // Use demo courses on error
        setCourses(DEMO_COURSES)
        setFilteredCourses(DEMO_COURSES)
      }
      setIsLoading(false)
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    let result = courses

    if (searchQuery) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((course) => course.category === categoryFilter)
    }

    setFilteredCourses(result)
  }, [searchQuery, categoryFilter, courses])

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Jelajahi Kursus</h1>
            <p className="text-muted-foreground max-w-2xl">
              Temukan kursus yang sesuai dengan minat dan kebutuhan Anda dari berbagai kategori yang tersedia.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kursus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tidak ada kursus ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        {course.category && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {course.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                    {course.instructor_name && (
                      <p className="text-sm text-muted-foreground mt-3">Instruktur: {course.instructor_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        <span>{course.modules_count || 0} modul</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrollments_count || 0} siswa</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/courses/${course.id}`} className="w-full">
                      <Button variant="outline" className="w-full bg-transparent">
                        Lihat Detail
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
