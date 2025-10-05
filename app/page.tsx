"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext"
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { AchievementCard } from "@/components/achievement-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Rocket } from "lucide-react"
import { mockPosts, mockAchievements, mockLeaderboard } from "@/lib/mock-data"

// Use the same Post interface that PostCard expects
interface Post {
  id: string
  userId: string
  content: string
  createdAt: Date
  likes: number
  comments: number
  shares: number
  user?: {
    name: string
    avatar: string
    username: string
  }
}

interface UserData {
  username: string
  name: string
  avatar: string
  id: string
}

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [agentDialogOpen, setAgentDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch posts when component mounts
  useEffect(() => {
    if (user) {
      fetchAllPosts()
    }
  }, [user])

  const fetchAllPosts = async () => {
    try {
      setIsLoadingPosts(true)
      const response = await fetch('http://localhost:3001/api/posts')
      
      if (response.ok) {
        const data = await response.json()
        const userPosts = data.posts || []
        
        // Transform API posts to match the expected Post interface
        const transformedUserPosts = userPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.timestamp || post.createdAt)
        }))

        // Transform mock posts to match the expected Post interface
        const transformedMockPosts = mockPosts.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
        
        // Combine mock posts with user posts from API
        const allPosts = [...transformedMockPosts, ...transformedUserPosts]
        
        // Remove duplicates based on post ID and sort by createdAt
        const uniquePosts = allPosts.filter((post, index, self) => 
          index === self.findIndex(p => p.id === post.id)
        )
        
        const sortedPosts = uniquePosts.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        )
        
        setPosts(sortedPosts)
      } else {
        console.error('Failed to fetch posts')
        // Fallback to just mock posts if API fails
        const transformedMockPosts = mockPosts.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
        setPosts(transformedMockPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Fallback to mock posts
      const transformedMockPosts = mockPosts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }))
      setPosts(transformedMockPosts)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const getUserData = (userId: string, post?: Post): UserData => {
    // If post has user data from API, use that
    if (post?.user) {
      return {
        username: post.user.username || "user",
        name: post.user.name || "User",
        avatar: post.user.avatar || "/placeholder.svg",
        id: userId
      }
    }
    
    // Otherwise, try to find in mock data
    const userData = (mockLeaderboard as any).find((u: any) => u.userId === userId)
    if (userData) {
      return {
        username: userData.username,
        name: userData.name,
        avatar: userData.avatar,
        id: userData.userId
      }
    }
    
    // Fallback
    return { 
      username: "user", 
      name: "User", 
      avatar: "/placeholder.svg",
      id: userId
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onPostCreated={fetchAllPosts} />

      <main className="flex justify-center py-6">
        <div className="w-full max-w-2xl">

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0 space-y-4">
              {isLoadingPosts ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading posts...</p>
                  </CardContent>
                </Card>
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const userData = getUserData(post.userId, post)
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      userName={userData.name}
                      userAvatar={userData.avatar}
                      username={userData.username}
                    />
                  )
                })
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 space-y-4">
              {mockAchievements.map((achievement: any) => {
                const userData = getUserData(achievement.userId)
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    userName={userData.name}
                    userAvatar={userData.avatar}
                    username={userData.username}
                  />
                )
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

