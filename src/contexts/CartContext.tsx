import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { ApiService } from '../services/api';

interface CartState {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  total: number;
}

type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ITEMS':
      const items = action.payload;
      return {
        ...state,
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0,
      };
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: true,
    itemCount: 0,
    total: 0,
  });

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await ApiService.getCart();
        dispatch({ type: 'SET_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const response = await ApiService.addToCart(productId, quantity);
      if (response.success) {
        dispatch({ type: 'SET_ITEMS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      const response = await ApiService.updateCartItem(productId, quantity);
      if (response.success) {
        dispatch({ type: 'SET_ITEMS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await ApiService.removeFromCart(productId);
      if (response.success) {
        dispatch({ type: 'SET_ITEMS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ state, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}