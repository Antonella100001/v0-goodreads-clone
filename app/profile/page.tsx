import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: stats } = await supabase.rpc("get_user_stats", { user_id: user.id })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{profile?.display_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{profile?.display_name || "Usuario"}</h3>
                  <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{stats?.books_read || 0}</p>
                  <p className="text-sm text-muted-foreground">Libros leídos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.reviews_count || 0}</p>
                  <p className="text-sm text-muted-foreground">Reseñas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.followers_count || 0}</p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.following_count || 0}</p>
                  <p className="text-sm text-muted-foreground">Siguiendo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name">Nombre para mostrar</Label>
                    <Input id="display_name" defaultValue={profile?.display_name || ""} placeholder="Tu nombre" />
                  </div>
                  <div>
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input id="username" defaultValue={profile?.username || ""} placeholder="usuario123" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    defaultValue={profile?.bio || ""}
                    placeholder="Cuéntanos sobre ti y tus gustos literarios..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" defaultValue={profile?.location || ""} placeholder="Ciudad, País" />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio web</Label>
                    <Input id="website" defaultValue={profile?.website || ""} placeholder="https://tu-sitio.com" />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Guardar cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
