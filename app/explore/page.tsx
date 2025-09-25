"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { BookCard } from "@/components/book-card"
import { SearchBar } from "@/components/search-bar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  average_rating: number
  ratings_count: number
  genres: string[]
  description: string | null
  publication_date: string | null
}

const POPULAR_GENRES = [
  "Realismo mágico",
  "Literatura latinoamericana",
  "Romance",
  "Drama familiar",
  "Literatura experimental",
  "Literatura mexicana",
  "Literatura fantástica",
  "Literatura peruana",
  "Psicológica",
  "Misterio",
]

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("rating")

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchQuery, selectedGenre, sortBy])

  const fetchBooks = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("books").select("*").order("average_rating", { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBooks = () => {
    let filtered = [...books]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genres.includes(selectedGenre))
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.average_rating - a.average_rating
        case "popularity":
          return b.ratings_count - a.ratings_count
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "newest":
          return new Date(b.publication_date || "").getTime() - new Date(a.publication_date || "").getTime()
        default:
          return 0
      }
    })

    setFilteredBooks(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? "all" : genre)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explorar Libros</h1>
          <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
            <TabsTrigger value="recent">Recientes</TabsTrigger>
          </TabsList>

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Filters Sidebar */}
            <div className="lg:w-64 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Ordenar por</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Mejor calificados</SelectItem>
                    <SelectItem value="popularity">Más populares</SelectItem>
                    <SelectItem value="title">Título A-Z</SelectItem>
                    <SelectItem value="author">Autor A-Z</SelectItem>
                    <SelectItem value="newest">Más recientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Géneros</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedGenre === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedGenre("all")}
                  >
                    Todos
                  </Badge>
                  {POPULAR_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleGenreClick(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1">
              <TabsContent value="all" className="mt-0">
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No se encontraron libros con los filtros seleccionados.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredBooks.map((book) => (
                      <BookCard key={book.id} book={book} showDescription />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-0">
                <div className="grid gap-4">
                  {filteredBooks
                    .filter((book) => book.ratings_count > 500)
                    .map((book) => (
                      <BookCard key={book.id} book={book} showDescription />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <div className="grid gap-4">
                  {filteredBooks
                    .filter((book) => {
                      const pubDate = new Date(book.publication_date || "")
                      const currentYear = new Date().getFullYear()
                      return pubDate.getFullYear() >= currentYear - 5
                    })
                    .map((book) => (
                      <BookCard key={book.id} book={book} showDescription />
                    ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
