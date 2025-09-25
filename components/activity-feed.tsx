import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "./star-rating"
import { BookOpen, Star, UserPlus, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ActivityItem {
  id: string
  type: "review" | "book_added" | "follow" | "goal_updated"
  created_at: string
  user: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  book?: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
  review?: {
    rating: number
    review_text: string | null
  }
  shelf?: string
  target_user?: {
    username: string
    display_name: string
  }
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "book_added":
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "review":
        return "escribió una reseña de"
      case "book_added":
        const shelfText =
          {
            "want-to-read": "quiere leer",
            "currently-reading": "está leyendo",
            read: "terminó de leer",
          }[activity.shelf || ""] || "agregó a su biblioteca"
        return shelfText
      case "follow":
        return `comenzó a seguir a ${activity.target_user?.display_name}`
      default:
        return "tuvo actividad con"
    }
  }

  const getShelfColor = (shelf: string) => {
    switch (shelf) {
      case "want-to-read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "currently-reading":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "read":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay actividad reciente</h3>
        <p className="text-muted-foreground">Sigue a otros usuarios para ver su actividad aquí</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">{activity.user.display_name.charAt(0).toUpperCase()}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getActivityIcon(activity.type)}
                  <Link href={`/users/${activity.user.username}`} className="font-medium text-sm hover:text-primary">
                    {activity.user.display_name}
                  </Link>
                  <span className="text-sm text-muted-foreground">{getActivityText(activity)}</span>
                  {activity.book && (
                    <Link href={`/books/${activity.book.id}`} className="font-medium text-sm hover:text-primary">
                      {activity.book.title}
                    </Link>
                  )}
                </div>

                {activity.book && (
                  <div className="flex gap-3 mt-3">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-16 bg-muted rounded overflow-hidden">
                        <Image
                          src={activity.book.cover_url || "/placeholder.svg?height=64&width=48&query=book cover"}
                          alt={activity.book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{activity.book.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.book.author}</p>

                      {activity.type === "review" && activity.review && (
                        <div className="mt-2">
                          <StarRating rating={activity.review.rating} readonly size="sm" />
                          {activity.review.review_text && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {activity.review.review_text}
                            </p>
                          )}
                        </div>
                      )}

                      {activity.type === "book_added" && activity.shelf && (
                        <div className="mt-2">
                          <Badge className={`text-xs ${getShelfColor(activity.shelf)}`}>
                            {activity.shelf === "want-to-read" && "Quiere leer"}
                            {activity.shelf === "currently-reading" && "Leyendo"}
                            {activity.shelf === "read" && "Leído"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
