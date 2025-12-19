"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ErrorPopup } from "@/components/error-popup"
import { useAuth } from "@/lib/auth-context"
import {
  getCourseDetail,
  getCourseModules,
  enrollCourse,
  getMyEnrollments,
  type Course,
  type Module,
  type Enrollment,
} from "@/lib/api"
import { ArrowLeft, BookOpen, Users, Layers, Loader2, CheckCircle2, User, Lock } from "lucide-react"

const DEMO_COURSES: Record<number, Course> = {
  1: {
    id: 1,
    title: "Dasar-Dasar Pemrograman Python",
    description:
      "Pelajari fundamental pemrograman dengan Python dari nol hingga mahir. Cocok untuk pemula yang ingin memulai karir di bidang teknologi. Kursus ini mencakup variabel, tipe data, kontrol flow, fungsi, OOP, dan proyek praktis.",
    category: "Pemrograman",
    instructor_id: 1,
    instructor_name: "Dr. Ahmad Fauzi",
    modules_count: 12,
    enrollments_count: 150,
  },
  2: {
    id: 2,
    title: "Web Development dengan React & Next.js",
    description:
      "Kuasai pengembangan web modern menggunakan React dan Next.js. Bangun aplikasi web yang cepat dan interaktif dengan Server Side Rendering dan Static Site Generation.",
    category: "Pemrograman",
    instructor_id: 1,
    instructor_name: "Budi Santoso",
    modules_count: 18,
    enrollments_count: 89,
  },
  3: {
    id: 3,
    title: "UI/UX Design untuk Pemula",
    description:
      "Pelajari prinsip desain user interface dan user experience. Dari wireframe hingga prototype dengan Figma. Termasuk studi kasus desain aplikasi mobile dan web.",
    category: "Desain",
    instructor_id: 2,
    instructor_name: "Siti Aminah",
    modules_count: 10,
    enrollments_count: 67,
  },
  4: {
    id: 4,
    title: "Data Science & Machine Learning",
    description:
      "Eksplorasi dunia data science dan machine learning. Analisis data, visualisasi, dan membangun model prediktif dengan Python, Pandas, dan Scikit-learn.",
    category: "Data Science",
    instructor_id: 3,
    instructor_name: "Prof. Rudi Hermawan",
    modules_count: 24,
    enrollments_count: 45,
  },
  5: {
    id: 5,
    title: "Digital Marketing Mastery",
    description:
      "Strategi pemasaran digital lengkap: SEO, Social Media Marketing, Google Ads, dan Content Marketing. Cocok untuk pengusaha dan digital marketer.",
    category: "Bisnis",
    instructor_id: 4,
    instructor_name: "Diana Putri",
    modules_count: 15,
    enrollments_count: 32,
  },
}

