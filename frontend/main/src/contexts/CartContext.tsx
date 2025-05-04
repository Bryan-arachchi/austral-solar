'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products-api';
import { toast } from 'sonner';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingItem = currentItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item exists
        return currentItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Create new CartItem from Product
      const newItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] // Use first image from images array
      };

      // Add new item
      return [...currentItems, newItem];
    });

    // Show toast only when adding new item
    toast.success('Added to cart');
  }, []);

  const removeFromCart = (productId: string) => {
    const itemToRemove = items.find(item => item._id === productId);
    setItems(currentItems => currentItems.filter(item => item._id !== productId));
    if (itemToRemove) {
      toast.success('Removed from cart', {
        description: `${itemToRemove.name} removed from your cart`
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared', {
      description: 'All items have been removed from your cart'
    });
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartTotal = () => total;

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 