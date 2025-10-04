"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loginWithGithub: () => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    username: "demo_user",
    name: "Demo User",
    avatar: "/developer-avatar.png",
    bio: "Full-stack developer passionate about open source",
    githubUsername: "demouser",
    createdAt: new Date("2024-01-01"),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const loginWithGithub = async () => {
    // Mock GitHub OAuth - in real app, this would redirect to GitHub
    const githubUser: User = {
      id: Date.now().toString(),
      email: "github@example.com",
      username: "github_user",
      name: "GitHub User",
      avatar: "/github-developer.jpg",
      githubUsername: "githubuser",
      createdAt: new Date(),
    }
    setUser(githubUser)
    localStorage.setItem("currentUser", JSON.stringify(githubUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, loginWithGithub, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
