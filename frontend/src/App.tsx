import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { Header } from "./components/Header"
import { Toaster } from "./components/ui/toaster"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import ProfilePage from "./pages/ProfilePage"
import AddProductPage from "./pages/AddProductPage"
import MyProductsPage from "./pages/MyProductsPage"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products/:id/edit" element={<AddProductPage />} />
            <Route path="/my-products" element={<MyProductsPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
