

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient, Product } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useToast } from "../hooks/use-toast"
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight, Eye, Calendar, MapPin, Package, Shield, Leaf } from "lucide-react"
import { getFullImageUrl } from "../lib/imageUtils"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const productData = await apiClient.getProduct(Number(id))
      setProduct(productData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Image slider functions
  const getAllImages = () => {
    if (!product) return []
    
    // Add main image from images array or fallback
    if (product.images && product.images.length > 0) {
      return product.images.map(img => ({
        ...img,
        image_url: getFullImageUrl(img.image_url)
      }))
    }
    
    // Fallback to single image if no images array
    if (product.image_url) {
      return [{ 
        image_url: getFullImageUrl(product.image_url), 
        is_main: true, 
        id: 0, 
        image: '', 
        order: 0, 
        alt_text: product.title 
      }]
    }
    
    return []
  }

  const nextImage = () => {
    const images = getAllImages()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getAllImages()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      })
      navigate("/login")
      return
    }

    if (!product) return

    setAddingToCart(true)
    try {
      const response = await apiClient.addToCart(product.id, 1)
      // addToCart returns response.data directly, so response is the cart item data
      if (response) {
        toast({
          title: "Added to Cart",
          description: `${product.title} has been added to your cart`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-white to-[#FFF8DC]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#52B788]/30 border-t-[#52B788] mx-auto mb-6"></div>
              <p className="text-[#1B4332] text-lg font-medium">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-white to-[#FFF8DC]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-[#52B788]/20 to-[#2D5016]/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Package className="w-12 h-12 text-[#52B788]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1B4332] mb-4">Product Not Found</h1>
            <p className="text-[#6B7280] mb-8">This product may have been sold or removed.</p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
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
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 text-[#1B4332] hover:text-[#52B788] hover:bg-[#52B788]/10 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-6">
            <div className="relative">
              {/* Main Image Container */}
              <div className="aspect-square relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#B7E4C7]/20">
                {(() => {
                  const images = getAllImages()
                  if (images.length === 0) {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20">
                        <Package className="w-24 h-24 text-[#52B788]/40" />
                      </div>
                    )
                  }

                  const currentImage = images[currentImageIndex]
                  return (
                    <>
                      <img
                        src={currentImage.image_url || "/placeholder.svg?height=600&width=600"}
                        alt={currentImage.alt_text || product.title}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                      
                      {/* Navigation arrows - Enhanced styling */}
                      {images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white border-[#B7E4C7]/30 text-[#1B4332] hover:text-[#52B788] shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white border-[#B7E4C7]/30 text-[#1B4332] hover:text-[#52B788] shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </>
                      )}

                      {/* Image counter - Enhanced styling */}
                      {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full border border-white/20">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      )}
                    </>
                  )
                })()}
                
                {/* Sold overlay - Enhanced */}
                {product.is_sold && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center rounded-3xl">
                    <div className="bg-white rounded-2xl px-8 py-4 shadow-2xl">
                      <Badge className="text-lg px-6 py-2 bg-[#6B7280] text-white">
                        SOLD OUT
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Eco-friendly badge - Removed unnecessary text */}
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Leaf className="w-3 h-3" />
                    <span className="text-xs font-medium">Sustainable</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail navigation - Enhanced */}
              {(() => {
                const images = getAllImages()
                if (images.length > 1) {
                  return (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'border-[#52B788] shadow-lg scale-105'
                              : 'border-[#E5E7EB] hover:border-[#52B788]/50 hover:shadow-md'
                          }`}
                        >
                          <img
                            src={image.image_url || "/placeholder.svg?height=150&width=150"}
                            alt={image.alt_text || `${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {image.is_main && (
                            <div className="absolute top-1 left-1 bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white text-xs px-2 py-0.5 rounded-full">
                              Main
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#B7E4C7]/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-[#1B4332] mb-4 leading-tight">{product.title}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-4xl font-bold text-[#1B4332]">
                      ${product.price}
                    </span>
                    <Badge className="bg-white border border-[#B7E4C7] text-[#1B4332] px-3 py-1 text-sm font-medium">
                      {product.condition.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className="bg-white border border-[#B7E4C7] text-[#1B4332] px-3 py-1 text-sm">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 rounded-2xl border border-[#B7E4C7]/30">
                  <Eye className="w-6 h-6 text-[#52B788] mx-auto mb-2" />
                  <div className="text-lg font-bold text-[#1B4332]">{product.view_count || 0}</div>
                  <div className="text-xs text-[#6B7280]">Views</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 rounded-2xl border border-[#B7E4C7]/30">
                  <Calendar className="w-6 h-6 text-[#52B788] mx-auto mb-2" />
                  <div className="text-lg font-bold text-[#1B4332]">{new Date(product.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-[#6B7280]">Listed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 rounded-2xl border border-[#B7E4C7]/30">
                  <Package className="w-6 h-6 text-[#52B788] mx-auto mb-2" />
                  <div className="text-lg font-bold text-[#1B4332]">{product.quantity}</div>
                  <div className="text-xs text-[#6B7280]">Available</div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#B7E4C7]/30 pt-6">
                <h3 className="text-xl font-bold text-[#1B4332] mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#52B788]" />
                  Description
                </h3>
                <p className="text-[#6B7280] leading-relaxed text-lg">{product.description}</p>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#B7E4C7]/20">
              <h3 className="text-2xl font-bold text-[#1B4332] mb-6">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#52B788]" />
                    Basic Information
                  </h4>
                  <div className="space-y-3 pl-7">
                    {product.brand && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Brand</span>
                        <span className="text-[#1B4332] font-semibold">{product.brand}</span>
                      </div>
                    )}
                    {product.model && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Model</span>
                        <span className="text-[#1B4332] font-semibold">{product.model}</span>
                      </div>
                    )}
                    {product.year_of_manufacture && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Year</span>
                        <span className="text-[#1B4332] font-semibold">{product.year_of_manufacture}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Color</span>
                        <span className="text-[#1B4332] font-semibold">{product.color}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Material</span>
                        <span className="text-[#1B4332] font-semibold">{product.material}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Physical Properties */}
                {(product.length || product.width || product.height || product.weight) && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#52B788]" />
                      Dimensions & Weight
                    </h4>
                    <div className="space-y-3 pl-7">
                      {product.length && (
                        <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                          <span className="text-[#6B7280] font-medium">Length</span>
                          <span className="text-[#1B4332] font-semibold">{product.length} cm</span>
                        </div>
                      )}
                      {product.width && (
                        <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                          <span className="text-[#6B7280] font-medium">Width</span>
                          <span className="text-[#1B4332] font-semibold">{product.width} cm</span>
                        </div>
                      )}
                      {product.height && (
                        <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                          <span className="text-[#6B7280] font-medium">Height</span>
                          <span className="text-[#1B4332] font-semibold">{product.height} cm</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                          <span className="text-[#6B7280] font-medium">Weight</span>
                          <span className="text-[#1B4332] font-semibold">{product.weight} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Condition & Accessories */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#52B788]" />
                    Condition & Accessories
                  </h4>
                  <div className="space-y-3 pl-7">
                    <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                      <span className="text-[#6B7280] font-medium">Condition</span>
                      <Badge className="bg-white border border-[#B7E4C7] text-[#1B4332]">
                        {product.condition.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                      <span className="text-[#6B7280] font-medium">Original Packaging</span>
                      <span className={`font-semibold ${product.original_packaging ? 'text-[#52B788]' : 'text-[#6B7280]'}`}>
                        {product.original_packaging ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                      <span className="text-[#6B7280] font-medium">Manual/Instructions</span>
                      <span className={`font-semibold ${product.manual_instructions ? 'text-[#52B788]' : 'text-[#6B7280]'}`}>
                        {product.manual_instructions ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#52B788]" />
                    Additional Information
                  </h4>
                  <div className="space-y-3 pl-7">
                    <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                      <span className="text-[#6B7280] font-medium">Category</span>
                      <span className="text-[#1B4332] font-semibold">{product.category_name}</span>
                    </div>
                    {product.location && (
                      <div className="flex justify-between items-center py-2 border-b border-[#B7E4C7]/20">
                        <span className="text-[#6B7280] font-medium">Location</span>
                        <span className="text-[#1B4332] font-semibold">{product.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Working Condition Description */}
              {product.working_condition_description && (
                <div className="mt-8 p-6 bg-gradient-to-br from-[#F8FDF8] to-[#B7E4C7]/20 rounded-2xl border border-[#B7E4C7]/30">
                  <h4 className="font-bold text-[#1B4332] mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#52B788]" />
                    Working Condition
                  </h4>
                  <p className="text-[#6B7280] leading-relaxed">{product.working_condition_description}</p>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#B7E4C7]/20 rounded-3xl shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="font-bold text-[#1B4332] mb-6 text-xl">Seller Information</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-4 border-[#52B788]/20">
                      <AvatarImage src={getFullImageUrl(product.seller?.profile_image_url) || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-[#52B788] to-[#2D5016] text-white">
                        {product.seller?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-3 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1B4332] text-lg">{product.seller?.username || 'Unknown Seller'}</p>
                    <p className="text-[#6B7280]">Trusted seller</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20">
                        Verified Seller
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!product.is_sold && user?.id !== product.seller?.id && (
                <Button 
                  onClick={handleAddToCart} 
                  disabled={addingToCart} 
                  className="w-full bg-gradient-to-r from-[#52B788] to-[#2D5016] text-white hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] py-6 text-lg font-semibold rounded-2xl"
                  size="lg"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  {addingToCart ? "Adding to Cart..." : "Add to Cart"}
                </Button>
              )}

              {product.is_sold && (
                <Button 
                  disabled 
                  className="w-full py-6 text-lg font-semibold rounded-2xl bg-[#6B7280]/20 text-[#6B7280]" 
                  size="lg"
                >
                  This item has been sold
                </Button>
              )}

              {user?.id === product.seller?.id && (
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/products/${product.id}/edit`)} 
                    className="flex-1 border-[#52B788] text-[#52B788] hover:bg-[#52B788] hover:text-white py-6 text-lg font-semibold rounded-2xl transition-all duration-300"
                  >
                    Edit Product
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 py-6 text-lg font-semibold rounded-2xl"
                  >
                    Delete Product
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
