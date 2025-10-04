"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext";
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { AchievementCard } from "@/components/achievement-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPosts, mockAchievements, mockLeaderboard } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
export default function HomePage() {
  const { user, isLoading } = useAuth()
  console.log(user, "adfs");
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
const githubLogin = () => {
    const clientId = 'Ov23lixXW1MPoaQTGGuS';
    // This should point to your backend route
    const redirectUri = 'http://localhost:3001/auth/github/callback';
    const scope = 'user:email';
    console.log(":large_blue_circle: Starting GitHub OAuth flow...");
    console.log("Redirect URI:", redirectUri);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
};
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Button onClick={githubLogin}>
        Github auth api
      </Button>
      <main className="container max-w-2xl py-6">
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