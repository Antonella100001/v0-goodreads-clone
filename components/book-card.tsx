import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    cover_url: string | null
    average_rating: number
    ratings_count: number
    genres: string[]
    description?: string
  }
  showDescription?: boolean
}

export function BookCard({ book, showDescription = false }: BookCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <Link href={`/books/${book.id}`} className="block">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative w-16 h-24 bg-muted rounded-md overflow-hidden">
                <Image
                  src={book.cover_url || "/placeholder.svg?height=96&width=64&query=book cover"}
                  alt={`Portada de ${book.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{book.author}</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{book.average_rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({book.ratings_count})</span>
              </div>

              {book.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {showDescription && book.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{book.description}</p>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
