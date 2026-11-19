'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  size: string;
  quantity: number;
  pricePlaceholder: string;
}

export interface CartBreakdown {
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  codFee: number;
  isCodAvailable: boolean;
  discountTotal: number;
  grandTotal: number;
  couponDetails?: any;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Record<string, boolean>;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  lastAddedItem: CartItem | null;
  dismissToast: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  breakdown: CartBreakdown;
  refreshBreakdown: (paymentMethod?: 'PREPAID' | 'COD', pinCode?: string) => Promise<CartBreakdown>;
}

const initialBreakdown: CartBreakdown = {
  subtotal: 0,
  shippingFee: 0,
  freeShippingThreshold: 999,
  amountNeededForFreeShipping: 999,
  codFee: 0,
  isCodAvailable: true,
  discountTotal: 0,
  grandTotal: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<CartBreakdown>(initialBreakdown);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('unsulid_cart');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedWishlist = localStorage.getItem('unsulid_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedCoupon = localStorage.getItem('unsulid_coupon');
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch {
      // LocalStorage not available or invalid
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state updates (client only)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('unsulid_cart', JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('unsulid_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem('unsulid_coupon', appliedCoupon);
      } else {
        localStorage.removeItem('unsulid_coupon');
      }
    } catch {}
  }, [appliedCoupon, isLoaded]);

  const refreshBreakdown = useCallback(
    async (paymentMethod: 'PREPAID' | 'COD' = 'PREPAID', pinCode?: string): Promise<CartBreakdown> => {
      if (items.length === 0) {
        const empty = { ...initialBreakdown };
        setBreakdown(empty);
        return empty;
      }

      try {
        const res = await api.cart.calculate({
          items: items.map((i) => ({ productId: i.slug, quantity: i.quantity })),
          paymentMethod,
          couponCode: appliedCoupon || undefined,
          pinCode,
        });

        if (res?.breakdown) {
          setBreakdown(res.breakdown);
          return res.breakdown;
        }
      } catch (err: any) {
        // Fallback calculation if offline
        const subtotal = items.reduce((acc, i) => {
          const price = i.slug === 'black' ? 1699 : 1499;
          return acc + price * i.quantity;
        }, 0);
        const shippingFee = subtotal >= 999 ? 0 : 99;
        const codFee = paymentMethod === 'COD' ? 50 : 0;
        const fallback: CartBreakdown = {
          subtotal,
          shippingFee,
          freeShippingThreshold: 999,
          amountNeededForFreeShipping: Math.max(0, 999 - subtotal),
          codFee,
          isCodAvailable: true,
          discountTotal: 0,
          grandTotal: subtotal + shippingFee + codFee,
        };
        setBreakdown(fallback);
        return fallback;
      }
      return initialBreakdown;
    },
    [items, appliedCoupon]
  );

  // Recalculate whenever items or applied coupon change
  useEffect(() => {
    if (isLoaded) {
      refreshBreakdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, appliedCoupon, isLoaded]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemId = `${newItem.slug}-${newItem.size}`;
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemId);
      if (existing) {
        return prevItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prevItems, { ...newItem, id: itemId }];
    });

    setLastAddedItem({ ...newItem, id: itemId });
    setTimeout(() => {
      setLastAddedItem((current) => (current?.id === itemId ? null : current));
    }, 4000);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setBreakdown(initialBreakdown);
  };

  const applyCoupon = async (code: string) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const res = await api.coupons.apply(code.trim(), breakdown.subtotal);
      if (res?.isValid) {
        setAppliedCoupon(res.code);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const isWishlisted = (slug: string) => {
    return !!wishlist[slug];
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);
  const dismissToast = () => setLastAddedItem(null);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        lastAddedItem,
        dismissToast,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        breakdown,
        refreshBreakdown,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
