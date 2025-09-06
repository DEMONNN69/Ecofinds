import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiClient, Purchase } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Search, Filter, Grid3X3 } from "lucide-react"
import { getProductImageUrl } from "@/lib/imageUtils"

export default function PurchaseHistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date_desc")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchPurchases()
  }, [user, navigate])

  const fetchPurchases = async () => {
    try {
      const response = await apiClient.getPurchaseHistory()
      setPurchases(response.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load purchase history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Flatten purchases to individual items for the wireframe layout
  const getAllPurchaseItems = () => {
    const allItems: Array<{
      purchaseId: number
      orderNumber: string
      purchaseDate: string
      status: string
      product: {
        id: number
        title: string
        image_url?: string
        category_name?: string
        seller?: {
          username: string
        }
      }
      quantity: number
      price: string
    }> = []

    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        allItems.push({
          purchaseId: purchase.id,
          orderNumber: purchase.order_number,
          purchaseDate: purchase.created_at,
          status: purchase.status,
          product: item.product,
          quantity: item.quantity,
          price: item.price_at_purchase.toString()
        })
      })
    })

    return allItems
  }

  const filteredItems = getAllPurchaseItems().filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBy === "all" || item.status === filterBy
    return matchesSearch && matchesFilter
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "date_desc":
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      case "date_asc":
        return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      case "price_desc":
        return parseFloat(b.price) - parseFloat(a.price)
      case "price_asc":
        return parseFloat(a.price) - parseFloat(b.price)
      case "name_asc":
        return a.product.title.localeCompare(b.product.title)
      case "name_desc":
        return b.product.title.localeCompare(a.product.title)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading purchase history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Previous Purchases</h1>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                <SelectItem value="name_desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Layout toggle (for future use) */}
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Purchase Items List */}
      {sortedItems.length > 0 ? (
        <div className="space-y-3">
          {sortedItems.map((item, index) => (
            <Card key={`${item.purchaseId}-${item.product.id}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={getProductImageUrl(item.product.image_url, "64x64")}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg leading-6 truncate mb-1">
                          {item.product.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>${item.price}</span>
                          {item.product.category_name && (
                            <Badge variant="outline" className="text-xs">
                              {item.product.category_name}
                            </Badge>
                          )}
                          {item.product.seller?.username && (
                            <span>Sold by {item.product.seller.username}</span>
                          )}
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="text-right ml-4">
                        <Badge 
                          variant={item.status === "completed" ? "default" : 
                                 item.status === "pending" ? "secondary" : "destructive"}
                          className="mb-2"
                        >
                          {item.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Order #{item.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="mb-4">
                {searchTerm || filterBy !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You haven't made any purchases yet"}
              </p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
