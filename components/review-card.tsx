"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "./star-rating"
import { Heart, MessageCircle, AlertTriangle, MoreHorizontal, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    review_text: string | null
    spoiler_warning: boolean
    likes_count: number
    created_at: string
    user_id: string
    book_id: string
    profiles: {
      username: string
      display_name: string
      avatar_url: string | null
    } | null
    books?: {
      title: string
      author: string
      cover_url: string | null
    } | null
  }
  currentUserId?: string
  showBook?: boolean
  onDelete?: () => void
}

export function ReviewCard({ review, currentUserId, showBook = false, onDelete }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(review.likes_count)
  const [showSpoiler, setShowSpoiler] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isOwnReview = currentUserId === review.user_id

  const handleLike = async () => {
    if (!currentUserId) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("review_likes")
          .delete()
          .eq("user_id", currentUserId)
          .eq("review_id", review.id)

        if (error) throw error
        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        // Like
        const { error } = await supabase.from("review_likes").insert({
          user_id: currentUserId,
          review_id: review.id,
        })

        if (error) throw error
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }

      // Update the review's likes count
      await supabase
        .from("reviews")
        .update({ likes_count: isLiked ? likesCount - 1 : likesCount + 1 })
        .eq("id", review.id)
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwnReview) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", review.id)
      if (error) throw error

      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting review:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{review.profiles?.display_name?.charAt(0) || "U"}</span>
              </div>
              <div>
                <p className="font-medium text-sm">{review.profiles?.display_name || "Usuario"}</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnReview ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`/books/${review.book_id}/review`}>Editar reseña</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      Eliminar reseña
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Reportar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Book info (if showing book) */}
          {showBook && review.books && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                {review.books.cover_url && (
                  <img
                    src={review.books.cover_url || "/placeholder.svg"}
                    alt={review.books.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <Link href={`/books/${review.book_id}`} className="font-medium text-sm hover:text-primary">
                  {review.books.title}
                </Link>
                <p className="text-xs text-muted-foreground">{review.books.author}</p>
              </div>
            </div>
          )}

          {/* Review text */}
          {review.review_text && (
            <div>
              {review.spoiler_warning && !showSpoiler ? (
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Advertencia de spoilers
                    </span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">
                    Esta reseña contiene información que podría revelar detalles importantes de la trama.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSpoiler(true)}
                    className="border-orange-200 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-950/40"
                  >
                    Mostrar reseña
                  </Button>
                </div>
              ) : (
                <div>
                  {review.spoiler_warning && (
                    <Badge
                      variant="outline"
                      className="mb-2 border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Contiene spoilers
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.review_text}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center gap-2 h-8"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span className="text-xs">{likesCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Comentar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
