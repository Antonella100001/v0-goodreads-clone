import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserCard } from "@/components/user-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, BookOpen } from "lucide-react"

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch users with their stats
  const { data: users } = await supabase.rpc("get_users_with_stats")

  // Fetch recent activity (mock data for now since we need to create the activity tracking)
  const recentActivity = [
    {
      id: "1",
      type: "review" as const,
      created_at: new Date().toISOString(),
      user: {
        id: "user1",
        username: "maria_lectora",
        display_name: "María García",
        avatar_url: null,
      },
      book: {
        id: "book1",
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        cover_url: "/abstract-book-cover.png",
      },
      review: {
        rating: 5,
        review_text: "Una obra maestra del realismo mágico. García Márquez logra crear un mundo único...",
      },
    },
    {
      id: "2",
      type: "book_added" as const,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: "user2",
        username: "carlos_reader",
        display_name: "Carlos Mendoza",
        avatar_url: null,
      },
      book: {
        id: "book2",
        title: "Pedro Páramo",
        author: "Juan Rulfo",
        cover_url: "/abstract-book-cover.png",
      },
      shelf: "currently-reading",
    },
  ]

  // Get popular books this week (simplified)
  const { data: popularBooks } = await supabase
    .from("books")
    .select("*")
    .order("ratings_count", { ascending: false })
    .limit(5)

  // Get user's following count
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", data.user.id)

  // Get user's followers count
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", data.user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Comunidad</h1>
          <p className="text-muted-foreground">Conecta con otros lectores y descubre nuevas recomendaciones</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Siguiendo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{followingCount || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Seguidores</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{followersCount || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Libros populares</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">{popularBooks?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activity">Actividad reciente</TabsTrigger>
                <TabsTrigger value="discover">Descubrir usuarios</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <ActivityFeed activities={recentActivity} />
              </TabsContent>

              <TabsContent value="discover">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lectores recomendados</h3>
                  {users && users.length > 0 ? (
                    <div className="grid gap-4">
                      {users
                        .filter((user: any) => user.id !== data.user.id)
                        .slice(0, 10)
                        .map((user: any) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            stats={{
                              books_read: user.books_read || 0,
                              reviews_count: user.reviews_count || 0,
                              followers_count: user.followers_count || 0,
                              following_count: user.following_count || 0,
                            }}
                            currentUserId={data.user.id}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hay usuarios para mostrar</h3>
                      <p className="text-muted-foreground">Sé el primero en unirte a la comunidad</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Libros populares esta semana
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularBooks?.map((book, index) => (
                  <div key={book.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{book.average_rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">★</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reading Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Meta de lectura 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">0 / 12</div>
                  <p className="text-sm text-muted-foreground mb-4">libros leídos este año</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
