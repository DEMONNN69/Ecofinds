

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Package, ShoppingBag, TrendingUp } from "lucide-react"

interface UserProfile {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  profile_image_url: string
  created_at: string
  updated_at: string
}

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

interface Purchase {
  id: number
  order_number: string
  items: Array<{
    product: {
      id: number
      title: string
      image_url: string
    }
    quantity: number
    price_at_purchase: number
  }>
  total_amount: number
  status: string
  created_at: string
  completed_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  const activeTab = searchParams.get("tab") || "dashboard"

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [profileResponse, dashboardResponse, purchasesResponse] = await Promise.all([
        apiClient.getUserProfile(),
        apiClient.getUserDashboard(),
        apiClient.getPurchaseHistory(),
      ])

      if (profileResponse.data) {
        setProfile(profileResponse.data)
      }

      if (dashboardResponse.data) {
        setDashboard(dashboardResponse.data)
      }

      if (purchasesResponse.data) {
        setPurchases(purchasesResponse.data.results || [])
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
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.profile_image_url || "/placeholder.svg"} alt={user?.username} />
          <AvatarFallback className="text-xl">{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {dashboard && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{dashboard.statistics.total_listings}</p>
                        <p className="text-sm text-muted-foreground">Total Listings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{dashboard.statistics.active_listings}</p>
                        <p className="text-sm text-muted-foreground">Active Listings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{dashboard.statistics.sold_items}</p>
                        <p className="text-sm text-muted-foreground">Items Sold</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{dashboard.statistics.total_purchases}</p>
                        <p className="text-sm text-muted-foreground">Purchases</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboard.recent_activity.length > 0 ? (
                    <div className="space-y-4">
                      {dashboard.recent_activity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-lg">{profile.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="text-lg">{profile.first_name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="text-lg">{profile.last_name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg">{profile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-lg">{profile.address || "Not provided"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Failed to load profile information</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold">Order #{purchase.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${purchase.total_amount}</p>
                          <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {purchase.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <img
                                src={item.product.image_url || "/placeholder.svg?height=48&width=48"}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.product.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.price_at_purchase}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No purchases yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Products</h2>
            <Button asChild>
              <Link to="/add-product">Add New Product</Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">View and manage your products from the My Products page</p>
                <Button asChild>
                  <Link to="/my-products">Go to My Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
