"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { StarRating } from "./star-rating"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

interface ReviewFormProps {
  bookId: string
  bookTitle: string
  existingReview?: {
    id: string
    rating: number
    review_text: string | null
    spoiler_warning: boolean
  } | null
  onSuccess?: () => void
}

export function ReviewForm({ bookId, bookTitle, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "")
  const [spoilerWarning, setSpoilerWarning] = useState(existingReview?.spoiler_warning || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Por favor selecciona una calificación")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const reviewData = {
        user_id: user.id,
        book_id: bookId,
        rating,
        review_text: reviewText.trim() || null,
        spoiler_warning: spoilerWarning,
        updated_at: new Date().toISOString(),
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase.from("reviews").update(reviewData).eq("id", existingReview.id)
        if (error) throw error
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert(reviewData)
        if (error) throw error
      }

      // Update book's average rating and count
      await updateBookRating(bookId)

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/books/${bookId}`)
      }
    } catch (error: any) {
      console.error("Error saving review:", error)
      setError(error.message || "Error al guardar la reseña")
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookRating = async (bookId: string) => {
    try {
      // Get all ratings for this book
      const { data: reviews } = await supabase.from("reviews").select("rating").eq("book_id", bookId)

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / reviews.length
        const ratingsCount = reviews.length

        // Update book with new average rating and count
        await supabase
          .from("books")
          .update({
            average_rating: Number(averageRating.toFixed(2)),
            ratings_count: ratingsCount,
          })
          .eq("id", bookId)
      }
    } catch (error) {
      console.error("Error updating book rating:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? "Editar reseña" : "Escribir reseña"}</CardTitle>
        <p className="text-sm text-muted-foreground">{bookTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Calificación *</label>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {rating === 1 && "No me gustó"}
                {rating === 2 && "Estuvo bien"}
                {rating === 3 && "Me gustó"}
                {rating === 4 && "Me gustó mucho"}
                {rating === 5 && "¡Me encantó!"}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="review" className="text-sm font-medium mb-2 block">
              Reseña (opcional)
            </label>
            <Textarea
              id="review"
              placeholder="Comparte tu opinión sobre este libro..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {reviewText.trim() && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spoiler"
                checked={spoilerWarning}
                onCheckedChange={(checked) => setSpoilerWarning(checked as boolean)}
              />
              <label
                htmlFor="spoiler"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Esta reseña contiene spoilers
              </label>
            </div>
          )}

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading || rating === 0}>
              {isLoading ? "Guardando..." : existingReview ? "Actualizar reseña" : "Publicar reseña"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
