

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiClient } from "../lib/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Search, Grid, List } from "lucide-react"
import { useToast } from "../hooks/use-toast"

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
    profile_image_url: string
  }
  is_sold: boolean
  created_at: string
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  product_count: number
}

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

      if (productsResponse.data) {
        setProducts(productsResponse.data.results || [])
      }

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data || [])
      }
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

      if (response.data) {
        setProducts(response.data.results || [])
      }
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

      if (response.data) {
        setProducts(response.data.results || [])
      }
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Discover Sustainable Products</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Find eco-friendly products from trusted sellers in our sustainable marketplace
        </p>

        {/* Search Bar */}
        <div className="flex max-w-md mx-auto gap-2">
          <Input
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => filterByCategory("")}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <span className="text-2xl">🌍</span>
            <span className="text-sm">All</span>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              onClick={() => filterByCategory(category.slug)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">{category.icon || "📦"}</span>
              <span className="text-sm">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.product_count}
              </Badge>
            </Button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory ? `Products in ${selectedCategory}` : "Featured Products"}
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
                      <img
                        src={product.image_url || "/placeholder.svg?height=200&width=200"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {product.is_sold && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="secondary">SOLD</Badge>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <Badge variant="outline">{product.condition}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.seller.username}</span>
                      {product.location && (
                        <>
                          <span>•</span>
                          <span>{product.location}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
