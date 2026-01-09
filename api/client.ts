import { Platform } from 'react-native';

// Configuration
const getBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.remi.com'; // Production URL
  }

  // For Android emulator use 10.0.2.2, for iOS device use host LAN IP, simulator uses localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2';
  }

  // Physical iPhone on same Wi‑Fi as host
  return 'http://192.168.100.9';
};

const BASE_URL = getBaseUrl();

// Service URLs
export const API_ENDPOINTS = {
  AUTH: `${BASE_URL}:3001/api/auth`,
  CATALOG: `${BASE_URL}:3002/api`,
  CART: `${BASE_URL}:3003/api/cart`,
  CHECKOUT: `${BASE_URL}:3004/api/orders`,
};

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified: boolean;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  country: string;
  store: string;
  providerId: string;
  image?: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// API Client class
class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add timeout for network requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Network request timed out. Make sure the backend services are running.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{ message: string; token: string; user: User }>(
      `${API_ENDPOINTS.AUTH}/register`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async login(email: string, password: string) {
    return this.request<{ message: string; token: string; user: User }>(
      `${API_ENDPOINTS.AUTH}/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async verify(email: string, code: string) {
    return this.request<{ message: string; user: User }>(
      `${API_ENDPOINTS.AUTH}/verify`,
      {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      }
    );
  }

  async resendVerification(email: string) {
    return this.request<{ message: string }>(
      `${API_ENDPOINTS.AUTH}/resend-verification`,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  }

  async getCurrentUser() {
    return this.request<{ user: User }>(`${API_ENDPOINTS.AUTH}/me`);
  }

  // Catalog endpoints
  async getProducts(params?: {
    category?: string;
    country?: string;
    search?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{
      products: Product[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`${API_ENDPOINTS.CATALOG}/products?${queryParams}`);
  }

  async getProduct(id: string) {
    return this.request<{ product: Product }>(
      `${API_ENDPOINTS.CATALOG}/products/${id}`
    );
  }

  async getProviders(params?: {
    category?: string;
    country?: string;
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{ providers: any[] }>(
      `${API_ENDPOINTS.CATALOG}/providers?${queryParams}`
    );
  }

  async getProvider(id: string) {
    return this.request<{ provider: any }>(
      `${API_ENDPOINTS.CATALOG}/providers/${id}`
    );
  }

  // Cart endpoints
  async getCart() {
    return this.request<{ cart: Cart }>(API_ENDPOINTS.CART);
  }

  async addToCart(item: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }) {
    return this.request<{ message: string; cart: Cart }>(
      `${API_ENDPOINTS.CART}/items`,
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request<{ message: string; cart: Cart }>(
      `${API_ENDPOINTS.CART}/items/${productId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }
    );
  }

  async removeFromCart(productId: string) {
    return this.request<{ message: string; cart: Cart }>(
      `${API_ENDPOINTS.CART}/items/${productId}`,
      {
        method: 'DELETE',
      }
    );
  }

  async clearCart() {
    return this.request<{ message: string; cart: Cart }>(API_ENDPOINTS.CART, {
      method: 'DELETE',
    });
  }

  // Checkout endpoints
  async createOrder(data: {
    shippingAddress: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
    paymentMethod: string;
  }) {
    return this.request<{ message: string; order: Order }>(
      API_ENDPOINTS.CHECKOUT,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{
      orders: Order[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`${API_ENDPOINTS.CHECKOUT}?${queryParams}`);
  }

  async getOrder(id: string) {
    return this.request<{ order: Order }>(`${API_ENDPOINTS.CHECKOUT}/${id}`);
  }

  async cancelOrder(id: string) {
    return this.request<{ message: string; order: Order }>(
      `${API_ENDPOINTS.CHECKOUT}/${id}/cancel`,
      {
        method: 'POST',
      }
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

