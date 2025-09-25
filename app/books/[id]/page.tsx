import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, BookOpen, Users, Edit } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { AddToLibraryButton } from "@/components/add-to-library-button"
import { ReviewCard } from "@/components/review-card"
import Link from "next/link"

interface BookPageProps {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch book details
  const { data: book, error } = await supabase.from("books").select("*").eq("id", id).single()

  if (error || !book) {
    notFound()
  }

  // Check if user is logged in and get their library status for this book
  const { data: userData } = await supabase.auth.getUser()
  let userBook = null
  let userReview = null

  if (userData.user) {
    const { data } = await supabase
      .from("user_books")
      .select("shelf")
      .eq("user_id", userData.user.id)
      .eq("book_id", id)
      .single()
    userBook = data

    // Check if user has reviewed this book
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("book_id", id)
      .single()
    userReview = reviewData
  }

  // Fetch recent reviews for this book
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("book_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="relative w-full aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-6">
                  <Image
                    src={book.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                    alt={`Portada de ${book.title}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <AddToLibraryButton bookId={book.id} currentShelf={userBook?.shelf} className="w-full" />

                  {userData.user && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href={`/books/${book.id}/review`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {userReview ? "Editar reseña" : "Escribir reseña"}
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{book.average_rating.toFixed(2)}</span>
                    <span className="text-muted-foreground">({book.ratings_count} calificaciones)</span>
                  </div>

                  {book.publication_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Publicado: {new Date(book.publication_date).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  )}

                  {book.pages && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{book.pages} páginas</span>
                    </div>
                  )}

                  {book.language && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Idioma: {book.language.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">por {book.author}</p>

              {book.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {book.description && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{book.description}</p>
                </div>
              )}
            </div>

            {/* User's Review */}
            {userReview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Tu reseña
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewCard
                    review={{
                      ...userReview,
                      profiles: {
                        username: "tu-usuario",
                        display_name: "Tú",
                        avatar_url: null,
                      },
                    }}
                    currentUserId={userData.user?.id}
                    showBook={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Reseñas de la comunidad ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews
                    .filter((review: any) => review.user_id !== userData.user?.id)
                    .map((review: any) => (
                      <ReviewCard key={review.id} review={review} currentUserId={userData.user?.id} showBook={false} />
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
