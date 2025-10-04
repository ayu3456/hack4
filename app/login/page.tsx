"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../context/authContext";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Code2, Users, Trophy, Zap } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, isAuthenticated, loading, checkAuth } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User is already authenticated, redirecting to home...')
      router.push('/')
    }
  }, [isAuthenticated, user, router])

  // Check for auth status when component loads
  useEffect(() => {
    // Check if we just came back from GitHub OAuth
    const checkAuthStatus = async () => {
      await checkAuth()
    }
    
    checkAuthStatus()
  }, [checkAuth])

  const githubLogin = () => {
    const clientId = 'Ov23lixXW1MPoaQTGGuS';
    const redirectUri = 'http://localhost:3001/auth/github/callback';
    const scope = 'user:email';
    
    console.log("🔵 Starting GitHub OAuth flow...");
    console.log("Redirect URI:", redirectUri);
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, show redirect message
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-gray-600">Redirecting you to the homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-indigo-700/90" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-lg" />
        
        <div className="relative z-10">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Code2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">DevConnect</h1>
              <p className="text-sm text-white/90">Connect. Code. Collaborate.</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-8 max-w-lg">
            <h2 className="text-6xl font-bold leading-tight text-balance">
              Where developers 
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"> connect</span> and grow together
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join a thriving community of developers sharing code, celebrating achievements, and building the future of
              tech.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-1 gap-6 max-w-lg">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Connect with Developers</h3>
              <p className="text-white/80 text-sm">
                Build your network with like-minded developers from around the world
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Share Achievements</h3>
              <p className="text-white/80 text-sm">Celebrate your wins and inspire others with your coding journey</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Grow Your Skills</h3>
              <p className="text-white/80 text-sm">Learn from the community and level up your development expertise</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DevConnect</h1>
              <p className="text-sm text-muted-foreground">Connect. Code. Collaborate.</p>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center text-base">
                Sign in with your GitHub account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <Button
                variant="default"
                className="w-full h-12 text-base cursor-pointer"
                onClick={githubLogin}
              >
                <Github className="mr-2 h-5 w-5" />
                Sign in with GitHub
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Secure authentication</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[var(--color-brand-accent)] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}