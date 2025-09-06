

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient, Product } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useToast } from "../hooks/use-toast"
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Slider */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {(() => {
              const images = getAllImages()
              if (images.length === 0) {
                return (
                  <img
                    src="/placeholder.svg?height=600&width=600"
                    alt="No image available"
                    className="w-full h-full object-cover"
                  />
                )
              }

              const currentImage = images[currentImageIndex]
              return (
                <>
                  <img
                    src={currentImage.image_url || "/placeholder.svg?height=600&width=600"}
                    alt={currentImage.alt_text || product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows - only show if more than 1 image */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white text-sm px-2 py-1 rounded">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
              )
            })()}
            
            {product.is_sold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  SOLD
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail navigation - only show if more than 1 image */}
          {(() => {
            const images = getAllImages()
            if (images.length > 1) {
              return (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-muted hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={image.image_url || "/placeholder.svg?height=150&width=150"}
                        alt={image.alt_text || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.is_main && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
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

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              <Badge variant="outline" className="text-sm">
                {product.condition}
              </Badge>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Product Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                <div className="space-y-1">
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Brand:</span>
                      <span className="text-sm font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.model && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Model:</span>
                      <span className="text-sm font-medium">{product.model}</span>
                    </div>
                  )}
                  {product.year_of_manufacture && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Year:</span>
                      <span className="text-sm font-medium">{product.year_of_manufacture}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Color:</span>
                      <span className="text-sm font-medium">{product.color}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Material:</span>
                      <span className="text-sm font-medium">{product.material}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Properties */}
              {(product.length || product.width || product.height || product.weight) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dimensions & Weight</h4>
                  <div className="space-y-1">
                    {product.length && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Length:</span>
                        <span className="text-sm font-medium">{product.length} cm</span>
                      </div>
                    )}
                    {product.width && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Width:</span>
                        <span className="text-sm font-medium">{product.width} cm</span>
                      </div>
                    )}
                    {product.height && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Height:</span>
                        <span className="text-sm font-medium">{product.height} cm</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Weight:</span>
                        <span className="text-sm font-medium">{product.weight} kg</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Condition & Accessories */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Condition & Accessories</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Condition:</span>
                    <Badge variant="outline" className="text-xs">
                      {product.condition.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Original Packaging:</span>
                    <span className="text-sm font-medium">{product.original_packaging ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Manual/Instructions:</span>
                    <span className="text-sm font-medium">{product.manual_instructions ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <span className="text-sm font-medium">{product.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Additional Information</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="text-sm font-medium">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Listed:</span>
                    <span className="text-sm font-medium">{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Views:</span>
                    <span className="text-sm font-medium">{product.view_count}</span>
                  </div>
                  {product.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm font-medium">{product.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Working Condition Description */}
            {product.working_condition_description && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Working Condition</h4>
                <p className="text-sm text-muted-foreground">{product.working_condition_description}</p>
              </div>
            )}
          </div>

          {/* Seller Info - Minimal */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Seller</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getFullImageUrl(product.seller?.profile_image_url) || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{product.seller?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{product.seller?.username || 'Unknown Seller'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!product.is_sold && user?.id !== product.seller?.id && (
              <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addingToCart ? "Adding to Cart..." : "Add to Cart"}
              </Button>
            )}

            {product.is_sold && (
              <Button disabled className="w-full" size="lg">
                This item has been sold
              </Button>
            )}

            {user?.id === product.seller?.id && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/products/${product.id}/edit`)} className="flex-1">
                  Edit Product
                </Button>
                <Button variant="destructive" className="flex-1">
                  Delete Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