const DEMO_MODULES: Record<number, Module[]> = {
  1: [
    {
      id: 1,
      course_id: 1,
      title: "Pengenalan Python",
      content:
        "Selamat datang di kursus Python! Pada modul ini kita akan belajar apa itu Python, mengapa Python populer, dan cara menginstall Python di komputer Anda.",
      order: 1,
    },
    {
      id: 2,
      course_id: 1,
      title: "Variabel dan Tipe Data",
      content:
        "Pelajari cara mendeklarasikan variabel, berbagai tipe data seperti string, integer, float, dan boolean.",
      order: 2,
    },
    {
      id: 3,
      course_id: 1,
      title: "Operator dan Ekspresi",
      content: "Memahami operator aritmatika, perbandingan, logika, dan cara menggunakan ekspresi dalam Python.",
      order: 3,
    },
  ],
  2: [
    {
      id: 4,
      course_id: 2,
      title: "Pengenalan React",
      content: "Dasar-dasar React: Component, JSX, dan Virtual DOM. Cara membuat aplikasi React pertama Anda.",
      order: 1,
    },
    {
      id: 5,
      course_id: 2,
      title: "React Hooks",
      content: "Pelajari useState, useEffect, useContext, dan custom hooks untuk state management.",
      order: 2,
    },
  ],
  3: [
    {
      id: 6,
      course_id: 3,
      title: "Prinsip Desain UI",
      content: "Fundamental desain: warna, tipografi, spacing, dan hierarki visual dalam desain interface.",
      order: 1,
    },
    {
      id: 7,
      course_id: 3,
      title: "UX Research",
      content: "Cara melakukan riset pengguna, user persona, dan user journey mapping.",
      order: 2,
    },
  ],
  4: [
    {
      id: 8,
      course_id: 4,
      title: "Pengenalan Data Science",
      content: "Apa itu Data Science, peran Data Scientist, dan tools yang digunakan dalam industri.",
      order: 1,
    },
    {
      id: 9,
      course_id: 4,
      title: "Python untuk Data Science",
      content: "Menggunakan NumPy, Pandas untuk manipulasi dan analisis data.",
      order: 2,
    },
  ],
  5: [
    {
      id: 10,
      course_id: 5,
      title: "Dasar Digital Marketing",
      content: "Pengenalan konsep digital marketing, funnel marketing, dan strategi online.",
      order: 1,
    },
    {
      id: 11,
      course_id: 5,
      title: "SEO Fundamentals",
      content: "Search Engine Optimization: on-page SEO, off-page SEO, dan keyword research.",
      order: 2,
    },
  ],
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const courseId = Number(params.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let courseData = await getCourseDetail(courseId)

        if (!courseData || typeof courseData !== "object" || "code" in courseData || !("title" in courseData)) {
          courseData = null
        }

        if (!courseData && DEMO_COURSES[courseId]) {
          courseData = DEMO_COURSES[courseId]
        }
        setCourse(courseData)

        if (isAuthenticated) {
          try {
            let modulesData = await getCourseModules(courseId)

            if (Array.isArray(modulesData)) {
              modulesData = modulesData.filter((m) => m && typeof m === "object" && !("code" in m) && "title" in m)
            } else {
              modulesData = []
            }

            if (modulesData.length === 0 && DEMO_MODULES[courseId]) {
              modulesData = DEMO_MODULES[courseId]
            }
            setModules(modulesData)
          } catch {
            if (DEMO_MODULES[courseId]) {
              setModules(DEMO_MODULES[courseId])
            }
          }

          if (user?.role === "student") {
            try {
              const enrollments = await getMyEnrollments()

              if (Array.isArray(enrollments)) {
                const enrolled = enrollments.some((e: Enrollment) => {
                  if (!e || typeof e !== "object" || "code" in e) return false
                  const enrolledCourseId = e.course?.id || e.course_id
                  return enrolledCourseId === courseId
                })
                setIsEnrolled(enrolled)
              }
            } catch {
              // Ignore enrollment check errors
            }
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err)
        if (DEMO_COURSES[courseId]) {
          setCourse(DEMO_COURSES[courseId])
          if (DEMO_MODULES[courseId]) {
            setModules(DEMO_MODULES[courseId])
          }
        }
      }
      setIsLoading(false)
    }
    fetchData()
  }, [courseId, isAuthenticated, user])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsEnrolling(true)
    const result = await enrollCourse(courseId)
    setIsEnrolling(false)

    if (result.success) {
      setIsEnrolled(true)
      // Load modules after enrollment
      try {
        let modulesData = await getCourseModules(courseId)
        if ((!modulesData || modulesData.length === 0) && DEMO_MODULES[courseId]) {
          modulesData = DEMO_MODULES[courseId]
        }
        setModules(modulesData)
      } catch {
        if (DEMO_MODULES[courseId]) {
          setModules(DEMO_MODULES[courseId])
        }
      }
    } else {
      setError(result.error || "Gagal mendaftar kursus")
    }
  }

  if (isLoading) {
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
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Kursus tidak ditemukan</h2>
            <Link href="/courses">
              <Button>Kembali ke Daftar Kursus</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const canViewModules = isAuthenticated && (isEnrolled || user?.role === "instructor")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/courses"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali ke Daftar Kursus
            </Link>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                {course.category && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4">
                    {course.category}
                  </span>
                )}
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>

                {course.instructor_name && (
                  <div className="flex items-center gap-2 mt-6">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-sm">
                      Instruktur: <strong>{course.instructor_name}</strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <span>{course.modules_count || modules.length || 0} modul</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{course.enrollments_count || 0} siswa terdaftar</span>
                  </div>
                </div>
              </div>

              <div>
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    {user?.role === "instructor" ? (
                      <p className="text-center text-muted-foreground py-4">Anda login sebagai Instruktur</p>
                    ) : isEnrolled ? (
                      <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-medium">Anda sudah terdaftar di kursus ini</p>
                        <Link href="/my-courses">
                          <Button className="w-full">Lanjut Belajar</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center py-2">
                          <p className="text-2xl font-bold text-primary">Gratis</p>
                          <p className="text-sm text-muted-foreground">Akses selamanya</p>
                        </div>
                        <Button className="w-full" onClick={handleEnroll} disabled={isEnrolling}>
                          {isEnrolling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            "Daftar Kursus"
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-8">Materi Kursus</h2>

          {!isAuthenticated ? (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Masuk untuk melihat materi kursus</p>
                <Link href="/login">
                  <Button>Masuk</Button>
                </Link>
              </CardContent>
            </Card>
          ) : !canViewModules ? (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Materi Terkunci</h3>
                <p className="text-muted-foreground mb-4">Daftar kursus ini untuk mengakses materi pembelajaran</p>
                <Button onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : modules.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada modul untuk kursus ini</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {modules.map((module, index) => (
                <AccordionItem
                  key={module.id}
                  value={`module-${module.id}`}
                  className="border rounded-lg px-4 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <span className="font-medium">{module.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-14 pb-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{module.content}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </main>

      <Footer />

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  )
}
