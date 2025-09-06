

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useToast } from "../hooks/use-toast"
import { ArrowLeft, ShoppingCart, MapPin, Calendar } from "lucide-react"

interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  image_url: string
  condition: string
  location: string
  seller: {
    id: number
    username: string
    email: string
    profile_image_url: string
  }
  is_sold: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await apiClient.getProduct(Number(id))
      if (response.data) {
        setProduct(response.data)
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
        navigate("/")
      }
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
      if (response.data) {
        toast({
          title: "Added to Cart",
          description: `${product.title} has been added to your cart`,
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add to cart",
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
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.image_url || "/placeholder.svg?height=600&width=600"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.is_sold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  SOLD
                </Badge>
              </div>
            )}
          </div>
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

          {/* Product Info */}
          <div className="space-y-3">
            {product.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{product.view_count} views</span>
            </div>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={product.seller.profile_image_url || "/placeholder.svg"} />
                  <AvatarFallback>{product.seller.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{product.seller.username}</p>
                  <p className="text-sm text-muted-foreground">{product.seller.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!product.is_sold && user?.id !== product.seller.id && (
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

            {user?.id === product.seller.id && (
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
