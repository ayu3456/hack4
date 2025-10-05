// components/leaderboard.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, TrendingUp, Users, Crown, Medal, RefreshCw } from "lucide-react"
import { useAuth } from "../context/authContext"

interface LeaderboardProps {
  showCurrentUserHighlight?: boolean
}

export function Leaderboard({ showCurrentUserHighlight = true }: LeaderboardProps) {
  const { leaderboard, leaderboardLoading, user, fetchLeaderboard } = useAuth()

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200'
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      case 2: return <Medal className="h-4 w-4 fill-gray-500 text-gray-500" />
      case 3: return <Medal className="h-4 w-4 fill-orange-500 text-orange-500" />
      default: return <TrendingUp className="h-4 w-4" />
    }
  }

  const isCurrentUser = (entryUsername: string) => {
    return user && user.username === entryUsername
  }

  if (leaderboardLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Developer Leaderboard
          </CardTitle>
          <CardDescription>
            Loading leaderboard data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Developer Leaderboard
          </div>
          <button 
            onClick={fetchLeaderboard}
            className="text-sm text-blue-600 hover:text-blue-800 font-normal flex items-center gap-1"
            disabled={leaderboardLoading}
          >
            {leaderboardLoading ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Refresh
          </button>
        </CardTitle>
        <CardDescription>
          Top contributors based on merged PRs and impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.slice(0, 10).map((entry: any) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                isCurrentUser(entry.username) && showCurrentUserHighlight
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                  : 'hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getRankColor(entry.rank)}`}>
                  <span className="text-sm font-bold">
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {entry.avatar ? (
                      <img 
                        src={entry.avatar} 
                        alt={entry.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {entry.name}
                        {isCurrentUser(entry.username) && showCurrentUserHighlight && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      @{entry.username}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm flex items-center gap-1 justify-end">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {entry.highImpactPRs}
                  </p>
                  <p className="text-xs text-muted-foreground">High Impact</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No leaderboard data available</p>
            <p className="text-sm mt-1">Users will appear here once they connect their GitHub</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {leaderboard.length > 10 && (
          <div className="text-center pt-4 border-t mt-4">
            <p className="text-sm text-muted-foreground">
              Showing top 10 of {leaderboard.length} developers
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}