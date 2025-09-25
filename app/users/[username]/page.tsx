import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Star, MapPin, Calendar, Globe } from "lucide-react"
import { FollowButton } from "@/components/follow-button"
import { LibraryBookCard } from "@/components/library-book-card"
import { ReviewCard } from "@/components/review-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

interface UserProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get current user
  const { data: currentUser } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (error || !profile) {
    notFound()
  }

  // Fetch user's reading stats
  const { data: userBooks } = await supabase
    .from("user_books")
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url,
        average_rating,
        ratings_count,
        genres
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  // Fetch user's reviews
  const { data: userReviews } = await supabase
    .from("reviews")
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get follow counts
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id)

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profile.id)

  // Calculate reading stats
  const totalBooks = userBooks?.length || 0
  const booksRead = userBooks?.filter((ub) => ub.shelf === "read").length || 0
  const currentlyReading = userBooks?.filter((ub) => ub.shelf === "currently-reading").length || 0
  const wantToRead = userBooks?.filter((ub) => ub.shelf === "want-to-read").length || 0
  const reviewsCount = userReviews?.length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">{profile.display_name.charAt(0).toUpperCase()}</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{profile.display_name}</h1>
                    <p className="text-muted-foreground mb-2">@{profile.username}</p>
                    {profile.bio && <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>}
                  </div>

                  <FollowButton targetUserId={profile.id} currentUserId={currentUser.user?.id} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Se unió en{" "}
                      {new Date(profile.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{followingCount || 0}</span>
                    <span className="text-muted-foreground ml-1">siguiendo</span>
                  </div>
                  <div>
                    <span className="font-semibold">{followersCount || 0}</span>
                    <span className="text-muted-foreground ml-1">seguidores</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalBooks}</div>
              <div className="text-xs text-muted-foreground">Total libros</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-6 w-6 bg-purple-100 dark:bg-purple-900 rounded mx-auto mb-2 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 text-xs">✓</span>
              </div>
              <div className="text-2xl font-bold">{booksRead}</div>
              <div className="text-xs text-muted-foreground">Leídos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{reviewsCount}</div>
              <div className="text-xs text-muted-foreground">Reseñas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-6 w-6 bg-green-100 dark:bg-green-900 rounded mx-auto mb-2 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 text-xs">📖</span>
              </div>
              <div className="text-2xl font-bold">{currentlyReading}</div>
              <div className="text-xs text-muted-foreground">Leyendo</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">Biblioteca ({totalBooks})</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas ({reviewsCount})</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            {userBooks && userBooks.length > 0 ? (
              <div className="grid gap-4">
                {userBooks.slice(0, 10).map((userBook: any) => (
                  <LibraryBookCard key={userBook.id} book={userBook.books} userBook={userBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay libros en la biblioteca</h3>
                <p className="text-muted-foreground">Este usuario aún no ha agregado libros a su biblioteca</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {userReviews && userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review: any) => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      ...review,
                      profiles: {
                        username: profile.username,
                        display_name: profile.display_name,
                        avatar_url: profile.avatar_url,
                      },
                    }}
                    currentUserId={currentUser.user?.id}
                    showBook={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay reseñas</h3>
                <p className="text-muted-foreground">Este usuario aún no ha escrito ninguna reseña</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Actividad reciente</h3>
              <p className="text-muted-foreground">La actividad del usuario aparecerá aquí</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
