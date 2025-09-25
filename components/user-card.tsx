import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Star } from "lucide-react"
import { FollowButton } from "./follow-button"
import Link from "next/link"

interface UserCardProps {
  user: {
    id: string
    username: string
    display_name: string
    bio: string | null
    avatar_url: string | null
    location: string | null
  }
  stats?: {
    books_read: number
    reviews_count: number
    followers_count: number
    following_count: number
  }
  currentUserId?: string
  showFollowButton?: boolean
}

export function UserCard({ user, stats, currentUserId, showFollowButton = true }: UserCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-lg font-medium">{user.display_name.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/users/${user.username}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-sm truncate">{user.display_name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>

              {showFollowButton && (
                <FollowButton targetUserId={user.id} currentUserId={currentUserId} className="ml-2" />
              )}
            </div>

            {user.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{user.bio}</p>}

            {user.location && (
              <Badge variant="outline" className="text-xs mb-2">
                {user.location}
              </Badge>
            )}

            {stats && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{stats.books_read} leídos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{stats.reviews_count} reseñas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{stats.followers_count} seguidores</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
