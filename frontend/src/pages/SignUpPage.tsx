

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useToast } from "../hooks/use-toast"
import { Leaf, Camera, Sparkles, Star, Heart } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.password_confirm) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await register(formData, profileImage || undefined)

      if (result.success) {
        toast({
          title: "Success",
          description: "Account created successfully! Welcome to EcoFinds.",
        })
        navigate("/")
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Please try again",
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
        <Heart className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
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
            <CardTitle className="text-3xl text-[#1B4332] font-bold">Join EcoFinds</CardTitle>
            <CardDescription className="text-[#2D5016]/70 text-lg">
              Create your account to start buying and selling sustainable products
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#1B4332] font-medium">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                />
              </div>

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

              {/* Profile Image */}
              <div className="space-y-2">
                <Label className="text-[#1B4332] font-medium">Profile Picture (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-2 ring-[#52B788]/20 shadow-lg">
                      <AvatarImage 
                        src={profileImage ? URL.createObjectURL(profileImage) : undefined} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20">
                        <Camera className="h-8 w-8 text-[#52B788]" />
                      </AvatarFallback>
                    </Avatar>
                    {profileImage && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                    />
                    <p className="text-xs text-[#2D5016]/60 mt-1">
                      Upload a profile picture to personalize your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[#1B4332] font-medium">First Name (Optional)</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[#1B4332] font-medium">Last Name (Optional)</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                  />
                </div>
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
                  placeholder="Create a secure password"
                  className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm" className="text-[#1B4332] font-medium">Confirm Password</Label>
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
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
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    Sign Up
                  </div>
                )}
              </Button>

              <p className="text-sm text-center text-[#2D5016]/70">
                Already have an account?{" "}
                <Link to="/login" className="text-[#52B788] hover:text-[#2D5016] font-medium hover:underline transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
