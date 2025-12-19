"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookOpen, Users, Award, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Beragam Kursus",
      description: "Akses ribuan kursus dari berbagai kategori yang dibuat oleh instruktur profesional.",
    },
    {
      icon: Users,
      title: "Instruktur Ahli",
      description: "Belajar dari para ahli di bidangnya dengan pengalaman industri yang relevan.",
    },
    {
      icon: Award,
      title: "Sertifikat",
      description: "Dapatkan sertifikat penyelesaian untuk setiap kursus yang Anda selesaikan.",
    },
    {
      icon: GraduationCap,
      title: "Belajar Fleksibel",
      description: "Belajar kapan saja dan di mana saja sesuai dengan jadwal Anda.",
    },
  ]

  const categories = [
    "Pemrograman",
    "Desain Grafis",
    "Bisnis & Marketing",
    "Bahasa Asing",
    "Matematika",
    "Sains & Teknologi",
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Belajar Tanpa Batas dengan <span className="text-primary">SIBEO</span>
                </h1>
                <p className="text-lg text-muted-foreground text-pretty max-w-lg">
                  Sistem Belajar Online terlengkap untuk mengembangkan skill dan pengetahuan Anda. Mulai perjalanan
                  belajar Anda hari ini!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/courses">
                    <Button size="lg" className="gap-2">
                      Jelajahi Kursus
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline">
                      Daftar Gratis
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                  <Image
                    src="/logo.png"
                    alt="SIBEO Logo"
                    fill
                    className="object-contain relative z-10 drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih SIBEO?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Platform pembelajaran online yang dirancang untuk memberikan pengalaman belajar terbaik
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-none bg-card shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Kategori Populer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Temukan kursus sesuai minat dan kebutuhan Anda</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link key={index} href={`/courses?category=${encodeURIComponent(category)}`} className="group">
                  <Card className="border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium group-hover:text-primary transition-colors">{category}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Untuk Mulai Belajar?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Bergabung dengan ribuan pelajar lainnya dan mulai perjalanan belajar Anda hari ini
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Lihat Kursus
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
