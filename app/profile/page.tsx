"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/authContext"
import { Header } from "@/components/header"
import { PRChart } from "@/components/pr-chart"
import { Leaderboard } from "@/components/leaderboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Calendar, Star, TrendingUp, Users, Zap, Trophy, RefreshCw } from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
  const {
    user,
    prData,
    leaderboard,
    prLoading,
    leaderboardLoading,
    fetchPRData,
    fetchLeaderboard,
    refreshUserData,
    isLoading
  } = useAuth()
  const router = useRouter()
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Stable auto-fetch data function
  const fetchInitialData = useCallback(async () => {
    if (user && !hasFetchedInitialData) {
      setHasFetchedInitialData(true)

      if (!prData && !prLoading) {
        await fetchPRData()
      }
      if (leaderboard.length === 0 && !leaderboardLoading) {
        await fetchLeaderboard()
      }
    }
  }, [user, prData, prLoading, leaderboard.length, leaderboardLoading, hasFetchedInitialData, fetchPRData, fetchLeaderboard])

  // Auto-fetch data only once when user loads
  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  // Prepare real data for charts
  const getPRChartData = (): any => {
    if (!prData?.prs) return []

    const monthlyData: Record<string, number> = {}
    prData.prs.forEach((pr: any) => {
      const month = format(new Date(pr.mergedAt), 'MMM yyyy')
      if (!monthlyData[month]) {
        monthlyData[month] = 0
      }
      monthlyData[month]++
    })

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .slice(-6)
  }

  const getImpactDistribution = (): any => {
    if (!prData?.stats) return []

    return [
      { impact: 'High', count: prData.stats.highImpactPRs, color: '#8b5cf6' },
      { impact: 'Medium', count: prData.stats.mediumImpactPRs, color: '#3b82f6' },
      { impact: 'Low', count: prData.stats.lowImpactPRs, color: '#6b7280' }
    ]
  }

  const prChartData = getPRChartData()
  const impactData = getImpactDistribution()
  const totalPRs = prData?.stats?.totalMergedPRs || 0

  // Find current user's rank
  const currentUserRank = leaderboard.find((entry: any) =>
    user && entry.username === user.username
  )?.rank || 0

  // Calculate user score
  const userScore = prData?.stats ?
    (prData.stats.highImpactPRs * 10 + prData.stats.mediumImpactPRs * 5 + prData.stats.lowImpactPRs * 2) : 0

  // Refresh all data function with loading states
  const handleRefreshAll = async () => {
    setHasFetchedInitialData(false)
    await Promise.all([fetchPRData(), fetchLeaderboard()])
  }

  const handleRefreshPRs = async () => {
    await fetchPRData()
  }

  const handleRefreshLeaderboard = async () => {
    await fetchLeaderboard()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Profile Card - 1 column */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
                {currentUserRank > 0 && (
                  <Badge variant="default" className="w-fit mx-auto">
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{currentUserRank}
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge variant="secondary" className="w-fit mx-auto">
                    ✅ Verified
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.username}</span>
                  </div>
                  {user.createdAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                {/* PR Stats */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {prData?.stats?.highImpactPRs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">High Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {prData?.stats?.mediumImpactPRs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Medium Impact</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Merged PRs</span>
                    <Badge variant="secondary" className="text-base font-semibold">
                      {totalPRs}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">GitHub Score</span>
                    <Badge variant="secondary" className="text-base font-semibold">
                      {userScore}
                    </Badge>
                  </div>
                </div>

                {/* Refresh Buttons - FIXED */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={handleRefreshAll}
                    disabled={prLoading || leaderboardLoading}
                    variant="default"
                  >
                    {(prLoading || leaderboardLoading) ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Refreshing All Data...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh All Data
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={handleRefreshPRs}
                      disabled={prLoading}
                      size="sm"
                    >
                      {prLoading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        'PRs Only'
                      )}
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={handleRefreshLeaderboard}
                      disabled={leaderboardLoading}
                      size="sm"
                    >
                      {leaderboardLoading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        'Rank Only'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Distribution */}
            {impactData.some((item: any) => item.count > 0) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Impact Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of your PRs by impact level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {impactData.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.impact} Impact</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.count}</span>
                          <span className="text-muted-foreground text-sm">
                            ({Math.round((item.count / totalPRs) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalPRs}</p>
                      <p className="text-sm text-muted-foreground">Total PRs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {prData?.stats?.highImpactPRs || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">High Impact</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userScore}</p>
                      <p className="text-sm text-muted-foreground">GitHub Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PR Chart and Leaderboard in 2 columns */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* PR Chart */}
              <div className="lg:col-span-1">
                {prChartData.length > 0 ? (
                  <PRChart data={prChartData} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>PR Activity</CardTitle>
                      <CardDescription>
                        {prData ? 'No PR data available for chart' : 'Fetch PR data to see your activity chart'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No PR data to display</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={handleRefreshPRs}
                          disabled={prLoading}
                        >
                          {prLoading ? 'Fetching...' : 'Fetch PR Data'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-1">
                {leaderboardLoading ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Leaderboard</CardTitle>
                      <CardDescription>Loading leaderboard...</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading leaderboard...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : leaderboard && leaderboard.length > 0 ? (
                  <Leaderboard showCurrentUserHighlight={true} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Leaderboard</CardTitle>
                      <CardDescription>
                        {leaderboard ? 'No leaderboard data available' : 'Fetch leaderboard data to see rankings'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No leaderboard data to display</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={fetchLeaderboard}
                          disabled={leaderboardLoading}
                        >
                          {leaderboardLoading ? 'Fetching...' : 'Fetch Leaderboard'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Recent PRs - Full width */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Merged PRs</CardTitle>
                <CardDescription>
                  Your recently merged pull requests on GitHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading PR data...</p>
                  </div>
                ) : prData?.prs && prData.prs.length > 0 ? (
                  <div className="space-y-4">
                    {prData.prs.slice(0, 5).map((pr: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <a
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-blue-600 truncate block"
                          >
                            {pr.title}
                          </a>
                          <p className="text-sm text-muted-foreground truncate">
                            {pr.repo}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>⭐ {pr.stars} stars</span>
                            <span>
                              {format(new Date(pr.mergedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`ml-4 ${pr.impact === 'high'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : pr.impact === 'medium'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                          {pr.impact}
                        </Badge>
                      </div>
                    ))}
                    {prData.prs.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" size="sm">
                          View All {prData.prs.length} PRs
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No merged PRs found</p>
                    <p className="text-sm mt-1">
                      {prData
                        ? "You haven't merged any PRs yet, or they might be in private repositories"
                        : "Fetch PR data to see your merged pull requests"
                      }
                    </p>
                    {!prData && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleRefreshPRs}
                      >
                        Fetch PR Data
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}