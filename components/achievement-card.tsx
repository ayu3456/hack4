"use client"

import type { Achievement } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Trophy, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Link2, Trash2 } from "lucide-react"
import { useState } from "react"
import { getAvatarSrc } from "@/lib/avatarUtils"
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

  const avatarSrc = getAvatarSrc(userAvatar, achievement.userId);

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80 dark:from-amber-950/20 dark:via-orange-950/15 dark:to-yellow-950/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start gap-3 pb-3 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <Avatar className="h-12 w-12 ring-2 ring-amber-400/50 ring-offset-2 ring-offset-background">
          <AvatarImage src={avatarSrc} alt={userName} />
          <AvatarFallback>
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold leading-none">{userName}</p>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1">
              <Trophy className="h-3 w-3 text-white" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">@{username}</p>
          <span className="text-xs text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded-full w-fit">
            {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-amber-100/50">
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
      <CardContent className="pb-4 space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-100/70 via-orange-100/50 to-yellow-100/70 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-800/30 shadow-sm">
          <div className="text-4xl shrink-0 animate-pulse">{achievement.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-2 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 pb-4 px-6 bg-gradient-to-r from-transparent to-amber-50/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className={`gap-2 rounded-full hover:bg-red-50 transition-all duration-200 ${liked ? "text-red-500 bg-red-50" : "text-muted-foreground"}`} onClick={handleLike}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 rounded-full">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{Math.floor(Math.random() * 20)}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500 hover:bg-green-50 transition-all duration-200 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`transition-all duration-200 rounded-full ${bookmarked ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
