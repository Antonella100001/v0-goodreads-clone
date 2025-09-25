import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Tu biblioteca personal en línea
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Descubre nuevos libros, comparte reseñas y conecta con otros lectores apasionados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">Comenzar gratis</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Todo lo que necesitas para organizar tu lectura</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Organiza tu biblioteca</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mantén un registro de los libros que has leído, estás leyendo y quieres leer
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Califica y reseña</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comparte tu opinión sobre los libros y ayuda a otros lectores a descubrir nuevas historias
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Conecta con lectores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sigue a otros lectores, descubre qué están leyendo y participa en discusiones
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Metas de lectura</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Establece objetivos anuales de lectura y mantén un seguimiento de tu progreso
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar tu aventura literaria?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de lectores que ya organizan su biblioteca con nosotros
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">Crear cuenta gratuita</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
