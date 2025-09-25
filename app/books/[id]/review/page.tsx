import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ReviewForm } from "@/components/review-form"
import { notFound } from "next/navigation"

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch book details
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, title, author")
    .eq("id", id)
    .single()

  if (bookError || !book) {
    notFound()
  }

  // Check if user already has a review for this book
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("book_id", id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{existingReview ? "Editar reseña" : "Escribir reseña"}</h1>
          <p className="text-muted-foreground">
            Comparte tu opinión sobre "{book.title}" de {book.author}
          </p>
        </div>

        <ReviewForm bookId={book.id} bookTitle={book.title} existingReview={existingReview} />
      </div>
    </div>
  )
}
