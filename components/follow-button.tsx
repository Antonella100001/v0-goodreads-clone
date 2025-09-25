"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
  targetUserId: string
  currentUserId?: string
  initialFollowing?: boolean
  className?: string
}

export function FollowButton({ targetUserId, currentUserId, initialFollowing = false, className }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (currentUserId && currentUserId !== targetUserId) {
      checkFollowStatus()
    }
  }, [currentUserId, targetUserId])

  const checkFollowStatus = async () => {
    if (!currentUserId) return

    try {
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .single()

      setIsFollowing(!!data)
    } catch (error) {
      // User is not following
      setIsFollowing(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUserId) {
      router.push("/auth/login")
      return
    }

    if (currentUserId === targetUserId) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", targetUserId)

        if (error) throw error
        setIsFollowing(false)
      } else {
        // Follow
        const { error } = await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: targetUserId,
        })

        if (error) throw error
        setIsFollowing(true)
      }

      router.refresh()
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button for own profile
  if (currentUserId === targetUserId) {
    return null
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={className}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Seguir
        </>
      )}
    </Button>
  )
}
