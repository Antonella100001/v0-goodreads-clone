# Configuración Local del Clon de Goodreads

## Requisitos Previos
- Node.js 18+ instalado
- Una cuenta de Supabase

## Configuración de Variables de Entorno

1. **Crea un archivo `.env.local`** en la raíz del proyecto
2. **Copia el contenido de `.env.local.example`** y reemplaza los valores

### Obtener las Variables de Supabase

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia los siguientes valores:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

5. Ve a **Settings** → **Database**
6. Copia la **Connection string** → `POSTGRES_URL`

### Variables Importantes

- **NEXT_PUBLIC_SUPABASE_URL**: URL pública de tu proyecto Supabase
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Clave pública para operaciones del cliente
- **SUPABASE_SERVICE_ROLE_KEY**: Clave privada para operaciones del servidor
- **POSTGRES_URL**: Cadena de conexión a la base de datos

## Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
\`\`\`

## Base de Datos

La base de datos ya está configurada con las siguientes tablas:
- `profiles` - Perfiles de usuario
- `books` - Catálogo de libros
- `user_books` - Biblioteca personal de cada usuario
- `reviews` - Reseñas y calificaciones
- `review_likes` - Likes en reseñas
- `follows` - Sistema de seguimiento entre usuarios
- `reading_goals` - Metas de lectura anuales

## Funcionalidades Implementadas

✅ **Autenticación completa** (registro, login, verificación de email)
✅ **Descubrimiento de libros** (explorar, buscar, filtrar)
✅ **Biblioteca personal** (estanterías: quiero leer, leyendo, leído)
✅ **Sistema de reseñas** (escribir, calificar, likes)
✅ **Funcionalidades sociales** (seguir usuarios, feed de actividad)
✅ **Perfiles de usuario** (estadísticas, bibliotecas públicas)

## Estructura del Proyecto

\`\`\`
app/
├── auth/           # Páginas de autenticación
├── books/          # Páginas de libros individuales
├── community/      # Página de comunidad
├── dashboard/      # Dashboard principal
├── explore/        # Exploración de libros
├── library/        # Biblioteca personal
├── reviews/        # Gestión de reseñas
└── users/          # Perfiles de usuarios

components/         # Componentes reutilizables
lib/supabase/      # Configuración de Supabase
scripts/           # Scripts SQL para la base de datos
