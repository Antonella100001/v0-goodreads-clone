import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReadingProgressProps {
  goal: {
    target_books: number
    books_read: number
    year: number
  } | null
}

export function ReadingProgress({ goal }: ReadingProgressProps) {
  if (!goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meta de Lectura {new Date().getFullYear()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No has establecido una meta de lectura para este año.</p>
        </CardContent>
      </Card>
    )
  }

  const progress = (goal.books_read / goal.target_books) * 100
  const remaining = Math.max(0, goal.target_books - goal.books_read)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta de Lectura {goal.year}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>
            {goal.books_read} de {goal.target_books} libros
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-center">
          {remaining > 0 ? (
            <p className="text-sm text-muted-foreground">Te faltan {remaining} libros para alcanzar tu meta</p>
          ) : (
            <p className="text-sm text-green-600 font-medium">¡Felicidades! Has alcanzado tu meta de lectura</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
