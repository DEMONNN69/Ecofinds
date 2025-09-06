

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiClient, Product, Category } from "../lib/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Search, Grid, List, Leaf, Heart, DollarSign } from "lucide-react"
import { getProductImageUrl } from "../lib/imageUtils"
import { useToast } from "../hooks/use-toast"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
      ])

      setProducts(productsResponse.results || [])
      setCategories(categoriesResponse || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData()
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.searchProducts({
        q: searchQuery,
        category: selectedCategory,
      })

      setProducts(response.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterByCategory = async (categorySlug: string) => {
    try {
      setLoading(true)
      setSelectedCategory(categorySlug)

      const response = await apiClient.getProducts({
        category: categorySlug || undefined,
      })

      setProducts(response.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to filter products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-white to-[#FFF8DC]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#52B788]/30 border-t-[#52B788] mx-auto mb-6"></div>
              <p className="text-[#1B4332] text-lg font-medium">Loading eco-friendly products...</p>
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#B7E4C7]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#52B788]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '-3s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#8FBC8F]/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '-1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16 pt-8">
          <div className="inline-flex items-center bg-gradient-to-r from-[#52B788]/20 to-[#2D5016]/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-8 border border-[#52B788]/30">
            <Leaf className="w-5 h-5 text-[#52B788] mr-2" />
            <span className="text-[#1B4332] font-semibold">🌱 EcoFinds - Sustainable Second-Hand Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1B4332] mb-6 leading-tight">
            Discover 
            <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent"> Sustainable</span>
            <br />Products
          </h1>
          <p className="text-xl md:text-2xl text-[#6B7280] mb-12 max-w-3xl mx-auto leading-relaxed">
            Find eco-friendly products from trusted sellers in our sustainable marketplace. 
            Extend product lifecycles and make conscious choices that reduce waste.
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-[#B7E4C7]/30">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-[#6B7280]" />
                  </div>
                  <Input
                    placeholder="Search for eco-friendly products, brands, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-16 pr-6 py-6 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#52B788]/30 bg-white shadow-lg text-lg placeholder-[#6B7280]/60 border-none"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="px-8 py-6 bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg border-none"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-[#6B7280]/80 text-sm mb-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#52B788] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              Trusted Community
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#52B788]" />
              Reduce Waste
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#52B788]" />
              Great Deals
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4332] mb-6">
              Browse <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Find amazing pre-owned items across all your favorite categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => filterByCategory("")}
              className={`h-auto p-6 flex flex-col items-center gap-3 rounded-3xl transition-all duration-500 border ${
                selectedCategory === "" 
                  ? "bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white border-[#52B788] shadow-xl hover:shadow-2xl" 
                  : "bg-white/80 backdrop-blur-sm border-[#B7E4C7]/30 text-[#1B4332] hover:bg-[#52B788] hover:text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <span className="text-3xl">🌍</span>
              <span className="text-sm font-semibold">All</span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => filterByCategory(category.slug)}
                className={`h-auto p-6 flex flex-col items-center gap-3 rounded-3xl transition-all duration-500 border ${
                  selectedCategory === category.slug 
                    ? "bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white border-[#52B788] shadow-xl hover:shadow-2xl" 
                    : "bg-white/80 backdrop-blur-sm border-[#B7E4C7]/30 text-[#1B4332] hover:bg-[#52B788] hover:text-white shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                <span className="text-3xl">{category.icon || "📦"}</span>
                <span className="text-sm font-semibold">{category.name}</span>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-[#B7E4C7]/50 text-[#1B4332] border border-[#52B788]/20"
                >
                  {category.product_count}
                </Badge>
              </Button>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 bg-gradient-to-b from-[#F8FDF8]/50 to-white/80 rounded-3xl backdrop-blur-sm border border-[#B7E4C7]/20 shadow-2xl">
          <div className="px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332]">
                {selectedCategory ? (
                  <>
                    Products in <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">{selectedCategory}</span>
                  </>
                ) : (
                  <>
                    Featured <span className="bg-gradient-to-r from-[#52B788] to-[#2D5016] bg-clip-text text-transparent">Listings</span>
                  </>
                )}
              </h2>

              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-xl transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white shadow-lg" 
                      : "bg-white/80 border-[#B7E4C7] text-[#1B4332] hover:bg-[#52B788] hover:text-white"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`rounded-xl transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white shadow-lg" 
                      : "bg-white/80 border-[#B7E4C7] text-[#1B4332] hover:bg-[#52B788] hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-[#52B788]/20 to-[#2D5016]/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-12 h-12 text-[#52B788]" />
                </div>
                <p className="text-[#1B4332] text-xl font-semibold mb-2">No products found</p>
                <p className="text-[#6B7280]">Try adjusting your search or filters to discover amazing eco-friendly finds</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                    : "space-y-6"
                }
              >
                {products.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <div className="group relative">
                      {/* Background glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#52B788]/20 to-[#2D5016]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                      
                      <Card className="relative cursor-pointer bg-white border border-[#E5E7EB]/50 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(82,183,136,0.15)] transition-all duration-700 group-hover:-translate-y-2">
                        <CardContent className="p-0">
                          {/* Image Container with Overlay */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={getProductImageUrl(product.image_url, "400x300")}
                              alt={product.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                            
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            
                            {/* Condition Badge - Top Left */}
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/95 backdrop-blur-sm text-[#1B4332] border border-[#E5E7EB]/30 px-2.5 py-1 text-xs font-medium rounded-lg shadow-sm">
                                {product.condition}
                              </Badge>
                            </div>

                            {/* Price Badge - Top Right */}
                            <div className="absolute top-3 right-3">
                              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-[#E5E7EB]/30">
                                <span className="text-lg font-bold text-[#1B4332]">
                                  ${product.price}
                                </span>
                              </div>
                            </div>

                            {/* Sold Overlay */}
                            {product.is_sold && (
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                                <div className="bg-white rounded-xl px-6 py-3 shadow-xl">
                                  <span className="text-[#1B4332] font-bold text-lg">SOLD OUT</span>
                                </div>
                              </div>
                            )}

                            {/* Hover Action Button */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                              <div className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-5">
                            {/* Title */}
                            <h3 className="font-semibold text-lg text-[#1B4332] mb-2 line-clamp-2 group-hover:text-[#52B788] transition-colors duration-300 leading-tight">
                              {product.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[#6B7280] text-sm mb-4 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between">
                              {/* Seller Info */}
                              <div className="flex items-center gap-2.5">
                                <div className="relative">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white text-xs font-semibold">
                                      {(product.seller?.username || 'U')[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-[#1B4332]">
                                    {product.seller?.username || 'Unknown Seller'}
                                  </span>
                                  {product.location && (
                                    <span className="text-xs text-[#6B7280]">{product.location}</span>
                                  )}
                                </div>
                              </div>

                              {/* View Count (if available) */}
                              <div className="text-xs text-[#6B7280] flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{product.view_count || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Subtle bottom border accent */}
                          <div className="h-1 bg-gradient-to-r from-[#52B788] to-[#2D5016] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        </CardContent>
                      </Card>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
