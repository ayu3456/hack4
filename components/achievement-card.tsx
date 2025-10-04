"use client"

import type { Achievement } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Trophy, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Link2, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AchievementCardProps {
  achievement: Achievement
  userName: string
  userAvatar?: string
  username: string
}

export function AchievementCard({ achievement, userName, userAvatar, username }: AchievementCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <Card className="overflow-hidden border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
      <CardHeader className="flex flex-row items-start gap-3 pb-3">
        <Avatar className="h-10 w-10 ring-2 ring-amber-400">
          <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold leading-none">{userName}</p>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xs text-muted-foreground">@{username}</p>
          <span className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share achievement
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link2 className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete achievement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
          <div className="text-3xl shrink-0">{achievement.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 pb-3 px-6">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className={`gap-1.5 ${liked ? "text-red-500" : ""}`} onClick={handleLike}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{Math.floor(Math.random() * 20)}</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={bookmarked ? "text-primary" : ""}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
