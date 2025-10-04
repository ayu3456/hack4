"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { AchievementCard } from "@/components/achievement-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPosts, mockAchievements, mockLeaderboard } from "@/lib/mock-data"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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

  const getUserData = (userId: string) => {
    const userData = mockLeaderboard.find((u) => u.userId === userId)
    return userData || { username: "user", name: "User", avatar: "/placeholder.svg" }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-6 mx-auto flex flex-col items-center">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-0 space-y-4">
            {mockPosts.map((post) => {
              const userData = getUserData(post.userId)
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  userName={userData.name}
                  userAvatar={userData.avatar}
                  username={userData.username}
                />
              )
            })}
          </TabsContent>
          <TabsContent value="achievements" className="mt-0 space-y-4">
            {mockAchievements.map((achievement) => {
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
      </main>
    </div>
  )
}
