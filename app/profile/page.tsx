"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/authContext";
import { Header } from "@/components/header"
import { PRChart } from "@/components/pr-chart"
import { Leaderboard } from "@/components/leaderboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockPRData, mockLeaderboard } from "@/lib/mock-data"
import { Github, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
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

  const totalPRs = mockPRData.reduce((sum, data) => sum + data.count, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio && <p className="text-sm text-muted-foreground text-center">{user.bio}</p>}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                {user.githubUsername && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.githubUsername}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {format(user.createdAt, "MMMM yyyy")}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total PRs</span>
                  <Badge variant="secondary" className="text-base font-semibold">
                    {totalPRs}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rank</span>
                  <Badge variant="secondary" className="text-base font-semibold">
                    #1
                  </Badge>
                </div>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Charts and Leaderboard */}
          <div className="md:col-span-2 space-y-6">
            <PRChart data={mockPRData} />
            <Leaderboard entries={mockLeaderboard} />
          </div>
        </div>
      </main>
    </div>
  )
}
