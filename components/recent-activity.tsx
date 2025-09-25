import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Activity {
  id: string
  type: "review" | "book_added" | "goal_completed"
  user: {
    display_name: string
    username: string
    avatar_url?: string
  }
  book?: {
    title: string
    author: string
  }
  review?: {
    rating: number
    review_text: string
  }
  created_at: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "review":
        return `escribió una reseña de "${activity.book?.title}"`
      case "book_added":
        return `agregó "${activity.book?.title}" a su biblioteca`
      case "goal_completed":
        return `completó su meta de lectura`
      default:
        return "realizó una actividad"
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "review":
        return <Badge variant="secondary">Reseña</Badge>
      case "book_added":
        return <Badge variant="outline">Libro agregado</Badge>
      case "goal_completed":
        return <Badge variant="default">Meta completada</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No hay actividad reciente</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{activity.user.display_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user.display_name}</span>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
                  {activity.review && (
                    <p className="text-sm bg-muted p-2 rounded">"{activity.review.review_text.substring(0, 100)}..."</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
