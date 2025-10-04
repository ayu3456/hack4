import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { LeaderboardEntry } from "@/lib/types"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top contributors this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank) || (
                  <span className="text-sm font-semibold text-muted-foreground">#{entry.rank}</span>
                )}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{entry.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{entry.username}</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {entry.prs} PRs
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
