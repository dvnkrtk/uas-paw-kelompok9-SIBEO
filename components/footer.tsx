import Link from "next/link"
import Image from "next/image"
import { Github } from "lucide-react"

const teamMembers = [
  { name: "Tengku Hafid Diraputra", github: "https://github.com/ThDptr" },
  { name: "Devina Kartika", github: "https://github.com/dvnkrtk" },
  { name: "Riyan Sandi Prayoga", github: "https://github.com/404S4ND1" },
  { name: "Jonathan Nicholaus Damero Sinaga", github: "https://github.com/SinagaPande" },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SIBEO Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="SIBEO Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-primary">SIBEO</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sistem Belajar Online - Pusat Ilmu Daring untuk semua kalangan.
            </p>
            <p className="text-xs text-muted-foreground">UAS Pemrograman Aplikasi Web - Kelompok 9</p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">
                  Kursus
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Nama Kelompok */}
          <div>
            <h4 className="font-semibold mb-4">Tim Pengembang</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {teamMembers.map((member) => (
                <li key={member.github}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Github className="h-3 w-3" />
                    {member.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SIBEO - Sistem Belajar Online. Kelompok 9 PAW.</p>
        </div>
      </div>
    </footer>
  )
}
