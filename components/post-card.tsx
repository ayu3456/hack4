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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-semibold leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground">@{username}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <p className="text-sm leading-relaxed">{post.content}</p>
        {post.image && (
          <div className="relative w-full rounded-lg overflow-hidden border bg-muted">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-1 pt-0 border-t">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-red-500 transition-colors">
          <Heart className="h-4 w-4" />
          <span className="text-xs font-medium">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-blue-500 transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-medium">{post.comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-green-500 transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground hover:text-yellow-500 transition-colors"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
