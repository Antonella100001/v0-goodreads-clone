"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { AddToLibraryButton } from "./add-to-library-button"

interface LibraryBookCardProps {
  book: {
    id: string
    title: string
    author: string
    cover_url: string | null
    average_rating: number
    ratings_count: number
    genres: string[]
  }
  userBook: {
    shelf: string
    rating: number | null
    started_reading_at: string | null
    finished_reading_at: string | null
    created_at: string
  }
  onRemove?: () => void
}

export function LibraryBookCard({ book, userBook, onRemove }: LibraryBookCardProps) {
  const getShelfLabel = (shelf: string) => {
    switch (shelf) {
      case "want-to-read":
        return "Quiero leer"
      case "currently-reading":
        return "Leyendo"
      case "read":
        return "Leído"
      default:
        return shelf
    }
  }

  const getShelfColor = (shelf: string) => {
    switch (shelf) {
      case "want-to-read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "currently-reading":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "read":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Link href={`/books/${book.id}`}>
              <div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden">
                <Image
                  src={book.cover_url || "/placeholder.svg?height=112&width=80&query=book cover"}
                  alt={`Portada de ${book.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/books/${book.id}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/books/${book.id}`}>Ver detalles</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/books/${book.id}/review`}>Escribir reseña</Link>
                  </DropdownMenuItem>
                  {onRemove && (
                    <DropdownMenuItem onClick={onRemove} className="text-destructive">
                      Quitar de biblioteca
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${getShelfColor(userBook.shelf)}`}>{getShelfLabel(userBook.shelf)}</Badge>
              {userBook.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{userBook.rating}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Agregado: {new Date(userBook.created_at).toLocaleDateString("es-ES", { dateStyle: "short" })}</span>
            </div>

            {userBook.started_reading_at && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>
                  Iniciado: {new Date(userBook.started_reading_at).toLocaleDateString("es-ES", { dateStyle: "short" })}
                </span>
              </div>
            )}

            {userBook.finished_reading_at && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>
                  Terminado:{" "}
                  {new Date(userBook.finished_reading_at).toLocaleDateString("es-ES", { dateStyle: "short" })}
                </span>
              </div>
            )}

            <div className="mt-3">
              <AddToLibraryButton bookId={book.id} currentShelf={userBook.shelf} className="h-8 text-xs" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
