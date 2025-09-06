

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../hooks/use-toast"
import { Leaf, Sparkles, Star } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        })
        navigate("/")
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Please check your credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
        <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
        <Leaf className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-60 right-[25%] w-5 h-5 text-[#2D5016]/25 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-white/20">
          <CardHeader className="text-center bg-gradient-to-r from-[#52B788]/10 to-[#B7E4C7]/10 border-b border-[#52B788]/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-[#1B4332] font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-[#2D5016]/70 text-lg">
              Sign in to your EcoFinds account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1B4332] font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1B4332] font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300 group" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    Sign In
                  </div>
                )}
              </Button>

              <p className="text-sm text-center text-[#2D5016]/70">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#52B788] hover:text-[#2D5016] font-medium hover:underline transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
