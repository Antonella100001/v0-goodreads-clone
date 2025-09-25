-- Function to get users with their reading stats
CREATE OR REPLACE FUNCTION get_users_with_stats()
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  books_read BIGINT,
  reviews_count BIGINT,
  followers_count BIGINT,
  following_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.bio,
    p.avatar_url,
    p.location,
    COALESCE(books_stats.books_read, 0) as books_read,
    COALESCE(review_stats.reviews_count, 0) as reviews_count,
    COALESCE(follower_stats.followers_count, 0) as followers_count,
    COALESCE(following_stats.following_count, 0) as following_count
  FROM profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) as books_read
    FROM user_books 
    WHERE shelf = 'read'
    GROUP BY user_id
  ) books_stats ON p.id = books_stats.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as reviews_count
    FROM reviews
    GROUP BY user_id
  ) review_stats ON p.id = review_stats.user_id
  LEFT JOIN (
    SELECT following_id, COUNT(*) as followers_count
    FROM follows
    GROUP BY following_id
  ) follower_stats ON p.id = follower_stats.following_id
  LEFT JOIN (
    SELECT follower_id, COUNT(*) as following_count
    FROM follows
    GROUP BY follower_id
  ) following_stats ON p.id = following_stats.follower_id
  ORDER BY p.created_at DESC;
END;
$$;
