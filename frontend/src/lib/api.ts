import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Types based on your Django models
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name?: string;
  price: string;
  quantity: number;
  condition: string;
  
  // Product Details
  year_of_manufacture?: number;
  brand?: string;
  model?: string;
  
  // Physical Properties  
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  material?: string;
  color?: string;
  
  // Package and Documentation
  original_packaging: boolean;
  manual_instructions: boolean;
  working_condition_description?: string;
  
  // Media and Location
  image_url?: string;
  location?: string;
  
  // Seller and Status
  seller?: User;
  is_sold: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  product_count: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  added_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
  updated_at: string;
}

export interface Purchase {
  id: number;
  order_number: string;
  buyer?: User;
  items: PurchaseItem[];
  shipping_address: string;
  payment_method: string;
  total_amount: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

export interface PurchaseItem {
  id: number;
  product: Product;
  quantity: number;
  price_at_purchase: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  username: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    this.loadTokens();

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            return this.client.request(error.config);
          } catch (refreshError) {
            this.logout();
            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Authentication Methods
  async login(credentials: LoginCredentials) {
    const response = await this.client.post('/auth/login/', credentials);
    const { access_token, refresh_token, ...userData } = response.data;
    this.saveTokens(access_token, refresh_token);
    return userData;
  }

  async register(data: RegisterData) {
    const response = await this.client.post('/auth/register/', data);
    const { access_token, refresh_token, ...userData } = response.data;
    this.saveTokens(access_token, refresh_token);
    return userData;
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await this.client.post('/auth/logout/', {
          refresh_token: this.refreshToken,
        });
      }
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.client.post('/auth/refresh/', {
      refresh_token: this.refreshToken,
    });
    
    this.saveTokens(response.data.access_token, response.data.refresh_token);
  }

  // User Methods
  async getUserProfile(): Promise<User> {
    const response = await this.client.get('/users/profile/');
    return response.data;
  }

  async updateUserProfile(data: Partial<User>, image?: File): Promise<User> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    if (image) {
      formData.append('profile_image', image);
    }

    const response = await this.client.patch('/users/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getUserDashboard() {
    const response = await this.client.get('/users/dashboard/');
    return response.data;
  }

  // Product Methods
  async getProducts(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.client.get('/products/', { params });
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.client.get(`/products/${id}/`);
    return response.data;
  }

  async createProduct(data: FormData): Promise<Product> {
    const response = await this.client.post('/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateProduct(id: number, data: FormData): Promise<Product> {
    const response = await this.client.patch(`/products/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/products/${id}/`);
  }

  async getMyListings(params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.client.get('/products/my-listings/', { params });
    return response.data;
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get('/categories/');
    return response.data;
  }

  // Cart Methods
  async getCart(): Promise<Cart> {
    const response = await this.client.get('/cart/');
    return response.data;
  }

  async addToCart(productId: number, quantity: number = 1) {
    const response = await this.client.post('/cart/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const response = await this.client.patch(`/cart/items/${id}/`, { quantity });
    return response.data;
  }

  async removeFromCart(id: number): Promise<void> {
    await this.client.delete(`/cart/items/${id}/`);
  }

  async clearCart() {
    const response = await this.client.delete('/cart/clear/');
    return response.data;
  }

  // Purchase Methods
  async createPurchase(data: {
    cart_id?: number;
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
    shipping_address: string;
    payment_method: string;
    total_amount: number;
  }): Promise<Purchase> {
    const response = await this.client.post('/purchases/', data);
    return response.data;
  }

  async getPurchaseHistory(params?: {
    page?: number;
    page_size?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedResponse<Purchase>> {
    const response = await this.client.get('/purchases/history/', { params });
    return response.data;
  }

  async getPurchase(id: number): Promise<Purchase> {
    const response = await this.client.get(`/purchases/${id}/`);
    return response.data;
  }

  // Search Methods
  async searchProducts(params: {
    q: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    condition?: string;
    location?: string;
    sort_by?: string;
    page?: number;
    page_size?: number;
  }) {
    const response = await this.client.get('/search/', { params });
    return response.data;
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
