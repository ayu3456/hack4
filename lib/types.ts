export interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: string
  bio?: string
  githubUsername?: string
  createdAt: Date
}

export interface Post {
  id: string
  userId: string
  content: string
  image?: string
  createdAt: Date
  likes: number
  comments: number
}

export interface Achievement {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  earnedAt: Date
  isSystemGenerated: boolean
}

export interface PRData {
  date: string
  count: number
}

export interface LeaderboardEntry {
  userId: string
  username: string
  name: string
  avatar?: string
  prs: number
  rank: number
}
