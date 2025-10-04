import type { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit, Trash2, Flag, Link2, EyeOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostCardProps {
  post: Post
  userName: string
  userAvatar?: string
  username: string
}

export function PostCard({ post, userName, userAvatar, username }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm shadow-lg hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center gap-3 pb-3 bg-gradient-to-r from-transparent to-muted/10">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-semibold leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground">@{username}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit post
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link2 className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bookmark className="h-4 w-4 mr-2" />
              Save post
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide post
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" />
              Report post
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-4">
        <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>
        {post.image && (
          <div className="relative w-full rounded-xl overflow-hidden border bg-muted/30 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-1 pt-0 border-t bg-muted/20">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full">
          <Heart className="h-4 w-4" />
          <span className="text-xs font-medium">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 rounded-full">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-medium">{post.comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-green-500 hover:bg-green-50 transition-all duration-200 rounded-full"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200 rounded-full"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
