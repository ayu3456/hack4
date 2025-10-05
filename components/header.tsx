"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../context/authContext";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Home, User, LogOut, Search, Plus, MoreHorizontal, Send } from "lucide-react"

interface HeaderProps {
  onPostCreated?: () => void;
}

export function Header({ onPostCreated }: HeaderProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Search query:", searchQuery)
    // Search functionality would be implemented here
  }

  return (
    <>
      <header className="sticky md:mx-14 top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevConnect
            </span>
          </Link>

          {user ? (
            <>
              <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-9 bg-muted/30 border-border/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <div className="flex items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 cursor-pointer">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Create Post</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create a new post</DialogTitle>
                      <DialogDescription>
                        Share your thoughts, code, or achievements with the community
                      </DialogDescription>
                    </DialogHeader>
                    <CreatePostForm onPostCreated={onPostCreated} />
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="gap-2 cursor-pointer">
                  <Link href="/profile" className="cursor-pointer">
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-xl border-border/50" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/" className="cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setSidebarOpen(true)}>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  )
}

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsCreatingPost(true)
    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          userUsername: user.username
        }),
      })

      if (response.ok) {
        setContent("")
        // Close the dialog by triggering the close event
        const dialogCloseEvent = new Event('dialogClose');
        document.dispatchEvent(dialogCloseEvent);
        
        // Call the callback to refresh posts
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        const error = await response.json()
        console.error('Failed to create post:', error)
        alert(`Failed to create post: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post. Please try again.')
    } finally {
      setIsCreatingPost(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="What's on your mind?"
          className="w-full min-h-[120px] p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          required
        />
        <div className="text-sm text-muted-foreground text-right">
          {content.length}/500 characters
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {/* Image upload can be added back later if needed */}
          {/* <input type="file" id="image-upload" accept="image/*" className="hidden" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Add Photo
          </Button> */}
        </div>
        <Button 
          type="submit" 
          disabled={!content.trim() || isCreatingPost || content.length > 500}
          className="flex items-center gap-2"
        >
          {isCreatingPost ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Post
            </>
          )}
        </Button>
      </div>
    </form>
  )
}