"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../context/authContext";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Code2, Users, Trophy, Zap } from "lucide-react"

export default function SignupPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithGithub } = useAuth()
  const router = useRouter()

  const handleGithubSignup = async () => {
    setIsLoading(true)
    setError("")
    try {
      await loginWithGithub()
      router.push("/")
    } catch (err) {
      setError("Failed to sign up with GitHub")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-brand-accent)] to-purple-600 p-12 flex-col justify-between text-white">
        <div>
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Code2 className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DevCircle</h1>
              <p className="text-sm text-white/80">Connect. Code. Collaborate.</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl font-bold leading-tight text-balance">
              Join thousands of developers building together
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Start your journey in a community where code meets collaboration. Share your projects, celebrate wins, and
              grow your skills.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-6 max-w-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Connect with Developers</h3>
              <p className="text-white/80 text-sm">
                Build your network with like-minded developers from around the world
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Share Achievements</h3>
              <p className="text-white/80 text-sm">Celebrate your wins and inspire others with your coding journey</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Grow Your Skills</h3>
              <p className="text-white/80 text-sm">Learn from the community and level up your development expertise</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[var(--color-brand-accent)] rounded-xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DevCircle</h1>
              <p className="text-sm text-muted-foreground">Connect. Code. Collaborate.</p>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center text-base">
                Sign up with your GitHub account to get started
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
                className="w-full h-12 text-base"
                onClick={handleGithubSignup}
                disabled={isLoading}
              >
                <Github className="mr-2 h-5 w-5" />
                {isLoading ? "Creating account..." : "Continue with GitHub"}
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
                Already have an account?{" "}
                <Link href="/login" className="text-[var(--color-brand-accent)] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
