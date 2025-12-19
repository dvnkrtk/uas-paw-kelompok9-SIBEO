import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookOpen, Users, Award, TrendingUp } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Kursus Berkualitas",
      description: "Akses berbagai kursus dari instructor berpengalaman",
    },
    {
      icon: Users,
      title: "Komunitas Aktif",
      description: "Belajar bersama ribuan students lainnya",
    },
    {
      icon: Award,
      title: "Sertifikat",
      description: "Dapatkan sertifikat setelah menyelesaikan kursus",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor perkembangan belajar Anda secara real-time",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <Image
                  src="/logo.png"
                  alt="SIBEO Logo"
                  width={150}
                  height={150}
                  className="w-32 h-auto md:w-40"
                  priority
                />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Belajar Tanpa Batas dengan <span className="text-primary">SIBEO</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                Platform e-learning terpadu untuk students dan instructor. Mulai perjalanan belajar Anda hari ini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Mulai Belajar
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Jelajahi Kursus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih SIBEO?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Platform pembelajaran online yang dirancang untuk memberikan pengalaman terbaik
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Bergabung dengan ribuan students yang telah memulai perjalanan belajar mereka
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
