

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { apiClient, User } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { User as UserIcon, Package, ShoppingBag, TrendingUp, Edit, Save, X, Camera } from "lucide-react"
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={getFullImageUrl(user?.profile_image_url) || "/placeholder.svg"} alt={user?.username} />
            <AvatarFallback className="text-xl">{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={() => {
              console.log("Edit button clicked")
              navigate("/profile?edit=true")
            }}
            disabled={isEditing}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Profile Content - Direct Layout */}
      <div className="space-y-6">
        {/* Statistics Cards */}
        {dashboard && (
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{dashboard.statistics.total_listings}</p>
                    <p className="text-sm text-muted-foreground">Total Listings</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{dashboard.statistics.active_listings}</p>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{dashboard.statistics.sold_items}</p>
                    <p className="text-sm text-muted-foreground">Items Sold</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{dashboard.statistics.total_purchases}</p>
                    <p className="text-sm text-muted-foreground">Purchases</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Header with Avatar and Edit Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={profileImage ? URL.createObjectURL(profileImage) : getFullImageUrl(profile?.profile_image_url) || "/placeholder.svg"} 
                    alt={profile?.username} 
                  />
                  <AvatarFallback className="text-2xl">{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profile?.username}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={handleEditToggle}
                disabled={updateLoading}
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
                <Button onClick={handleUpdateProfile} disabled={updateLoading}>
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium text-muted-foreground">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Username cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium text-muted-foreground">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={editForm.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter your first name"
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={profile.first_name || "Not provided"}
                      disabled
                      className="mt-1"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editForm.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter your last name"
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={profile.last_name || "Not provided"}
                      disabled
                      className="mt-1"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={profile.phone || "Not provided"}
                      disabled
                      className="mt-1"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editForm.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your address"
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <Textarea
                      value={profile.address || "Not provided"}
                      disabled
                      className="mt-1"
                      rows={3}
                    />
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load profile information</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                asChild 
                variant="outline" 
                className="h-16 flex items-center justify-center gap-3"
              >
                <Link to="/my-products">
                  <Package className="h-5 w-5" />
                  My Listings
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="h-16 flex items-center justify-center gap-3"
              >
                <Link to="/purchase-history">
                  <ShoppingBag className="h-5 w-5" />
                  My Purchases
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
