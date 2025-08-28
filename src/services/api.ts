import { Product, CartItem, User, Order, ApiResponse } from '../types';
import { products } from '../data/products';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export class ApiService {
  // Products API
  static async getProducts(category?: string, search?: string): Promise<ApiResponse<Product[]>> {
    await delay(500);
    
    let filteredProducts = products;
    
    if (category && category !== 'All') {
      filteredProducts = products.filter(p => p.category === category);
    }
    
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return {
      data: filteredProducts,
      message: 'Products fetched successfully',
      success: true,
    };
  }

  static async getProduct(id: string): Promise<ApiResponse<Product | null>> {
    await delay(300);
    
    const product = products.find(p => p.id === id);
    
    return {
      data: product || null,
      message: product ? 'Product fetched successfully' : 'Product not found',
      success: !!product,
    };
  }

  static async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    await delay(400);
    
    const featured = products.filter(p => p.featured);
    
    return {
      data: featured,
      message: 'Featured products fetched successfully',
      success: true,
    };
  }

  // Cart API (using localStorage)
  static async getCart(): Promise<ApiResponse<CartItem[]>> {
    await delay(200);
    
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];
    
    return {
      data: cart,
      message: 'Cart fetched successfully',
      success: true,
    };
  }

  static async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<CartItem[]>> {
    await delay(300);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return {
        data: [],
        message: 'Product not found',
        success: false,
      };
    }

    const cartData = localStorage.getItem('cart');
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return {
      data: cart,
      message: 'Product added to cart successfully',
      success: true,
    };
  }

  static async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<CartItem[]>> {
    await delay(200);
    
    const cartData = localStorage.getItem('cart');
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return {
      data: cart,
      message: 'Cart updated successfully',
      success: true,
    };
  }

  static async removeFromCart(productId: string): Promise<ApiResponse<CartItem[]>> {
    return this.updateCartItem(productId, 0);
  }

  static async clearCart(): Promise<ApiResponse<[]>> {
    await delay(200);
    
    localStorage.removeItem('cart');
    
    return {
      data: [],
      message: 'Cart cleared successfully',
      success: true,
    };
  }

  // User API
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(300);
    
    return {
      data: mockUser,
      message: 'User fetched successfully',
      success: true,
    };
  }

  // Orders API
  static async createOrder(cartItems: CartItem[]): Promise<ApiResponse<Order>> {
    await delay(800);
    
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: mockUser.id,
      items: cartItems,
      total,
      status: 'pending',
      createdAt: new Date(),
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    };

    // Save order to localStorage
    const ordersData = localStorage.getItem('orders');
    const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return {
      data: order,
      message: 'Order created successfully',
      success: true,
    };
  }

  static async getOrders(): Promise<ApiResponse<Order[]>> {
    await delay(400);
    
    const ordersData = localStorage.getItem('orders');
    const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
    
    return {
      data: orders,
      message: 'Orders fetched successfully',
      success: true,
    };
  }
}