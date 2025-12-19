import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  const teamMembers = [
    { name: "Tengku Hafid Diraputra", github: "https://github.com/ThDptr" },
    { name: "Devina Kartika", github: "https://github.com/dvnkrtk" },
    { name: "Riyan Sandi Prayoga", github: "https://github.com/404S4ND1" },
    { name: "Jonathan Nicholaus Damero Sinaga", github: "https://github.com/SinagaPande" },
    { name: "Muhammad Fadhil AB", github: "#" },
  ]

  return (
    <footer className="border-t bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <a
                href="https://github.com/dvnkrtk/uas-paw-kelompok9-SIBEO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
                <span className="text-xl font-bold">SIBEO</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform e-learning modern untuk students dan instructor. Belajar lebih mudah, mengajar lebih efektif.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
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

          <div>
            <h4 className="font-semibold mb-4">Tim Pengembang</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {teamMembers.map((member, index) => (
                <li key={index}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Github className="h-3 w-3" />
                    {member.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 SIBEO - Sistem Belajar Online. Kelompok 9 UAS PAW.</p>
        </div>
      </div>
    </footer>
  )
}
