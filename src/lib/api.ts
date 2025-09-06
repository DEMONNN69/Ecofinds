const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || "An error occurred" : undefined,
        status: response.status,
      }
    } catch (error) {
      return {
        error: "Network error occurred",
        status: 0,
      }
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string
    password: string
    password_confirm: string
    username: string
  }) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.data?.access_token) {
      this.setToken(response.data.access_token)
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refresh_token)
      }
    }

    return response
  }

  async logout() {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null

    const response = await this.request("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    this.clearToken()
    return response
  }

  // User endpoints
  async getUserProfile() {
    return this.request("/users/profile/")
  }

  async getUserDashboard() {
    return this.request("/users/dashboard/")
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number
    search?: string
    category?: string
    min_price?: number
    max_price?: number
    sort_by?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/products/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return this.request(endpoint)
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}/`)
  }

  async createProduct(productData: FormData) {
    return this.request("/products/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: productData,
    })
  }

  async updateProduct(id: number, productData: FormData) {
    return this.request(`/products/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: productData,
    })
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}/`, {
      method: "DELETE",
    })
  }

  async getMyListings(params?: { page?: number; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/products/my-listings/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return this.request(endpoint)
  }

  // Categories
  async getCategories() {
    return this.request("/categories/")
  }

  // Cart endpoints
  async getCart() {
    return this.request("/cart/")
  }

  async addToCart(productId: number, quantity = 1) {
    return this.request("/cart/", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.request(`/cart/items/${itemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId: number) {
    return this.request(`/cart/items/${itemId}/`, {
      method: "DELETE",
    })
  }

  async clearCart() {
    return this.request("/cart/clear/", {
      method: "DELETE",
    })
  }

  // Purchase endpoints
  async createPurchase(purchaseData: {
    items: Array<{ product_id: number; quantity: number; price: number }>
    shipping_address: string
    payment_method: string
    total_amount: number
  }) {
    return this.request("/purchases/", {
      method: "POST",
      body: JSON.stringify(purchaseData),
    })
  }

  async getPurchaseHistory(params?: {
    page?: number
    status?: string
    date_from?: string
    date_to?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/purchases/history/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return this.request(endpoint)
  }

  // Search
  async searchProducts(params: {
    q: string
    category?: string
    min_price?: number
    max_price?: number
    condition?: string
    location?: string
    sort_by?: string
    page?: number
  }) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return this.request(`/search/?${queryParams.toString()}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
