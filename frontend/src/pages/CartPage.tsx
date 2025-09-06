

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient, Cart } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag, Leaf, Sparkles, Star, CreditCard } from "lucide-react"
import { getProductImageUrl } from "@/lib/imageUtils"

export default function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchCart()
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      const cartData = await apiClient.getCart()
      // getCart returns response.data directly, so cartData is the cart object
      setCart(cartData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await apiClient.updateCartItem(itemId, newQuantity)
      // updateCartItem returns response.data directly, so we just refresh the cart
      await fetchCart() // Refresh cart
      toast({
        title: "Updated",
        description: "Cart item quantity updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      await apiClient.removeFromCart(itemId)
      // removeFromCart returns void, so we just refresh the cart
      await fetchCart() // Refresh cart
      toast({
        title: "Removed",
        description: "Item removed from cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return

    if (!shippingAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a shipping address",
        variant: "destructive",
      })
      return
    }

    setCheckoutLoading(true)
    try {
      const purchaseData = {
        cart_id: cart.id,
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: parseFloat(item.product.price), // Convert string to number
        })),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_amount: parseFloat(cart.total_price.toString()), // Convert to number
      }

      const purchase = await apiClient.createPurchase(purchaseData)
      // createPurchase returns response.data directly, so purchase is the purchase object
      toast({
        title: "Order Placed!",
        description: `Your order #${purchase.order_number} has been placed successfully`,
      })

      // Redirect to purchase history
      navigate("/profile?tab=purchases")
    } catch (error) {
      toast({
        title: "Error",
        description: "Checkout failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FDF8] via-[#FFF8DC] to-[#B7E4C7]/20 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#52B788]/20 animate-pulse" />
          <Sparkles className="absolute top-32 right-[15%] w-6 h-6 text-[#2D5016]/30 animate-bounce" />
          <ShoppingBag className="absolute bottom-40 left-[20%] w-10 h-10 text-[#52B788]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#52B788] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <div className="w-48 h-4 bg-[#52B788]/20 rounded-full mx-auto animate-pulse"></div>
                <div className="w-32 h-3 bg-[#52B788]/10 rounded-full mx-auto animate-pulse"></div>
              </div>
              <p className="text-[#2D5016]/70 mt-4 text-lg">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <img
                      src={getProductImageUrl(item.product.image_url, "80x80")}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Sold by {item.product.seller?.username || 'Unknown Seller'}
                    </p>
                    <p className="text-lg font-bold text-primary">${item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({cart.total_items})</span>
                <span>${parseFloat(cart.total_price.toString()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${parseFloat(cart.total_price.toString()).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping Address</Label>
                <Textarea
                  id="shipping"
                  placeholder="Enter your full shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Payment Method</Label>
                <select
                  id="payment"
                  className="w-full p-2 border rounded-md"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <Button onClick={handleCheckout} disabled={checkoutLoading} className="w-full" size="lg">
                {checkoutLoading ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
