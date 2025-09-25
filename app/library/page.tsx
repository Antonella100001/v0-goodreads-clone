import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LibraryBookCard } from "@/components/library-book-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Eye, Check, TrendingUp } from "lucide-react"

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's books with book details
  const { data: userBooks } = await supabase
    .from("user_books")
    .select(
      `
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
    `,
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Group books by shelf
  const booksByShelf = {
    "want-to-read": userBooks?.filter((ub) => ub.shelf === "want-to-read") || [],
    "currently-reading": userBooks?.filter((ub) => ub.shelf === "currently-reading") || [],
    read: userBooks?.filter((ub) => ub.shelf === "read") || [],
  }

  // Calculate stats
  const totalBooks = userBooks?.length || 0
  const booksRead = booksByShelf.read.length
  const currentlyReading = booksByShelf["currently-reading"].length
  const wantToRead = booksByShelf["want-to-read"].length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Mi Biblioteca</h1>
          <p className="text-muted-foreground">Organiza y gestiona tu colección personal de libros</p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de libros</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{totalBooks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quiero leer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{wantToRead}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leyendo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{currentlyReading}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leídos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{booksRead}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Library Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos ({totalBooks})</TabsTrigger>
            <TabsTrigger value="want-to-read">Quiero leer ({wantToRead})</TabsTrigger>
            <TabsTrigger value="currently-reading">Leyendo ({currentlyReading})</TabsTrigger>
            <TabsTrigger value="read">Leídos ({booksRead})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {userBooks && userBooks.length > 0 ? (
              <div className="grid gap-4">
                {userBooks.map((userBook: any) => (
                  <LibraryBookCard key={userBook.id} book={userBook.books} userBook={userBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tu biblioteca está vacía</h3>
                <p className="text-muted-foreground">
                  Comienza agregando algunos libros desde la página de exploración
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="want-to-read" className="space-y-4">
            {booksByShelf["want-to-read"].length > 0 ? (
              <div className="grid gap-4">
                {booksByShelf["want-to-read"].map((userBook: any) => (
                  <LibraryBookCard key={userBook.id} book={userBook.books} userBook={userBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes libros en "Quiero leer"</h3>
                <p className="text-muted-foreground">Agrega libros que te interesen para leer más tarde</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="currently-reading" className="space-y-4">
            {booksByShelf["currently-reading"].length > 0 ? (
              <div className="grid gap-4">
                {booksByShelf["currently-reading"].map((userBook: any) => (
                  <LibraryBookCard key={userBook.id} book={userBook.books} userBook={userBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No estás leyendo ningún libro actualmente</h3>
                <p className="text-muted-foreground">¡Es hora de comenzar una nueva aventura literaria!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {booksByShelf.read.length > 0 ? (
              <div className="grid gap-4">
                {booksByShelf.read.map((userBook: any) => (
                  <LibraryBookCard key={userBook.id} book={userBook.books} userBook={userBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Check className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aún no has terminado ningún libro</h3>
                <p className="text-muted-foreground">Los libros que completes aparecerán aquí</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
