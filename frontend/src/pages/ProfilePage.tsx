

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { apiClient, User } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { User as UserIcon, Package, ShoppingBag, TrendingUp, Edit, Save, X, Camera, Leaf, Shield, Award } from "lucide-react"
import { getFullImageUrl } from "@/lib/imageUtils"

interface Dashboard {
  user_info: {
    id: number
    username: string
    email: string
    profile_image_url: string
  }
  statistics: {
    total_listings: number
    active_listings: number
    sold_items: number
    total_purchases: number
    cart_items_count: number
  }
  recent_activity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  const [profile, setProfile] = useState<User | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchData()
  }, [user, navigate])

  // Check for edit mode from URL parameter
  useEffect(() => {
    const editMode = searchParams.get("edit")
    console.log("Edit mode from URL:", editMode)
    if (editMode === "true") {
      console.log("Setting edit mode to true")
      setIsEditing(true)
    }
  }, [searchParams])

  const fetchData = async () => {
    try {
      const [profileResponse, dashboardResponse] = await Promise.all([
        apiClient.getUserProfile(),
        apiClient.getUserDashboard(),
      ])

      // API methods return response.data directly
      setProfile(profileResponse)
      setDashboard(dashboardResponse)
      
      // Initialize edit form with current profile data
      if (profileResponse) {
        setEditForm({
          first_name: profileResponse.first_name || "",
          last_name: profileResponse.last_name || "",
          phone: profileResponse.phone || "",
          address: profileResponse.address || "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to current profile data
      if (profile) {
        setEditForm({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          phone: profile.phone || "",
          address: profile.address || "",
        })
      }
      setProfileImage(null)
      // Clear edit mode from URL
      navigate("/profile")
    } else {
      // Enable edit mode
      navigate("/profile?edit=true")
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleUpdateProfile = async () => {
    setUpdateLoading(true)
    try {
      const updatedProfile = await apiClient.updateUserProfile(editForm, profileImage || undefined)
      setProfile(updatedProfile)
      
      // Refresh the user in AuthContext to update the header and other components
      await refreshUser()
      
      setIsEditing(false)
      setProfileImage(null)
      // Clear edit mode from URL
      navigate("/profile")
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-white to-[#FFF8DC]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#52B788]/30 border-t-[#52B788] mx-auto mb-6"></div>
              <p className="text-[#1B4332] text-lg font-medium">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-white to-[#FFF8DC] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#B7E4C7]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#52B788]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '-3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#8FBC8F]/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '-1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Profile Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-[#52B788]/20 to-[#2D5016]/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-8 border border-[#52B788]/30">
            <UserIcon className="w-5 h-5 text-[#52B788] mr-2" />
            <span className="text-[#1B4332] font-semibold">Profile Dashboard</span>
          </div>
          
          <div className="relative inline-block mb-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-[#52B788]/20 shadow-2xl">
                <AvatarImage src={getFullImageUrl(user?.profile_image_url) || "/placeholder.svg"} alt={user?.username} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-[#52B788] to-[#2D5016] text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#10B981] border-4 border-white rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B4332] mb-4">{user?.username}</h1>
          <p className="text-xl text-[#6B7280] mb-6">{user?.email}</p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate("/profile?edit=true")}
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-2xl"
              disabled={isEditing}
            >
              <Edit className="mr-2 h-5 w-5" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {dashboard && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#1B4332] text-center mb-8">
              Your <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">Impact</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border border-[#B7E4C7]/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-7 w-7 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#1B4332]">{dashboard.statistics.total_listings}</p>
                      <p className="text-[#6B7280] font-medium">Total Listings</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border border-[#B7E4C7]/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-7 w-7 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#1B4332]">{dashboard.statistics.active_listings}</p>
                      <p className="text-[#6B7280] font-medium">Active Listings</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border border-[#B7E4C7]/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Award className="h-7 w-7 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#1B4332]">{dashboard.statistics.sold_items}</p>
                      <p className="text-[#6B7280] font-medium">Items Sold</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border border-[#B7E4C7]/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="h-7 w-7 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#1B4332]">{dashboard.statistics.total_purchases}</p>
                      <p className="text-[#6B7280] font-medium">Purchases</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header with Avatar and Edit Button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#B7E4C7]/20 mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1B4332] flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#52B788]" />
                Profile Management
              </h2>
              <div className="flex gap-3">
                <Button 
                  variant={isEditing ? "outline" : "default"} 
                  onClick={handleEditToggle}
                  disabled={updateLoading}
                  className={isEditing ? 
                    "border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-all duration-300" :
                    "bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white hover:shadow-xl transition-all duration-300"
                  }
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={updateLoading}
                    className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white hover:shadow-xl transition-all duration-300"
                  >
                    {updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-[#52B788]/20 shadow-lg">
                  <AvatarImage 
                    src={profileImage ? URL.createObjectURL(profileImage) : getFullImageUrl(profile?.profile_image_url) || "/placeholder.svg"} 
                    alt={profile?.username} 
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#52B788] to-[#2D5016] text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer backdrop-blur-sm transition-all duration-300 hover:bg-black/70">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-3 border-white rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1B4332] mb-1">{profile?.username}</h3>
                <p className="text-[#6B7280] mb-3">{profile?.email}</p>
                <div className="flex items-center gap-2">
                  <div className="bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20 px-3 py-1 rounded-full text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Verified Member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#B7E4C7]/20 mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-[#52B788]" />
              Profile Information
            </h3>
            {profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="username" className="text-sm font-semibold text-[#1B4332] mb-2 block">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      disabled
                      className="bg-[#F8FDF8] border-[#B7E4C7]/30 text-[#1B4332] cursor-not-allowed"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">Username cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-[#1B4332] mb-2 block">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-[#F8FDF8] border-[#B7E4C7]/30 text-[#1B4332] cursor-not-allowed"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="first_name" className="text-sm font-semibold text-[#1B4332] mb-2 block">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="first_name"
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        placeholder="Enter your first name"
                        className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20"
                      />
                    ) : (
                      <Input
                        value={profile.first_name || "Not provided"}
                        disabled
                        className="bg-white border-[#B7E4C7]/30 text-[#1B4332]"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="last_name" className="text-sm font-semibold text-[#1B4332] mb-2 block">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="last_name"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        placeholder="Enter your last name"
                        className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20"
                      />
                    ) : (
                      <Input
                        value={profile.last_name || "Not provided"}
                        disabled
                        className="bg-white border-[#B7E4C7]/30 text-[#1B4332]"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-[#1B4332] mb-2 block">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20"
                      />
                    ) : (
                      <Input
                        value={profile.phone || "Not provided"}
                        disabled
                        className="bg-white border-[#B7E4C7]/30 text-[#1B4332]"
                      />
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-[#1B4332] mb-2 block">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editForm.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your address"
                      className="border-[#52B788]/30 focus:border-[#52B788] focus:ring-[#52B788]/20"
                      rows={3}
                    />
                  ) : (
                    <Textarea
                      value={profile.address || "Not provided"}
                      disabled
                      className="bg-white border-[#B7E4C7]/30 text-[#1B4332]"
                      rows={3}
                    />
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[#6B7280]">Failed to load profile information</p>
            )}
          </div>
        </div>

        {/* Quick Actions Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#B7E4C7]/20">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-[#1B4332] mb-6 text-center">
              Quick <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">Actions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/my-products" className="group">
                <div className="bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 border border-[#B7E4C7]/30 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#52B788]/10 group-hover:to-[#2D5016]/10">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-8 w-8 text-[#52B788]" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-[#1B4332] group-hover:text-[#52B788] transition-colors duration-300">
                        My Listings
                      </h4>
                      <p className="text-[#6B7280] mt-1">Manage your products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/purchase-history" className="group">
                <div className="bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 border border-[#B7E4C7]/30 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#52B788]/10 group-hover:to-[#2D5016]/10">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="h-8 w-8 text-[#52B788]" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-[#1B4332] group-hover:text-[#52B788] transition-colors duration-300">
                        My Purchases
                      </h4>
                      <p className="text-[#6B7280] mt-1">View order history</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
