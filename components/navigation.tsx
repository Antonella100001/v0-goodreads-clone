"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BookOpen, Library, User, LogOut, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // Don't show navigation on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  if (loading) {
    return null
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6" />
              BookClub
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Inicio
                </Link>
                <Link
                  href="/explore"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/explore" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Explorar
                </Link>
                <Link
                  href="/library"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/library" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Mi Biblioteca
                </Link>
                <Link
                  href="/reviews"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/reviews" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Reseñas
                </Link>
                <Link
                  href="/community"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/community" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Comunidad
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Mi cuenta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/library" className="flex items-center gap-2">
                      <Library className="h-4 w-4" />
                      Mi biblioteca
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Mis reseñas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
