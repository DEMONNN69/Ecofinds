

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiClient, Product } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useToast } from "../hooks/use-toast"
import { getProductImageUrl } from "../lib/imageUtils"
import { Plus, Edit, Trash2, Eye, Leaf, Package, TrendingUp, Calendar, Star, Sparkles, ShoppingBag } from "lucide-react"

export default function MyProductsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchMyProducts()
  }, [user, navigate])

  const fetchMyProducts = async () => {
    try {
      const response = await apiClient.getMyListings()
      setProducts(response.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await apiClient.deleteProduct(productId)
      toast({
        title: "Deleted",
        description: "Product deleted successfully",
      })
      // Remove from local state
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
          <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
          <Package className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Package className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <div className="w-48 h-4 bg-[#52B788]/20 rounded-full mx-auto animate-pulse"></div>
                <div className="w-32 h-3 bg-[#52B788]/10 rounded-full mx-auto animate-pulse"></div>
              </div>
              <p className="text-[#2D5016]/70 mt-4 text-lg">Loading your products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
        <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
        <Package className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-60 right-[25%] w-5 h-5 text-[#2D5016]/25 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-[#1B4332]">My Products</h1>
              </div>
              <p className="text-[#2D5016]/70 text-lg">
                Manage your sustainable marketplace listings
              </p>
            </div>
            <Button 
              asChild
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link to="/add-product">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#2D5016]/60 text-sm font-medium">Total Products</p>
                      <p className="text-2xl font-bold text-[#1B4332]">{products.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#52B788]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#2D5016]/60 text-sm font-medium">Total Views</p>
                      <p className="text-2xl font-bold text-[#1B4332]">
                        {products.reduce((sum, product) => sum + (product.view_count || 0), 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#52B788]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#2D5016]/60 text-sm font-medium">Active Listings</p>
                      <p className="text-2xl font-bold text-[#1B4332]">
                        {products.filter(p => !p.is_sold).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#52B788]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#52B788]/20 to-[#2D5016]/20 rounded-full flex items-center justify-center mx-auto mb-8 group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center">
                  <Plus className="h-10 w-10 text-white group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </div>
              {/* Floating sparkles around empty state */}
              <Sparkles className="absolute top-4 left-1/2 transform -translate-x-8 w-6 h-6 text-[#52B788]/40 animate-pulse" />
              <Sparkles className="absolute top-12 right-1/2 transform translate-x-8 w-4 h-4 text-[#2D5016]/40 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <h2 className="text-3xl font-bold text-[#1B4332] mb-3">No products yet</h2>
            <p className="text-[#2D5016]/70 text-lg mb-8 max-w-md mx-auto">
              Start your sustainable selling journey by adding your first product to our marketplace
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] hover:from-[#2D5016] hover:to-[#52B788] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-3"
            >
              <Link to="/add-product">
                <Sparkles className="mr-2 h-5 w-5" />
                Add Your First Product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-white/20 hover:shadow-xl hover:ring-white/30 transition-all duration-300 group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={getProductImageUrl(product.image_url, "300x300")}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.is_sold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Badge variant="secondary" className="text-lg px-6 py-3 bg-white/90 text-[#1B4332] font-semibold">
                        SOLD
                      </Badge>
                    </div>
                  )}
                  {/* Eco badge for active products */}
                  {!product.is_sold && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Leaf className="w-3 h-3" />
                        Active
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-[#1B4332] group-hover:text-[#52B788] transition-colors duration-300">
                    {product.title}
                  </h3>

                  <p className="text-[#2D5016]/60 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="border-[#52B788]/30 text-[#2D5016] bg-[#52B788]/5"
                    >
                      {product.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#2D5016]/60 mb-4 bg-[#52B788]/5 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-[#52B788]" />
                      <span className="font-medium">{product.view_count || 0}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#52B788]" />
                      <span>{new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="flex-1 border-[#52B788]/30 text-[#2D5016] hover:bg-[#52B788]/10 hover:border-[#52B788] transition-all duration-300"
                    >
                      <Link to={`/products/${product.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-[#52B788]/30 text-[#2D5016] hover:bg-[#52B788]/10 hover:border-[#52B788] transition-all duration-300"
                      asChild
                    >
                      <Link to={`/edit-product/${product.id}`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
