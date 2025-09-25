import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { BookCard } from "@/components/book-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReadingProgress } from "@/components/reading-progress"
import { RecentActivity } from "@/components/recent-activity"
import { BookOpen, Star, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: stats } = await supabase.rpc("get_user_stats", { user_id: data.user.id })

  const { data: readingGoal } = await supabase
    .from("reading_goals")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("year", new Date().getFullYear())
    .single()

  // Fetch user's recent activity and recommendations
  const { data: recentBooks } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  const { data: popularBooks } = await supabase
    .from("books")
    .select("*")
    .order("ratings_count", { ascending: false })
    .limit(6)

  const { data: recentActivity } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      review_text,
      created_at,
      profiles!inner(display_name, username, avatar_url),
      books!inner(title, author)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const activities =
    recentActivity?.map((activity) => ({
      id: activity.id,
      type: "review" as const,
      user: {
        display_name: activity.profiles.display_name || "Usuario",
        username: activity.profiles.username || "",
        avatar_url: activity.profiles.avatar_url,
      },
      book: {
        title: activity.books.title,
        author: activity.books.author,
      },
      review: {
        rating: activity.rating,
        review_text: activity.review_text,
      },
      created_at: activity.created_at,
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">¡Hola de nuevo!</h1>
          <p className="text-muted-foreground">Descubre tu próxima gran lectura</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.books_read || 0}</p>
                  <p className="text-xs text-muted-foreground">Libros leídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.reviews_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Reseñas escritas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.following_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Siguiendo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {readingGoal ? Math.round((readingGoal.books_read / readingGoal.target_books) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Meta anual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ReadingProgress goal={readingGoal} />
          </div>
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* Popular Books */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Libros populares</h2>
            <Button variant="outline" asChild>
              <Link href="/explore">Ver todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularBooks?.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Recent Additions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Agregados recientemente</h2>
            <Button variant="outline" asChild>
              <Link href="/explore">Explorar más</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBooks?.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
