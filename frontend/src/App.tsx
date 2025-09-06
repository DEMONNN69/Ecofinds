import { Routes, Route } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Header } from "./components/Header"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Toaster } from "./components/ui/toaster"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import ProfilePage from "./pages/ProfilePage"
import AddProductPage from "./pages/AddProductPage"
import MyProductsPage from "./pages/MyProductsPage"
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage"

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-product/:id" 
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-products" 
            element={
              <ProtectedRoute>
                <MyProductsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchase-history" 
            element={
              <ProtectedRoute>
                <PurchaseHistoryPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
