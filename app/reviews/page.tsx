import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ReviewCard } from "@/components/review-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ReviewsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's reviews
  const { data: userReviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      ),
      books (
        title,
        author,
        cover_url
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Fetch recent reviews from followed users (for now, just recent reviews)
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      ),
      books (
        title,
        author,
        cover_url
      )
    `)
    .neq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Reseñas</h1>
          <p className="text-muted-foreground">Descubre qué están leyendo y opinando otros lectores</p>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Actividad reciente</TabsTrigger>
            <TabsTrigger value="my-reviews">Mis reseñas ({userReviews?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review: any) => (
                  <ReviewCard key={review.id} review={review} currentUserId={data.user.id} showBook={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay reseñas recientes para mostrar.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-reviews" className="space-y-4">
            {userReviews && userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review: any) => (
                  <ReviewCard key={review.id} review={review} currentUserId={data.user.id} showBook={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aún no has escrito ninguna reseña.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Comienza explorando libros y compartiendo tus opiniones.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
