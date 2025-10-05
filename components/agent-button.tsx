"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/authContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, CheckCircle, Loader2 } from "lucide-react"

interface AgentStatus {
  canRun: boolean
  eligibleAchievements: Array<{
    type: string
    achievedAt: string
    metadata: any
  }>
}

export function AgentButton() {
  const { user, prData } = useAuth()
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      checkAgentEligibility()
    }
  }, [user, prData])

  const checkAgentEligibility = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/agent/can-run/${user.id}`)
      if (response.ok) {
        const status = await response.json()
        setAgentStatus(status)
      }
    } catch (error) {
      console.error('Error checking agent eligibility:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerAgent = async (achievementType: string) => {
    if (!user) return

    setIsTriggering(true)
    setMessage("")
    try {
      const response = await fetch('http://localhost:3001/api/agent/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          achievementType
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setMessage("✅ Agent started! Your achievement will be posted to Reddit groups shortly.")
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

  const getAchievementDisplayName = (type: string) => {
    switch (type) {
      case 'low_pr_10':
        return '10+ Low Impact PRs'
      case 'high_pr_1':
        return '1+ High Impact PR'
      case 'medium_pr_5':
        return '5+ Medium Impact PRs'
      default:
        return type
    }
  }

  const getAchievementDescription = (type: string) => {
    switch (type) {
      case 'low_pr_10':
        return 'Merged 10 or more low impact pull requests'
      case 'high_pr_1':
        return 'Merged 1 or more high impact pull requests'
      case 'medium_pr_5':
        return 'Merged 5 or more medium impact pull requests'
      default:
        return 'Achievement unlocked!'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Reddit Agent
          </CardTitle>
          <CardDescription>
            Checking your achievements...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Reddit Agent
        </CardTitle>
        <CardDescription>
          Automatically share your achievements on Reddit when you meet the criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('❌') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {agentStatus?.canRun ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>You're eligible to run the agent!</span>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Your Achievements:</h4>
              {agentStatus.eligibleAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {getAchievementDisplayName(achievement.type)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getAchievementDescription(achievement.type)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Achieved on {new Date(achievement.achievedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => triggerAgent(achievement.type)}
                    disabled={isTriggering}
                    className="flex items-center gap-2"
                  >
                    {isTriggering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Rocket className="h-4 w-4" />
                    )}
                    Run Agent
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <span>⚠️</span>
              <span>Not eligible yet. Achieve one of the following:</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2">
                <div>
                  <span className="font-medium">10+ Low Impact PRs</span>
                  <div className="text-sm text-muted-foreground">
                    Merge 10 low impact pull requests
                  </div>
                </div>
                <Badge variant={prData?.stats?.lowImpactPRs >= 10 ? "default" : "outline"}>
                  {prData?.stats?.lowImpactPRs || 0}/10
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-2">
                <div>
                  <span className="font-medium">1+ High Impact PR</span>
                  <div className="text-sm text-muted-foreground">
                    Merge 1 high impact pull request
                  </div>
                </div>
                <Badge variant={prData?.stats?.highImpactPRs >= 1 ? "default" : "outline"}>
                  {prData?.stats?.highImpactPRs || 0}/1
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground border-t pt-3">
              <p>Once you achieve any of these, the "Run Agent" button will become active.</p>
              <p className="mt-1">The agent will automatically post about your achievement to relevant Reddit communities.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}