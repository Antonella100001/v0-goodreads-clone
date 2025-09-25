import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Revisa tu correo!</CardTitle>
            <CardDescription>Te hemos enviado un enlace de verificación</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y
              haz clic en el enlace para activar tu cuenta.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Si no ves el correo, revisa tu carpeta de spam.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
