-- Create users profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  description TEXT,
  cover_url TEXT,
  publication_date DATE,
  pages INTEGER,
  language TEXT DEFAULT 'es',
  genres TEXT[] DEFAULT '{}',
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  ratings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_books table (user's library with shelves)
CREATE TABLE IF NOT EXISTS public.user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  shelf TEXT NOT NULL DEFAULT 'want-to-read', -- 'want-to-read', 'currently-reading', 'read'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  started_reading_at TIMESTAMP WITH TIME ZONE,
  finished_reading_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  spoiler_warning BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create review_likes table
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- Create follows table (user following system)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create reading_goals table
CREATE TABLE IF NOT EXISTS public.reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  target_books INTEGER NOT NULL,
  books_read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for books (public read, admin write)
CREATE POLICY "books_select_all" ON public.books FOR SELECT USING (true);
CREATE POLICY "books_insert_admin" ON public.books FOR INSERT WITH CHECK (false); -- Only admin can add books
CREATE POLICY "books_update_admin" ON public.books FOR UPDATE USING (false); -- Only admin can update books

-- RLS Policies for user_books
CREATE POLICY "user_books_select_own" ON public.user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_books_insert_own" ON public.user_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_books_update_own" ON public.user_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_books_delete_own" ON public.user_books FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for review_likes
CREATE POLICY "review_likes_select_all" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "review_likes_insert_own" ON public.review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "review_likes_delete_own" ON public.review_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for follows
CREATE POLICY "follows_select_all" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for reading_goals
CREATE POLICY "reading_goals_select_own" ON public.reading_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_goals_insert_own" ON public.reading_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_goals_update_own" ON public.reading_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reading_goals_delete_own" ON public.reading_goals FOR DELETE USING (auth.uid() = user_id);
