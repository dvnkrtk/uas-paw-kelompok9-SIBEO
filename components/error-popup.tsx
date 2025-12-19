"use client"

import { AlertCircle, X, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorPopupProps {
  message: string
  onClose: () => void
  type?: "error" | "warning" | "info"
  title?: string
}

export function ErrorPopup({ message, onClose, type = "error", title }: ErrorPopupProps) {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    error: "bg-destructive/10 text-destructive",
    warning: "bg-yellow-500/10 text-yellow-600",
    info: "bg-primary/10 text-primary",
  }

  const titles = {
    error: "Terjadi Kesalahan",
    warning: "Perhatian",
    info: "Informasi",
  }

  const Icon = icons[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-card border rounded-lg shadow-lg p-6 animate-in fade-in zoom-in duration-200">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${colors[type]}`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title || titles[type]}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
