"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Check, BookOpen, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToLibraryButtonProps {
  bookId: string
  currentShelf?: string | null
  className?: string
}

const SHELVES = [
  { id: "want-to-read", label: "Quiero leer", icon: Eye },
  { id: "currently-reading", label: "Leyendo", icon: BookOpen },
  { id: "read", label: "Leído", icon: Check },
]

export function AddToLibraryButton({ bookId, currentShelf, className }: AddToLibraryButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userShelf, setUserShelf] = useState(currentShelf)
  const router = useRouter()
  const supabase = createClient()

  const handleAddToShelf = async (shelf: string) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      if (userShelf) {
        // Update existing entry
        const { error } = await supabase
          .from("user_books")
          .update({
            shelf,
            updated_at: new Date().toISOString(),
            ...(shelf === "currently-reading" && { started_reading_at: new Date().toISOString() }),
            ...(shelf === "read" && { finished_reading_at: new Date().toISOString() }),
          })
          .eq("user_id", user.id)
          .eq("book_id", bookId)

        if (error) throw error
      } else {
        // Create new entry
        const { error } = await supabase.from("user_books").insert({
          user_id: user.id,
          book_id: bookId,
          shelf,
          ...(shelf === "currently-reading" && { started_reading_at: new Date().toISOString() }),
          ...(shelf === "read" && { finished_reading_at: new Date().toISOString() }),
        })

        if (error) throw error
      }

      setUserShelf(shelf)
      router.refresh()
    } catch (error) {
      console.error("Error adding to library:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromLibrary = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("user_books").delete().eq("user_id", user.id).eq("book_id", bookId)

      if (error) throw error

      setUserShelf(null)
      router.refresh()
    } catch (error) {
      console.error("Error removing from library:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (userShelf) {
    const currentShelfData = SHELVES.find((s) => s.id === userShelf)
    const CurrentIcon = currentShelfData?.icon || BookOpen

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={className} disabled={isLoading}>
            <CurrentIcon className="h-4 w-4 mr-2" />
            {currentShelfData?.label || "En biblioteca"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SHELVES.map((shelf) => {
            const Icon = shelf.icon
            return (
              <DropdownMenuItem
                key={shelf.id}
                onClick={() => handleAddToShelf(shelf.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {shelf.label}
                {userShelf === shelf.id && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuItem onClick={handleRemoveFromLibrary} className="text-destructive">
            Quitar de biblioteca
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar a biblioteca
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SHELVES.map((shelf) => {
          const Icon = shelf.icon
          return (
            <DropdownMenuItem
              key={shelf.id}
              onClick={() => handleAddToShelf(shelf.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {shelf.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
