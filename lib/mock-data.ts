import type { Post, Achievement, PRData, LeaderboardEntry } from "./types"

export const mockPosts = [
  {
    id: "1",
    userId: "user1",
    content: "Just deployed my latest React project! 🚀 So excited to see it live and get feedback from the community.",
    createdAt: "2024-01-15T10:30:00Z",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: "2", 
    userId: "user2",
    content: "Working on a new open source contribution. The TypeScript migration is going smoothly! 💻",
    createdAt: "2024-01-14T15:45:00Z",
    likes: 18,
    comments: 5,
    shares: 2,
  },
  {
    id: "3",
    userId: "user3",
    content: "Just learned about React Server Components and I'm blown away by the performance improvements!",
    createdAt: "2024-01-13T09:20:00Z",
    likes: 32,
    comments: 12,
    shares: 6,
  }
]


export const mockAchievements: Achievement[] = [
  {
    id: "1",
    userId: "1",
    title: "1 High Impact PR Merged",
    description: "Successfully merged your high impact pull request",
    icon: "🎉",
    earnedAt: new Date("2025-10-5"),
    isSystemGenerated: true,
  },
  {
    id: "2",
    userId: "1",
    title: "10 Low Impact PR Merged",
    description: "Merged 10 pull requests",
    icon: "⭐",
    earnedAt: new Date("2025-10-2"),
    isSystemGenerated: true,
  },
  {
    id: "3",
    userId: "1",
    title: "Code Contributor",
    description: "Contributed to 5 different repositories",
    icon: "💻",
    earnedAt: new Date("2025-10-01"),
    isSystemGenerated: true,
  },
  {
    id: "4",
    userId: "1",
    title: "Community Helper",
    description: "Helped 10 developers with code reviews",
    icon: "🤝",
    earnedAt: new Date("2025-10-10"),
    isSystemGenerated: true,
  },
  {
    id: "5",
    userId: "2",
    title: "100 Commits Milestone",
    description: "Reached 100 commits across all repositories",
    icon: "🔥",
    earnedAt: new Date("2025-10-08"),
    isSystemGenerated: true,
  },
  {
    id: "6",
    userId: "3",
    title: "Bug Hunter",
    description: "Fixed 20 critical bugs",
    icon: "🐛",
    earnedAt: new Date("2024-03-05"),
    isSystemGenerated: true,
  },
]

export const mockPRData: PRData[] = [
  { date: "2024-01", count: 3 },
  { date: "2024-02", count: 5 },
  { date: "2024-03", count: 8 },
  { date: "2024-04", count: 6 },
  { date: "2024-05", count: 10 },
  { date: "2024-06", count: 12 },
  { date: "2024-07", count: 9 },
  { date: "2024-08", count: 15 },
  { date: "2024-09", count: 11 },
  { date: "2024-10", count: 14 },
  { date: "2024-11", count: 13 },
  { date: "2024-12", count: 16 },
]

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "1",
    username: "demo_user",
    name: "Demo User",
    avatar: "/developer-avatar.png",
    prs: 122,
    rank: 1,
  },
  {
    userId: "2",
    username: "sarah_dev",
    name: "Sarah Johnson",
    avatar: "/female-developer-avatar.png",
    prs: 108,
    rank: 2,
  },
  {
    userId: "3",
    username: "mike_codes",
    name: "Mike Chen",
    avatar: "/male-developer-avatar.png",
    prs: 95,
    rank: 3,
  },
  {
    userId: "4",
    username: "alex_tech",
    name: "Alex Rodriguez",
    avatar: "/developer-profile.png",
    prs: 87,
    rank: 4,
  },
  {
    userId: "5",
    username: "emma_builds",
    name: "Emma Wilson",
    avatar: "/female-coder-avatar.jpg",
    prs: 76,
    rank: 5,
  },
]
