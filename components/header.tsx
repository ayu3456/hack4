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
import { getAvatarSrc } from "@/lib/avatarUtils"
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
import { Home, User, LogOut, Search, Plus, MoreHorizontal, Send, Rocket } from "lucide-react"
import { AgentButton } from "./agent-button";

interface HeaderProps {
  onPostCreated?: () => void;
}

export function Header({ onPostCreated }: HeaderProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agentDialogOpen, setAgentDialogOpen] = useState(false)


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
                <Dialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-red-500 cursor-pointer">
                      <Rocket className="h-5 w-5" />
                      Run Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Reddit Agent
                      </DialogTitle>
                      <DialogDescription>
                        Test the n8n agent that posts achievements to Reddit groups
                      </DialogDescription>
                    </DialogHeader>
                    <AgentTestPanel onClose={() => setAgentDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
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
                        <AvatarImage src={getAvatarSrc(user.avatar, user.id)} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
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


// Simplified Agent Test Panel for the modal
function AgentTestPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const [isTriggering, setIsTriggering] = useState(false)
  const [message, setMessage] = useState("")

  const triggerAgent = async () => {
    if (!user) return

    setIsTriggering(true)
    setMessage("")
    try {
      console.log("agent runjnjnjdf")
      const response = await fetch('http://localhost:3001/api/agent/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          achievementType: 'demo_achievement', // For testing
          demo: true // Flag to bypass achievement check for testing
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage("✅ Agent started successfully! Your achievement will be posted to Reddit groups shortly.")
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage("❌ Failed to trigger agent. Please try again.")
      console.error('Error triggering agent:', error)
    } finally {
      setIsTriggering(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium mb-2">Demo Mode Active</h4>
        <p className="text-sm">
          For hackathon demonstration, achievement criteria are commented out.
          The agent will run immediately when you click the button below.
        </p>
      </div> */}

      {/* Commented out criteria for hackathon presentation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-600 mb-2">Achievement Criteria</h4>
        <div className="text-sm text-gray-500 space-y-1">
          {/* <p>🔒 Normally, these achievements would be required:</p> */}
          <p>• 10+ Low Impact PRs Merged</p>
          <p>• 1+ High Impact PR Merged</p>
          <p>• 5+ Medium Impact PRs Merged</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('❌')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
          {message}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          onClick={triggerAgent}
          disabled={isTriggering}
          className="flex-1 bg-red-500"
        >
          {isTriggering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running Agent...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2 cursor-pointer" />
              Run Agent Now
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <div className="text-xs text-muted-foreground border-t pt-3">
        <p className="font-medium">What happens when you run the agent:</p>
        <ul className="mt-1 space-y-1">
          <li>• Triggers n8n automation workflow</li>
          <li>• Posts your achievement to 5-10 relevant Reddit groups</li>
          <li>• Shares your GitHub success with the developer community</li>
          <li>• Increases your visibility and networking opportunities</li>
        </ul>
      </div>
    </div>
  )
}